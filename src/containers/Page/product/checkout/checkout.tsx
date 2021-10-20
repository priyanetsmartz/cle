import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import CheckoutSidebar from './sidebar';
import IntlMessages from "../../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import notification from '../../../../components/notification';
import { useIntl } from 'react-intl';
import { useHistory } from "react-router";
// import queryString from 'query-string'
import cartAction from "../../../../redux/cart/productAction";
import { getCartItems, getCartTotal, getGuestCart, getGuestCartTotal, applyPromoCode, getPaymentMethods, getShippinMethods, applyPromoCodeGuest, setGuestUserDeliveryAddress, placeGuestOrder, placeUserOrder, setUserDeliveryAddress, getAddressById, myFatoora } from '../../../../redux/cart/productApi';
import { getCustomerDetails, getCountriesList, getRegionsByCountryID, saveCustomerDetails } from '../../../../redux/pages/customers';
import { language } from '../../../../settings';
const { addToCartTask, showPaymentMethods, shippingAddressState, billingAddressState, getCheckoutSideBar } = cartAction;

function Checkout(props) {
    const intl = useIntl();
    let history = useHistory();
    const [itemsVal, SetItems] = useState({
        checkData: {}, items: {}, address: {}, shippingAddress: 0, shippingData: {}
    });
    const [promoCode, setPromoCode] = useState('');
    const [state, setState] = useState({
        email: ""
    })
    //for customer address starts here------
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [countries, setCountries] = useState([]); // for countries dropdown
    const [addNewAddressModal, setAddNewAddressModal] = useState(false);
    const [addBillingAddress, setAddBillingAddress] = useState(false);
    const [errorPromo, setErrorPromo] = useState('');
    // const [paymentMethodsList, SetPaymentMethodsList] = useState([])
    const [shippingMethods, SetShippingMethods] = useState([])
    const [isShow, setIsShow] = useState(false);
    const [isSetAddress, setIsSetAddress] = useState(0);
    const [isBillingAddress, setIsBillingAddress] = useState(0);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [regions, setRegions] = useState([]);
    const [emailError, setEmailError] = useState({
        errors: {}
    });
    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: custId ? custId : 0,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "AD",
        region_id: 0,
        street: "",
        default_shipping: true,
        default_billing: true,
    });

    const [billingAddressData, setBillingAddress] = useState({
        id: 0,
        customer_id: custId ? custId : 0,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "AD",
        region_id: 0,
        street: "",
        default_shipping: true,
        default_billing: true,
    });


    const [custForm, setCustForm] = useState({
        id: custId,
        email: "",
        firstname: "",
        lastname: "",
        gender: "",
        dob: "",
        website_id: 1,
        addresses: [],
        default_shipping: '',
        default_billing: '',
    });

    const [errors, setError] = useState({
        errors: {}
    });
    const [billingError, setBillingError] = useState({
        errors: {}
    });
    //for customer address ends here-------

    useEffect(() => {
        const queries = new URLSearchParams(props.location.search);
        let paymentId = queries.get('paymentId');
        let id = queries.get('Id');
        if (paymentId && id) {
            placeOrderonMagento('myfatoorah_gateway', paymentId);
        }
        let customer_id = localStorage.getItem('cust_id');
        checkoutScreen();
        if (customer_id) {
            getCutomerDetails();

        }
        getCountries();

        return () => {
            //   props.showPaymentMethods([]);
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages, props.payTrue, props.guestShipp, props.guestBilling])

    async function checkoutScreen() {
        let cartItems: any, cartTotal: any;
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id && localStorage.getItem('cartQuoteId')) {
            cartItems = await getCartItems();
            // get cart total 
            cartTotal = await getCartTotal();
        } else if ((!customer_id && localStorage.getItem('cartQuoteId')) || (customer_id && !localStorage.getItem('cartQuoteId'))) {

        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart();
                cartTotal = await getGuestCartTotal();
            }
        }
        //console.log(cartItems)
        let checkoutData = {}, checkItems = {}, ship = {};
        checkoutData['discount'] = cartTotal && cartTotal.data ? cartTotal.data.base_discount_amount : 0;
        checkoutData['sub_total'] = cartTotal && cartTotal.data ? cartTotal.data.base_subtotal : 0;
        checkoutData['shipping_charges'] = cartTotal && cartTotal.data ? cartTotal.data.base_shipping_amount : 0;
        checkoutData['total'] = cartTotal && cartTotal.data ? cartTotal.data.base_grand_total : 0;
        checkoutData['tax'] = cartTotal && cartTotal.data ? cartTotal.data.base_tax_amount : 0;
        checkoutData['total_items'] = cartTotal && cartTotal.data ? cartTotal.data.items_qty : 0;
        checkItems['items'] = cartItems && cartItems.data ? cartItems.data.items : [];
        //  console.log(cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.id)
        let shipingAdd = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.id : 0;

        ship['firstname'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.firstname : '';

        ship['lastname'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.lastname : '';

        ship['telephone'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.telephone : '';

        ship['postcode'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.postcode : '';

        ship['city'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.city : '';

        ship['country_id'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.country_id : '';

        ship['region_id'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.region_id : '';

        ship['street'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.street : '';
        props.getCheckoutSideBar({
            checkData: checkoutData,
            items: checkItems,
            shippingAddress: shipingAdd,
            shippingData: ship
        })
        SetItems(prevState => ({
            ...prevState,
            checkData: checkoutData,
            items: checkItems,
            shippingAddress: shipingAdd,
            shippingData: ship
        }))
        //  console.log(checkoutData)
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const handleBlur = (e) => {
        //console.log('herer')
        let error = {};
        let formIsValid = true;

        //Email   
        if (typeof state["email"] !== "undefined") {

            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["email"]))) {
                formIsValid = false;
                error["email"] = "Email is not valid";
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = "Email is required";
        }
        const acc = document.getElementById("accordion-buttonacc");
        const CheckoutTwo = document.getElementById("CheckoutTwo");
        acc.classList.remove("show");
        CheckoutTwo.classList.remove("show");
        setEmailError({ errors: error });
        return formIsValid;
    }
    //customer address functinonality start here
    const getCutomerDetails = async () => {
        let addresses = {};
        let result: any = await getCustomerDetails();
        setCustForm(result.data);
        // console.log(result.data)
        addresses['addresses'] = result.data ? result.data.addresses : '';
        SetItems(prevState => ({
            ...prevState,
            address: addresses
        }))
        // console.log(itemsVal.billingAddress)
        //    let paymentsMethods: any = await getPaymentMethods();
        //SetPaymentMethodsList(paymentsMethods)
    }

    const checkEmailData = async () => {
        if (state.email === "" && custId === "") {
            const acc = document.getElementById("accordion-buttonacc");
            const CheckoutTwo = document.getElementById("CheckoutTwo");

            acc.classList.add("show");
            CheckoutTwo.classList.add("show");
            acc.classList.remove("collapsed");
            let error = {};
            error["email"] = "Email is required";
            setEmailError({ errors: error });
        } else {
            // console.log('no here')
        }
    }


    const getCountries = async () => {
        let result: any = await getCountriesList();
        setCountries(result.data);
    }

    const toggleAddressModal = () => {
        setAddNewAddressModal(!addNewAddressModal);
    }
    const toggleBillingAddressModal = () => {
        setAddBillingAddress(!addBillingAddress);
    }
    const handleAddChange = (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleBillingAddressChange = (e) => {
        const { id, value } = e.target;
        setBillingAddress(prevState => ({
            ...prevState,
            [id]: value
        }))
    }




    const handleAddressChange = async (e) => {
        const { name, value, checked } = e.target;
        let selectedValue = parseInt(value);
        //console.log(typeof (selectedValue))
        if (checked) {
            setIsSetAddress(selectedValue)
            const address: any = await getAddressById(selectedValue);
            if (address.data) {
                let addressData: any = {};
                let addressInformation: any = {};

                let shippingAddress = {
                    customer_id: custId ? custId : 0,
                    firstname: address.data.firstname,
                    lastname: address.data.lastname,
                    telephone: address.data.telephone,
                    postcode: address.data.postcode,
                    city: address.data.city,
                    country_id: address.data.country_id,
                    region_id: address.data.region_id,
                    street: address.data.street,
                    // email: localStorage.getItem('token_email')
                };
                addressInformation.shippingAddress = shippingAddress;
                addressData.addressInformation = addressInformation;
                //console.log(addressData)
                let saveDelivery: any = await setUserDeliveryAddress(addressData);
                setIsSetAddress(0)
                if (saveDelivery.data) {
                    checkoutScreen()
                    notification("success", "", "Address Updated");
                } else {
                    notification("error", "", "Select Correct Address!");
                }

            } else {
                setIsSetAddress(0)
                notification("error", "", "Select Correct Address!");
            }
        }
    }

    const handleBillingChange = async (e) => {
        let addId = e.target.value;
        let checked = e.target.checked;
        let selectedValue = parseInt(addId);
        // console.log(itemsVal.shippingData['firstname'])
        if (checked) {
            setIsBillingAddress(selectedValue);
            const address: any = await getAddressById(addId);
            if (address.data) {
                let addressData: any = {};
                let addressInformation: any = {};

                let billingAddress = {
                    customer_id: custId ? custId : 0,
                    firstname: address.data.firstname,
                    lastname: address.data.lastname,
                    telephone: address.data.telephone,
                    postcode: address.data.postcode,
                    city: address.data.city,
                    country_id: address.data.country_id,
                    region_id: address.data.region_id,
                    street: address.data.street
                };

                let shippingAddress = {
                    customer_id: custId ? custId : 0,
                    firstname: itemsVal.shippingData['firstname'],
                    lastname: itemsVal.shippingData['lastname'],
                    telephone: itemsVal.shippingData['telephone'],
                    postcode: itemsVal.shippingData['postcode'],
                    city: itemsVal.shippingData['city'],
                    country_id: itemsVal.shippingData['country_id'],
                    region_id: itemsVal.shippingData['region_id'],
                    street: itemsVal.shippingData['street']
                }
                addressInformation.shippingAddress = shippingAddress;
                addressInformation.billingAddress = billingAddress;
                addressData.addressInformation = addressInformation;
                // console.log(addressData)
                let saveDelivery: any = await setUserDeliveryAddress(addressData);
                if (saveDelivery.data.payment_methods) {
                    setIsBillingAddress(0);
                    props.showPaymentMethods(saveDelivery.data.payment_methods);
                    notification("success", "", "Address Updated");
                } else {
                    setIsBillingAddress(0);
                    notification("error", "", "Select Correct Address!");
                }

            } else {
                setIsBillingAddress(0);
                notification("error", "", "Select Correct Address!");
            }
        }
    }
    const handleCountryChange = async (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }));

        const res: any = await getRegionsByCountryID(value);
        if (res.data.available_regions === undefined) {
            setRegions([]);
        } else {
            setRegions(res.data.available_regions);
        }

    }
    // get shipping methods
    const getshippingMethods = async () => {
        console.log(itemsVal.shippingData);
        if (itemsVal.shippingData['firstname'] === null && itemsVal.shippingData['postcode'] === null) {
            notification("error", "", "Please select delivery address!");
        } else {
            let result: any = await getShippinMethods();
            SetShippingMethods(result.data)
        }

    }

    // for customer address popup window starts here
    const saveCustAddress = async () => {
        let result: any
        if (validateAddress()) {

            let customer_id = localStorage.getItem('cust_id');
            let address: any = {};
            let addressInformation: any = {};

            let obj: any = { ...custAddForm };
            obj.street = [obj.street];
            if (!customer_id) {
                obj.email = state.email;
            }
            let shippingAddress = obj;


            delete shippingAddress['default_billing'];
            if (customer_id) {
                custForm.addresses.push(obj);

                let newAddress: any = await saveCustomerDetails(custId, { customer: custForm });
                // console.log(newAddress.data)
                delete shippingAddress['default_shipping'];

                delete shippingAddress['customer_id'];
                delete shippingAddress['id'];
                // delete shippingAddress['save_in_address_book'];
                addressInformation.shippingAddress = shippingAddress;
                address.addressInformation = addressInformation;

                // console.log(obj)
                result = await setUserDeliveryAddress(address);
                if (newAddress.data) {
                    getCutomerDetails();
                }


            } else {
                //dkdkdk
                props.shippingAddressState(shippingAddress)
                delete shippingAddress['customer_id'];
                delete shippingAddress['id'];
                delete shippingAddress['default_shipping'];
                addressInformation.shippingAddress = shippingAddress;
                address.addressInformation = addressInformation;
                // console.log(address)
                result = await setGuestUserDeliveryAddress(address);
            }
            if (result) {
                checkoutScreen();
                toggleAddressModal();
                notification("success", "", "Address Updated");
            }
        } else {

            console.log(errors)
        }
    }

    const saveBillingAddress = async () => {
        let result: any
        if (validateBillingAddress()) {

            let customer_id = localStorage.getItem('cust_id');
            let address: any = {};
            let addressInformation: any = {};

            let obj: any = { ...custAddForm };
            obj.street = [obj.street];
            if (!customer_id) {
                obj.email = state.email;
            }
            // let shippingAddress = obj;
            let shippingAddress = {
                customer_id: custId ? custId : 0,
                firstname: itemsVal.shippingData['firstname'],
                lastname: itemsVal.shippingData['lastname'],
                telephone: itemsVal.shippingData['telephone'],
                postcode: itemsVal.shippingData['postcode'],
                city: itemsVal.shippingData['city'],
                country_id: itemsVal.shippingData['country_id'],
                region_id: itemsVal.shippingData['region_id'],
                street: itemsVal.shippingData['street']
            }
            addressInformation.shippingAddress = shippingAddress;

            let billingObj: any = { ...billingAddressData };
            billingObj.street = [billingObj.street];
            if (!customer_id) {
                billingObj.email = state.email;
            }
            let billingAddress = billingObj;
            delete billingAddress['default_shipping']
            addressInformation.billingAddress = billingAddress;
            address.addressInformation = addressInformation;
            //console.log(address)
            if (customer_id) {

                custForm.addresses.push(billingObj);
                // console.log(custForm)
                let newAddress: any = await saveCustomerDetails(custId, { customer: custForm });
                // console.log(newAddress.data)
                // delete billingAddress['default_shipping'];
                delete billingAddress['default_billing'];
                delete shippingAddress['customer_id'];
                delete shippingAddress['id'];

                addressInformation.shippingAddress = shippingAddress;
                address.addressInformation = addressInformation;

                // console.log(obj)
                result = await setUserDeliveryAddress(address);
            } else {
                props.billingAddressState(billingAddress)
                delete billingAddress['customer_id'];
                delete billingAddress['id'];
                delete billingAddress['default_billing'];

                delete shippingAddress['customer_id'];
                delete shippingAddress['id'];
                delete shippingAddress['default_shipping'];
                result = await setGuestUserDeliveryAddress(address);
            }

            if (result.data) {
                // here 
                props.showPaymentMethods(result.data.payment_methods);
                checkoutScreen();
                toggleBillingAddressModal()
                notification("success", "", "Address Updated");
                setCustAddForm({
                    id: 0,
                    customer_id: custId ? custId : 0,
                    firstname: "",
                    lastname: "",
                    telephone: "",
                    postcode: "",
                    city: "",
                    country_id: "",
                    region_id: 0,
                    street: "",
                    default_billing: true,
                    default_shipping: true
                });

                setBillingAddress({
                    id: 0,
                    customer_id: custId ? custId : 0,
                    firstname: "",
                    lastname: "",
                    telephone: "",
                    postcode: "",
                    city: "",
                    country_id: "AD",
                    region_id: 0,
                    street: "",
                    default_shipping: true,
                    default_billing: true,
                });
            } else {
                notification("success", "", "Error occured!!");
            }
        } else {

            console.log(errors)
            notification("success", "", "Error occured!!");
        }
    }

    const validateAddress = () => {
        let error = {};
        let formIsValid = true;

        if (!custAddForm.telephone) {
            formIsValid = false;
            error['telephone'] = 'Phone is required';
        }
        if (!custAddForm.postcode) {
            formIsValid = false;
            error["postcode"] = 'Post Code is required';
        }
        if (!custAddForm.city) {
            formIsValid = false;
            error["city"] = 'City is required';
        }

        if (!custAddForm.country_id) {
            formIsValid = false;
            error['country_id'] = 'Country is required';
        }
        if (!custAddForm.street) {
            formIsValid = false;
            error["street"] = 'Address is required';
        }
        if (!custAddForm.firstname) {
            formIsValid = false;
            error["firstname"] = 'First Name is required';
        }
        if (!custAddForm.lastname) {
            formIsValid = false;
            error["lastname"] = 'Last Name is required';
        }

        setError({ errors: error });
        return formIsValid;
    }

    const validateBillingAddress = () => {
        let error = {};
        let formIsValid = true;

        if (!billingAddressData.telephone) {
            formIsValid = false;
            error['telephone'] = 'Phone is required';
        }
        if (!billingAddressData.postcode) {
            formIsValid = false;
            error["postcode"] = 'Post Code is required';
        }
        if (!billingAddressData.city) {
            formIsValid = false;
            error["city"] = 'City is required';
        }

        if (!billingAddressData.country_id) {
            formIsValid = false;
            error['country_id'] = 'Country is required';
        }
        if (!billingAddressData.street) {
            formIsValid = false;
            error["street"] = 'Address is required';
        }
        if (!billingAddressData.firstname) {
            formIsValid = false;
            error["firstname"] = 'First Name is required';
        }
        if (!billingAddressData.lastname) {
            formIsValid = false;
            error["lastname"] = 'Last Name is required';
        }

        setBillingError({ errors: error });
        return formIsValid;
    }
    const applyPromo = async () => {
        let result: any;
        if (promoCode === '') {
            setErrorPromo("Promo code is required!");
            return false;
        }
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            result = await applyPromoCode(promoCode, props.languages);
        } else {
            result = await applyPromoCodeGuest(promoCode, props.languages)
        }
        console.log(result.data)
        if (!result.data.message) {
            setErrorPromo("");
            checkoutScreen();
            notification("success", "", "Promo code applied.");
        } else {
            setErrorPromo("");
            return notification("error", "", result.data.message);
        }
    }

    //PLACE ORDER CODE GOES HERE
    const placeOrder = async () => {
        setIsShow(true);
        let customer_id = localStorage.getItem('cust_id');
        let orderPlace: any;
        let billAddress: any = {};
        const add: any = itemsVal.address;
        add.addresses.forEach(el => {
            if (el.default_billing) {
                billAddress.street = el.street[0];
                billAddress.address = el.city;
                billAddress.phone = el.telephone;
                billAddress.name = el.firstname + ' ' + el.lastname;
            }
        })
        console.log(selectedPaymentMethod);
        if (selectedPaymentMethod === 'myfatoorah_gateway') {
            console.log('fscfsd', billAddress)
            const payment: any = await myFatoora(billAddress);
            if (payment.data[0].IsSuccess) {
                let url = payment.data[0].Data.PaymentURL;
                if (url) {
                    window.location.href = url;
                    // history.push(url);
                }
            }

        } else {
            //  console.log(selectedShippingMethod)
            if (customer_id) {
                orderPlace = await placeUserOrder('checkmo', null);
            } else {
                if (!props.guestBilling.firstname) {
                    // console.log('here')
                    return notification("error", "", "Please Add Biiling Address!");
                    // return false;
                }

                if (!props.guestShipp.firstname) {
                    return notification("error", "", "Please Add Shipping Address!");
                }

                if (!state.email) {
                    return notification("error", "", "Please Add email Address!");
                }
                setIsShow(true)
                orderPlace = await placeGuestOrder();

            }
            if (orderPlace && orderPlace.data) {
                setIsShow(false)
                props.addToCartTask(true);
                localStorage.removeItem('cartQuoteId');
                localStorage.removeItem('cartQuoteToken');
                let orderId = parseInt(orderPlace.data);
                //return <Redirect to={'/thankyou/' + orderId} />
                history.push('/thankyou/' + orderId);
            } else {
                // console.log('herere')
                setIsShow(false)
            }
        }

    }
    const handleShippingMethodSelect = async (e) => {
        setSelectedShippingMethod(e.target.value)
    }
    const selectPayment = async (code) => {
        setSelectedPaymentMethod(code)
    }

    const placeOrderonMagento = async (paymentmode, placeOrderonMagento) => {
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            let orderPlace: any = await placeUserOrder(paymentmode, placeOrderonMagento);
            if (orderPlace.data) {
                setIsShow(false)
                props.addToCartTask(true);
                localStorage.removeItem('cartQuoteId');
                localStorage.removeItem('cartQuoteToken');
                let orderId = parseInt(orderPlace.data);
                //return <Redirect to={'/thankyou/' + orderId} />
                history.push('/thankyou/' + orderId);
            } else {
                // console.log('herere')
                setIsShow(false)
            }
        }
    }

    return (
        <main>
            <section className="checkout-main">
                <div className="container">
                    {/* {Object.keys(orderError).forEach((key) => {
                     //   console.log(orderError[key])
                        return (
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <strong>Error</strong> {orderError[key]}
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )
                    })} */}
                    <div className="row">
                        <div className="col-md-8">

                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#CheckoutOne"
                                            aria-expanded="true" aria-controls="CheckoutOne">
                                            <IntlMessages id="checkout.promoTitle" />
                                        </button>
                                    </h2>
                                    <div id="CheckoutOne" className="accordion-collapse collapse show" aria-labelledby="CheckoutH	One"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link active" id="pills-promo-tab" data-bs-toggle="pill"
                                                        data-bs-target="#pills-promo" type="button" role="tab" aria-controls="pills-promo"
                                                        aria-selected="true"> <IntlMessages id="promo" /></button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link" id="pills-voucher-tab" data-bs-toggle="pill"
                                                        data-bs-target="#pills-voucher" type="button" role="tab" aria-controls="pills-voucher"
                                                        aria-selected="false"><IntlMessages id="voucher" /></button>
                                                </li>
                                            </ul>
                                            <div className="tab-content" id="pills-tabContent">
                                                <div className="tab-pane fade show active" id="pills-promo" role="tabpanel"
                                                    aria-labelledby="pills-promo-tab">
                                                    <p><IntlMessages id="addPromo" /></p>
                                                    <div>
                                                        <label htmlFor="exampleFormControlInput1" className="form-label"><IntlMessages id="promoCode" /></label>
                                                    </div>
                                                    <div className="row g-3">
                                                        <div className="col-auto">
                                                            <label htmlFor="input1234ABCD" className="visually-hidden">1234ABCD</label>
                                                            <input type="text" className="form-control"
                                                                value={promoCode}
                                                                onChange={(e) => setPromoCode(e.target.value)}
                                                                id="input1234ABCD" placeholder="1234ABCD" />
                                                            <span className="error">{errorPromo}</span>
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="submit" className="btn btn-primary mb-3" onClick={applyPromo}><IntlMessages id="applyCode" /></button>
                                                        </div>
                                                    </div>
                                                    <p><IntlMessages id="needtoknow" /></p>
                                                    <ul>
                                                        <li><IntlMessages id="needtoknow1" /></li>
                                                        <li><IntlMessages id="needtoknow2" /></li>
                                                    </ul>
                                                </div>
                                                <div className="tab-pane fade" id="pills-voucher" role="tabpanel" aria-labelledby="pills-voucher-tab">
                                                    <p><IntlMessages id="addvoucher" /></p>
                                                    <div>
                                                        <label htmlFor="exampleFormControlInput1" className="form-label"><IntlMessages id="add16voucher" /></label>
                                                    </div>
                                                    <div className="row g-3">
                                                        <div className="col-auto">
                                                            <label htmlFor="input16-digit" className="visually-hidden">1234 5678 9101 2131</label>
                                                            <input type="text" className="form-control" id="input16-digit"
                                                                placeholder="1234 5678 9101 2131" />
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="submit" className="btn btn-primary mb-3"><IntlMessages id="applyCode" /></button>
                                                        </div>
                                                    </div>
                                                    <p><IntlMessages id="needtoknow" /></p>
                                                    <ul>
                                                        <li><IntlMessages id="needtoknowvoucher" /></li>
                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#CheckoutTwo" id="accordion-buttonacc" aria-expanded="false" aria-controls="CheckoutTwo">
                                            <IntlMessages id="email_address" />
                                        </button>
                                    </h2>
                                    <div id="CheckoutTwo" className="accordion-collapse collapse" aria-labelledby="CheckoutHTwo"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <label><IntlMessages id="profile.email" /></label>
                                            <p>{localStorage.getItem('token_email') ?
                                                localStorage.getItem('token_email') :
                                                <input type="email"
                                                    className="form-control"
                                                    placeholder={intl.formatMessage({ id: "login.email" })}
                                                    id="email"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />}</p>

                                        </div>
                                        <span className="error">{emailError.errors["email"]}</span>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHThree">
                                        <button className="accordion-button collapsed" onClick={checkEmailData} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#CheckoutThree" aria-expanded="false" aria-controls="CheckoutThree">
                                            <IntlMessages id="deliveryAddress" />
                                        </button>
                                    </h2>
                                    <div id="CheckoutThree" className="accordion-collapse collapse" aria-labelledby="CheckoutHThree"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <b><IntlMessages id="order.deliveryAddress" /></b>

                                            {props.guestShipp && (

                                                <div className="row" >
                                                    <div className="col-md-7">
                                                        <div className="single-address">
                                                            <div>
                                                                <p> {props.guestShipp.firstname} {props.guestShipp.lastname}</p>
                                                                {props.guestShipp.street ? props.guestShipp.street.map((street, j) => {
                                                                    <p key={j}>{street}</p>
                                                                }) : ""}
                                                                <p>{props.guestShipp.postcode}</p>
                                                                <p>{props.guestShipp.city}</p>
                                                                <p>{props.guestShipp.country_id}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            )}
                                            {itemsVal.address['addresses'] && itemsVal.address['addresses'].length > 0 && (
                                                <>
                                                    {itemsVal.address['addresses'].map((item, i) => {
                                                        return (
                                                            <div className="row" key={i}>
                                                                <div className="col-md-7">
                                                                    <div className="single-address">

                                                                        <div>
                                                                            <p> {item.firstname} {item.lastname}</p>
                                                                            {item.street.map((street, j) => {
                                                                                <p key={j}>{street}</p>
                                                                            })}
                                                                            <p>{item.postcode}</p>
                                                                            <p>{item.city}</p>
                                                                            <p>{item.country_id}</p>
                                                                        </div>
                                                                        {item.id === parseInt(custForm.default_shipping) ?
                                                                            <p className="text-muted">
                                                                                <IntlMessages id="myaccount.defaultDeliveryAddress" />
                                                                            </p> : ""}

                                                                        <div className="form-check">
                                                                            <input
                                                                                type="checkbox"
                                                                                style={{ "display": isBillingAddress === item.id ? "none" : "inline-block" }}
                                                                                defaultValue={item.id}
                                                                                name={item.id}
                                                                                onChange={handleBillingChange}
                                                                                className="form-check-input"
                                                                                defaultChecked={item.id === isBillingAddress ? true : false}
                                                                            />
                                                                            <Link to="#" style={{ "display": isBillingAddress === item.id ? "inline-block" : "none" }} ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                                            </Link>
                                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                                <IntlMessages id="usethisAddress" />
                                                                            </label>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <div className="select-address">
                                                                        <div className="select-address-inner">

                                                                            <input
                                                                                style={{ "display": isSetAddress === item.id ? "none" : "inline-block" }}
                                                                                type="checkbox"
                                                                                name={item.id}
                                                                                defaultValue={item.id}
                                                                                onChange={handleAddressChange}
                                                                                className="form-check-input"
                                                                                defaultChecked={item.id === isSetAddress ? true : false}
                                                                            />

                                                                            <Link to="#" style={{ "display": isSetAddress === item.id ? "inline-block" : "none" }} ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                                            </Link>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </>
                                            )}
                                            <div className="add-address-btn">
                                                <hr />
                                                <button className="add-ad-btn btn btn-link" onClick={toggleAddressModal}><IntlMessages id="myaccount.addNewAddress" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHfour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#Checkoutfour" aria-expanded="false" aria-controls="Checkoutfour" onClick={getshippingMethods}>
                                            <IntlMessages id="deliveryOption" />
                                        </button>
                                    </h2>
                                    <div id="Checkoutfour" className="accordion-collapse collapse" aria-labelledby="CheckoutHfour"
                                        data-bs-parent="#accordionExample">
                                        {
                                            shippingMethods.length > 0 && (
                                                <div className="accordion-body">
                                                    {shippingMethods.map((item, i) => {
                                                        return (
                                                            <div className="row" key={i}>
                                                                <div className="col-md-3">
                                                                    <div className="delivery-charges">${item.amount}</div>
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <label>{item.carrier_title}</label>
                                                                    {/* <p></p>Delivery on or before Mon, 31 May 2021 */}
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="select-address-inner">
                                                                        <input
                                                                            type="radio"
                                                                            defaultValue={item.carrier_code}
                                                                            onChange={handleShippingMethodSelect}
                                                                            className="form-check-input"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHfive">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#Checkoutfive" aria-expanded="false" aria-controls="Checkoutfive">
                                            <IntlMessages id="payment" />
                                        </button>
                                    </h2>
                                    <div id="Checkoutfive" className="accordion-collapse collapse" aria-labelledby="CheckoutHfive"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            {props.guestBilling && (

                                                <div className="row" >
                                                    <div className="col-md-7">
                                                        <div className="single-address">
                                                            <div>
                                                                <p> {props.guestBilling.firstname} {props.guestBilling.lastname}</p>
                                                                {props.guestBilling.street ? props.guestBilling.street.map((street, j) => {
                                                                    <p key={j}>{street}</p>
                                                                }) : ""}
                                                                <p>{props.guestBilling.postcode}</p>
                                                                <p>{props.guestBilling.city}</p>
                                                                <p>{props.guestBilling.country_id}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            )}
                                            {itemsVal.address['addresses'] && itemsVal.address['addresses'].length > 0 && (
                                                <div className="row">

                                                    <b><IntlMessages id="checkout.billingAdd" /></b>
                                                    {itemsVal.address['addresses'].map((item, i) => {
                                                        // console.log(item.firstname)
                                                        return (
                                                            <div className="row" key={i}>
                                                                <div className="col-md-7">
                                                                    <div className="single-address">

                                                                        <div>
                                                                            <p> {item.firstname} {item.lastname}</p>
                                                                            {item.street.map((street, j) => {
                                                                                <p key={j}>{street}</p>
                                                                            })}
                                                                            <p>{item.postcode}</p>
                                                                            <p>{item.city}</p>
                                                                            <p>{item.country_id}</p>
                                                                        </div>
                                                                        {item.id === parseInt(custForm.default_billing) ?
                                                                            <p className="text-muted">
                                                                                <IntlMessages id="myaccount.defaultBillingAddress" />
                                                                            </p> : ""}
                                                                        <div className="form-check">
                                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                                            <label className="form-check-label" >
                                                                                <IntlMessages id="checkout.issueInvoice" />
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <div className="select-address-inner">
                                                                        <input
                                                                            type="checkbox"
                                                                            style={{ "display": isBillingAddress === item.id ? "none" : "inline-block" }}
                                                                            defaultValue={item.id}
                                                                            onChange={handleBillingChange}
                                                                            className="form-check-input"
                                                                            defaultChecked={item.id === isBillingAddress ? true : false}
                                                                        // defaultChecked={item.id === parseInt(custForm.default_billing) ? true : false}
                                                                        />
                                                                        <Link to="#" style={{ "display": isBillingAddress === item.id ? "inline-block" : "none" }} ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                                        </Link>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                            }
                                            <div className="add-address-btn">
                                                <hr />
                                                <button className="add-ad-btn btn btn-link" onClick={() => {
                                                    toggleBillingAddressModal();
                                                }} >
                                                    <IntlMessages id="checkout.addNewBillingAdd" />
                                                </button>
                                            </div>

                                            <div className="row">
                                                {/* <div className="col-md-7">
                                                    <div className="single-address">
                                                        <label><IntlMessages id="checkout.payType" /></label>
                                                        <div>
                                                            Mastercard<br />
                                                            **** **** **** 0356<br />
                                                            Exp: 06/25<br />
                                                            Anna Smith<br />
                                                        </div>
                                                        <p className="text-muted"><IntlMessages id="checkout.defaultPayMethod" /></p>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                            <label className="form-check-label">
                                                                <IntlMessages id="checkout.issueInvoice" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-5">
                                                    <div className="select-address">
                                                        <div className="select-address-inner">
                                                            <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                            <label className="btn btn-primary"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="choose-method">
                                                <hr />

                                                {
                                                    props.payTrue.length > 0 && (
                                                        // console.log(props.payTrue.length) 
                                                        <div className="d-grid gap-2 col-6">
                                                            {props.payTrue.map((item, i) => {
                                                                //  console.log(i)
                                                                return (
                                                                    <div key={i}>
                                                                        <button type="button" onClick={() => {
                                                                            selectPayment(item.code);
                                                                        }} className="btn btn-outline-dark">{item.title}</button>
                                                                        {i >= props.payTrue.length - 1 ? ""
                                                                            : <p><IntlMessages id="signup.or" /></p>}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                }
                                                {/* <button type="button" className="btn btn-outline-dark"><IntlMessages id="checkout.addCards" /></button>
                                                    <p><IntlMessages id="signup.or" /></p>
                                                    <button type="button" className="btn btn-outline-dark"><IntlMessages id="checkout.addpaypal" /></button> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-2 col-8 mx-auto">
                                <button className="btn btn-secondary" onClick={placeOrder} type="button" style={{ "display": !isShow ? "inline-block" : "none" }}><IntlMessages id="place-Order" /> </button>

                                <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                            </div>
                        </div>
                        {/* <CheckoutSidebar sidebarData={itemsVal} /> */}
                        <div className="col-md-4">
                            <div className="order-detail-sec">
                                <h5>{itemsVal.checkData['total_items'] ? itemsVal.checkData['total_items'] : 0} <IntlMessages id="item" /></h5>
                                {itemsVal.items['items'] && itemsVal.items['items'].length > 0 && (
                                    <ul className="Ordered-pro-list">
                                        {itemsVal.items['items'].map(item => {
                                            return (<li key={item.item_id} >
                                                <Link to={'/product-details/' + item.sku}><span className="order-pro_img"><img src={item.extension_attributes.item_image} alt="minicart" className="imge-fluid" /></span>
                                                    <span className="order-pro_name">
                                                        <span className="order-pro_pname">{item.name}</span>
                                                        {/* <span className="order-pro_prodt_tag">Manager pattern bag</span> */}
                                                        <br /><IntlMessages id="cart.qty" /> {item.qty}
                                                        {/* <br />One Size */}
                                                    </span>
                                                </Link>
                                            </li>)
                                        })}

                                    </ul>
                                )}
                                <div className="product-total-price">
                                    <p> <IntlMessages id="subTotal" /><span className="text-end">${itemsVal.checkData['sub_total'] ? itemsVal.checkData['sub_total'] : 0}</span></p>
                                    <p> <IntlMessages id="shipping" /><span className="text-end">${itemsVal.checkData['shipping_charges'] ? itemsVal.checkData['shipping_charges'] : 0}</span></p>
                                    <p> <IntlMessages id="tax" /><span className="text-end">${itemsVal.checkData['tax'] ? itemsVal.checkData['tax'] : 0}</span></p>
                                    <hr />
                                    <div className="final-price"><IntlMessages id="total" /> <span>${itemsVal.checkData['total'] ? itemsVal.checkData['total'] - itemsVal.checkData['discount'] : 0}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* change delivery address modalc */}
                <Modal show={addNewAddressModal}>
                    <div className="CLE_pf_details">
                        <Modal.Header>
                            <h1><IntlMessages id="myaccount.myAddress" /></h1>
                            <Link className="cross_icn" to="#" onClick={toggleAddressModal}> <i className="fas fa-times"></i></Link>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="">
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="register.first_name" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" placeholder="Ann"
                                        id="firstname"
                                        value={custAddForm.firstname}
                                        onChange={handleAddChange} />
                                    <span className="error">{errors.errors["firstname"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.surName" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" id="lastname"
                                        placeholder="Surname"
                                        value={custAddForm.lastname}
                                        onChange={handleAddChange} />
                                    <span className="error">{errors.errors["lastname"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.phoneNo" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" id="telephone"
                                        placeholder="Phone"
                                        value={custAddForm.telephone}
                                        onChange={handleAddChange} />
                                    <span className="error">{errors.errors["telephone"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.address" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" id="street"
                                        placeholder="Address"
                                        value={custAddForm.street}
                                        onChange={handleAddChange} />
                                    <span className="error">{errors.errors["street"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.city" /></label>
                                    <input type="text" className="form-control" id="city"
                                        placeholder="City"
                                        value={custAddForm.city}
                                        onChange={handleAddChange} />
                                    <span className="error">{errors.errors["city"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.postCode" /></label>
                                    <input type="text" className="form-control" id="postcode"
                                        placeholder="Post Code"
                                        value={custAddForm.postcode}
                                        onChange={handleAddChange} />
                                    <span className="error">{errors.errors["postcode"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>
                                    <select value={custAddForm.country_id} onChange={handleCountryChange} id="country_id" className="form-select">
                                        {countries && countries.map(opt => {
                                            return (<option key={opt.id} value={opt.id} >{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                        })}
                                    </select>
                                    <span className="error">{errors.errors["country_id"]}</span>
                                </div>
                                {regions.length > 0 && <div className="width-100 mb-3 form-field">
                                    <label className="form-label">
                                        <IntlMessages id="myaccount.region" /><span className="maindatory">*</span></label>
                                    <select value={custAddForm.region_id} onChange={handleAddChange} id="region_id" className="form-select">
                                        {regions && regions.map(opt => {
                                            return (<option key={opt.id} value={opt.id} >
                                                {opt.name}</option>);
                                        })}
                                    </select>
                                    <span className="error">{errors.errors["region_id"]}</span>
                                </div>}
                                <Modal.Footer>
                                    <div className="width-100 mb-3 form-field">
                                        <div className="Frgt_paswd">
                                            <div className="confirm-btn">
                                                <button type="button" className="btn btn-secondary" onClick={saveCustAddress}><IntlMessages id="myaccount.confirm" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </div>
                        </Modal.Body>
                    </div>
                </Modal>

                <Modal show={addBillingAddress}>
                    <div className="CLE_pf_details">
                        <Modal.Header>
                            <h1><IntlMessages id="myaccount.myBillingAddress" /></h1>
                            <Link className="cross_icn" to="#" onClick={toggleBillingAddressModal}> <i className="fas fa-times"></i></Link>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="">
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="register.first_name" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" placeholder="Ann"
                                        id="firstname"
                                        value={billingAddressData.firstname}
                                        onChange={handleBillingAddressChange} />
                                    <span className="error">{billingError.errors["firstname"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.surName" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" id="lastname"
                                        placeholder="Surname"
                                        value={billingAddressData.lastname}
                                        onChange={handleBillingAddressChange} />
                                    <span className="error">{billingError.errors["lastname"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.phoneNo" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" id="telephone"
                                        placeholder="Phone"
                                        value={billingAddressData.telephone}
                                        onChange={handleBillingAddressChange} />
                                    <span className="error">{billingError.errors["telephone"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.address" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" id="street"
                                        placeholder="Address"
                                        value={billingAddressData.street}
                                        onChange={handleBillingAddressChange} />
                                    <span className="error">{billingError.errors["street"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.city" /></label>
                                    <input type="text" className="form-control" id="city"
                                        placeholder="City"
                                        value={billingAddressData.city}
                                        onChange={handleBillingAddressChange} />
                                    <span className="error">{billingError.errors["city"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.postCode" /></label>
                                    <input type="text" className="form-control" id="postcode"
                                        placeholder="Post Code"
                                        value={billingAddressData.postcode}
                                        onChange={handleBillingAddressChange} />
                                    <span className="error">{billingError.errors["postcode"]}</span>

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>
                                    <select value={billingAddressData.country_id} onChange={handleCountryChange} id="country_id" className="form-select">
                                        {countries && countries.map(opt => {
                                            return (<option key={opt.id} value={opt.id} >{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                        })}
                                    </select>
                                    <span className="error">{billingError.errors["country_id"]}</span>
                                </div>
                                {regions.length > 0 && <div className="width-100 mb-3 form-field">
                                    <label className="form-label">
                                        <IntlMessages id="myaccount.region" /><span className="maindatory">*</span></label>
                                    <select value={billingAddressData.region_id} onChange={handleBillingAddressChange} id="region_id" className="form-select">
                                        {regions && regions.map(opt => {
                                            return (<option key={opt.id} value={opt.id} >
                                                {opt.name}</option>);
                                        })}
                                    </select>
                                    <span className="error">{billingError.errors["region_id"]}</span>
                                </div>}
                                <Modal.Footer>
                                    <div className="width-100 mb-3 form-field">
                                        <div className="Frgt_paswd">
                                            <div className="confirm-btn">
                                                <button type="button" className="btn btn-secondary" onClick={saveBillingAddress}><IntlMessages id="myaccount.confirm" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </div>
                        </Modal.Body>
                    </div>
                </Modal>

            </section >


        </main >
    )
}
const mapStateToProps = (state) => {
    let languages = '', payTrue = '', guestShipp = [], guestBilling = [];
    // console.log(state);
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    if (state && state.Cart.paymentMethods) {
        payTrue = state.Cart.paymentMethods
    }
    if (state && state.Cart.ship) {
        guestShipp = state.Cart.ship
    }
    if (state && state.Cart.billing) {
        guestBilling = state.Cart.billing
    }
    // console.log(state.Cart.billing.firstname)
    return {
        languages: languages,
        payTrue: payTrue,
        guestShipp: guestShipp,
        guestBilling: guestBilling
    }
}

export default connect(
    mapStateToProps,
    { addToCartTask, showPaymentMethods, shippingAddressState, billingAddressState, getCheckoutSideBar }
)(Checkout);