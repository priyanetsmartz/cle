import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cardPlaceholder from '../../../../image/cards.png';
import IntlMessages from "../../../../components/utility/intlMessages";
import Modal from "react-bootstrap/Modal";
import notification from '../../../../components/notification';
import { useIntl } from 'react-intl';
import { useHistory } from "react-router";
import { siteConfig } from '../../../../settings'
import cartAction from "../../../../redux/cart/productAction";
import orderprocessing from "../../../../image/orderprocessing.gif";
import { getCartItems, getCartTotal, getGuestCart, getGuestCartTotal, applyPromoCode, getShippinMethods, applyPromoCodeGuest, setGuestUserDeliveryAddress, placeGuestOrder, placeUserOrder, setUserDeliveryAddress, getAddressById, myFatoora, getPaymentStatus, addPaymentDetailstoOrder } from '../../../../redux/cart/productApi';
import { getCustomerDetails, getCountriesList, getRegionsByCountryID, saveCustomerDetails } from '../../../../redux/pages/customers';
import { formatprice, getCountryName, getRegionName } from '../../../../components/utility/allutils';

const { addToCartTask, showPaymentMethods, shippingAddressState, billingAddressState, getCheckoutSideBar } = cartAction;

function Checkout(props) {
    const intl = useIntl();
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    let history = useHistory();
    const [itemsVal, SetItems] = useState({
        checkData: {}, items: {}, address: {}, shippingAddress: 0, shippingData: {}
    });
    const [promoCode, setPromoCode] = useState('');
    const [state, setState] = useState({
        email: ""
    })
    // set state for checked data
    const [checkedData, setCheckedData] = useState({
        address: false,
        email: localToken && localToken.cust_id ? true : false,
        shipping: false,
        billingAddress: false
    })

    //for customer address starts here------
    const [custId, setCustid] = useState(props.token.cust_id);
    const [countries, setCountries] = useState([]); // for countries dropdown
    const [addNewAddressModal, setAddNewAddressModal] = useState(false);
    const [addBillingAddress, setAddBillingAddress] = useState(false);
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [errorPromo, setErrorPromo] = useState('');
    const [loaderOnCheckout, setLoaderOnCheckout] = useState(false);
    const [addShippingAddressLoader, setAddShippingAddressLoader] = useState(false)
    const [addBillingAddressLoader, setAddBillingAddressLoader] = useState(false)

    const [changeCountryLoader, setChangeCountryLoader] = useState(false)
    // const [paymentMethodsList, SetPaymentMethodsList] = useState([])
    const [shippingMethods, SetShippingMethods] = useState([])
    const [isShow, setIsShow] = useState(false);
    const [isSetAddress, setIsSetAddress] = useState(0);
    const [isBillingAddress, setIsBillingAddress] = useState(0);
    const [isBillingAddressConfirm, setIsBillingAddressConfirm] = useState(0);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [regions, setRegions] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState({});
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
        const header = document.getElementById("checkoutsidebar");
        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky-sidebar-checkout");
            } else {
                header.classList.remove("sticky-sidebar-checkout");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, [])
    useEffect(() => {
        const queries = new URLSearchParams(props.location.search);
        let paymentId = queries.get('paymentId');
        let id = queries.get('Id');
        if (paymentId && id) {
            setOrderProcessing(true)
            getPaymentStatusAPi(paymentId)
        }
        let customer_id = props.token.cust_id;
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
    }, [props.languages, props.payTrue, props.guestShipp, props.guestBilling, props.token])

    async function checkoutScreen() {
        setLoaderOnCheckout(true)
        let cartItems: any, cartTotal: any;
        let customer_id = props.token.cust_id;
        if (customer_id && localStorage.getItem('cartQuoteId')) {
            cartItems = await getCartItems(props.languages);
            // get cart total 
            cartTotal = await getCartTotal();
        } else {
            //console.log('hetet')
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart(props.languages);
                cartTotal = await getGuestCartTotal();
            }
        }
        //  console.log(cartItems)
        let checkoutData = {}, checkItems = {}, ship = {};
        checkoutData['discount'] = cartTotal && cartTotal.data ? cartTotal.data.base_discount_amount : 0;
        checkoutData['sub_total'] = cartTotal && cartTotal.data ? cartTotal.data.base_subtotal : 0;
        checkoutData['shipping_charges'] = cartTotal && cartTotal.data ? cartTotal.data.base_shipping_amount : 0;
        checkoutData['total'] = cartTotal && cartTotal.data ? cartTotal.data.base_grand_total : 0;
        checkoutData['discount'] = cartTotal && cartTotal.data ? cartTotal.data.base_discount_amount : 0;
        checkoutData['tax'] = cartTotal && cartTotal.data ? cartTotal.data.base_tax_amount : 0;
        checkoutData['total_items'] = cartTotal && cartTotal.data ? cartTotal.data.items_qty : 0;
        checkItems['items'] = cartItems && cartItems.data ? cartItems.data.items : [];
        //  console.log(cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.id)
        let shipingAdd = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.id : 0;
        //  console.log(cartItems.data.extension_attributes.shipping_assignments[0].shipping.address)
        ship['firstname'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.firstname : '';

        ship['lastname'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.lastname : '';

        ship['telephone'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.telephone : '';

        ship['postcode'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.postcode : '';

        ship['city'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.city : '';

        ship['country_id'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.country_id : '';

        ship['region_id'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.region_id : '';

        ship['street'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.street : '';

        ship['region_id'] = cartItems && cartItems.data && cartItems.data.extension_attributes && cartItems.data.extension_attributes.shipping_assignments && cartItems.data.extension_attributes.shipping_assignments.length > 0 ? cartItems.data.extension_attributes.shipping_assignments[0].shipping.address.region_id : '';

        props.getCheckoutSideBar({
            checkData: checkoutData,
            items: checkItems,
            shippingAddress: shipingAdd,
            shippingData: ship
        })
        let add = []
        let addresses = [...add, ship];
        let addobject = { addresses: addresses }
        // let addresses1 = { addresses };
        SetItems(prevState => ({
            ...prevState,
            checkData: checkoutData,
            items: checkItems,
            shippingAddress: shipingAdd,
            shippingData: ship
        }))

        if (!customer_id) {
            SetItems(prevState => ({
                ...prevState,
                address: addobject
            }))
        }
        setLoaderOnCheckout(false)
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
        setCheckedData(prevState => ({
            ...prevState,
            email: true
        }))
        CheckoutTwo.classList.remove("show");
        setEmailError({ errors: error });
        return formIsValid;
    }
    //customer address functinonality start here
    const getCutomerDetails = async () => {
        let addresses = {};
        let result: any = await getCustomerDetails();
        setCustForm(result.data);
        // console.log(result.data.addresses)
        addresses['addresses'] = result.data ? result.data.addresses : '';
        let address = result.data.addresses[0];
        let addressData: any = {};
        let addressInformation: any = {};

        let billingAddress = {
            customer_id: localToken.cust_id ? localToken.cust_id : 0,
            firstname: address.firstname,
            lastname: address.lastname,
            telephone: address.telephone,
            postcode: address.postcode,
            city: address.city,
            country_id: address.country_id,
            region_id: address.region_id,
            street: address.street
        };
        let shippingAddress = {}
        shippingAddress = {
            customer_id: localToken.cust_id ? localToken.cust_id : 0,
            firstname: address.firstname,
            lastname: address.lastname,
            telephone: address.telephone,
            postcode: address.postcode,
            city: address.city,
            country_id: address.country_id,
            region_id: address.region_id,
            street: address.street
        }

        addressInformation.shippingAddress = shippingAddress;
        addressInformation.billingAddress = billingAddress;
        addressData.addressInformation = addressInformation;
        // console.log(addressData)
        let saveDelivery: any = await setUserDeliveryAddress(addressData);

        if (result.data.addresses.length === 1) {
            setCheckedData(prevState => ({
                ...prevState,
                address: true
            }))
        }
        SetItems(prevState => ({
            ...prevState,
            address: addresses
        }))
    }

    const checkEmailData = async () => {

        if (state.email === "" && custId === "") {
            console.log("collapsed");
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
                if (saveDelivery && saveDelivery.data && (saveDelivery.data.message === '' || saveDelivery.data.message === undefined)) {
                    checkoutScreen()
                    setCheckedData(prevState => ({
                        ...prevState,
                        address: true
                    }))
                    notification("success", "", intl.formatMessage({ id: "customerAddressUpdate" }));
                } else {
                    notification("error", "", saveDelivery.data.message);
                }

            } else {
                setIsSetAddress(0)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
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
                let shippingAddress = {}
                //  console.log(itemsVal.shippingData['country_id'])
                if (itemsVal.shippingData['country_id'] !== null) {
                    shippingAddress = {
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
                } else {
                    //  console.log(itemsVal.shippingData['country_id'])
                    shippingAddress = {
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
                }

                addressInformation.shippingAddress = shippingAddress;
                addressInformation.billingAddress = billingAddress;
                addressData.addressInformation = addressInformation;
                // console.log(addressData)
                let saveDelivery: any = await setUserDeliveryAddress(addressData);
                if (saveDelivery.data.payment_methods && (saveDelivery.data.message === undefined || saveDelivery.data.message === '')) {
                    setCheckedData(prevState => ({
                        ...prevState,
                        billingAddress: true
                    }))
                    setIsBillingAddress(0);
                    setIsBillingAddressConfirm(selectedValue);
                    props.showPaymentMethods(saveDelivery.data.payment_methods);
                    notification("success", "", intl.formatMessage({ id: "customerAddressUpdate" }));
                } else {
                    setIsBillingAddress(0);
                    setIsBillingAddressConfirm(selectedValue);
                    notification("error", "", saveDelivery.data.message);
                }

            } else {
                setIsBillingAddress(0);
                setIsBillingAddressConfirm(selectedValue);
                notification("error", "", intl.formatMessage({ id: "selectcorrectaddress" }));
            }
        }
    }


    const handleCountryChange = async (e) => {
        setChangeCountryLoader(true)
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }));


        const res: any = await getRegionsByCountryID(value);
        if (res.data.available_regions === undefined) {
            setChangeCountryLoader(false)
            setRegions([]);
        } else {
            setChangeCountryLoader(false)
            setRegions(res.data.available_regions);
        }

    }

    const handleCountryChangeBilling = async (e) => {
        setChangeCountryLoader(true)
        const { id, value } = e.target;
        setBillingAddress(prevState => ({
            ...prevState,
            [id]: value
        }));


        const res: any = await getRegionsByCountryID(value);
        if (res.data.available_regions === undefined) {
            setChangeCountryLoader(false)
            setRegions([]);
        } else {
            setChangeCountryLoader(false)
            setRegions(res.data.available_regions);
        }

    }

    // get shipping methods
    const getshippingMethods = async () => {
        if (itemsVal.shippingData['firstname'] === null && itemsVal.shippingData['postcode'] === null) {
            notification("error", "", intl.formatMessage({ id: "selectdeliveryaddress" }));
        } else {
            let result: any = await getShippinMethods();
            SetShippingMethods(result.data)
        }
    }
    const cancelCustAddress = async () => {
        setAddNewAddressModal(false);
    }
    // for customer address popup window starts here
    const saveCustAddress = async () => {
        let result: any

        if (validateAddress()) {
            setAddShippingAddressLoader(true)
            let customer_id = props.token.cust_id;
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

                let newAddress: any = await saveCustomerDetails({ customer: custForm });
                // console.log(newAddress.data)
                delete shippingAddress['default_shipping'];

                delete shippingAddress['customer_id'];
                delete shippingAddress['id'];
                // delete shippingAddress['save_in_address_book'];
                addressInformation.shippingAddress = shippingAddress;
                address.addressInformation = addressInformation;
                result = await setUserDeliveryAddress(address);
                // console.log(result)
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
            if (result && result.data && (result.data.message === '' || result.data.message === undefined)) {
                checkoutScreen();
                toggleAddressModal();
                setCustAddForm({
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
                setCheckedData(prevState => ({
                    ...prevState,
                    address: true
                }))
                setAddShippingAddressLoader(false)
                notification("success", "", intl.formatMessage({ id: "customerAddressUpdate" }));
            } else {
                setAddShippingAddressLoader(false)
                notification("error", "", result.data.message);
            }
        }

    }

    const saveBillingAddress = async () => {
        let result: any

        if (validateBillingAddress()) {
            setAddBillingAddressLoader(true)
            let customer_id = props.token.cust_id;
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
                let newAddress: any = await saveCustomerDetails({ customer: custForm });
                // console.log(newAddress.data)
                // delete billingAddress['default_shipping'];
                delete billingAddress['default_billing'];
                delete shippingAddress['customer_id'];
                delete shippingAddress['id'];

                addressInformation.shippingAddress = shippingAddress;
                address.addressInformation = addressInformation;

                // console.log(obj)
                result = await setUserDeliveryAddress(address);
                if (newAddress.data) {
                    getCutomerDetails();
                }
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

            if (result.data.message === undefined || result.data.message === '') {
                // here 
                props.showPaymentMethods(result.data.payment_methods);
                checkoutScreen();
                toggleBillingAddressModal()
                setCheckedData(prevState => ({
                    ...prevState,
                    billingAddress: true
                }))
                notification("success", "", intl.formatMessage({ id: "customerAddressUpdate" }));
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
                setAddBillingAddressLoader(false)
            } else {
                setAddBillingAddressLoader(false)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }

        }
    }

    const validateAddress = () => {
        let error = {};
        let formIsValid = true;

        if (!custAddForm.telephone) {
            formIsValid = false;
            error['telephone'] = intl.formatMessage({ id: "phonereq" });
        }
        if (!custAddForm.postcode) {
            formIsValid = false;
            error["postcode"] = intl.formatMessage({ id: "pinreq" });
        }
        if (!custAddForm.city) {
            formIsValid = false;
            error["city"] = intl.formatMessage({ id: "cityreq" });
        }

        if (!custAddForm.country_id) {
            formIsValid = false;
            error['country_id'] = intl.formatMessage({ id: "countryreq" });
        }
        if (!custAddForm.street) {
            formIsValid = false;
            error["street"] = intl.formatMessage({ id: "addressreq" });
        }
        if (!custAddForm.firstname) {
            formIsValid = false;
            error["firstname"] = intl.formatMessage({ id: "firstnamerequired" });
        }
        if (!custAddForm.lastname) {
            formIsValid = false;
            error["lastname"] = intl.formatMessage({ id: "lastnamerequired" });
        }

        setError({ errors: error });
        return formIsValid;
    }

    const validateBillingAddress = () => {
        let error = {};
        let formIsValid = true;

        if (billingAddressData.telephone && billingAddressData.telephone !== undefined) {
            if (billingAddressData.telephone.length < 0 || billingAddressData.telephone.length > 10) {
                formIsValid = false;
                error['telephone'] = intl.formatMessage({ id: "phoneinvalid" });
            }

        }
        if (!billingAddressData.telephone) {
            formIsValid = false;
            error['telephone'] = intl.formatMessage({ id: "phonereq" });
        }
        if (!billingAddressData.postcode) {
            formIsValid = false;
            error["postcode"] = intl.formatMessage({ id: "pinreq" });
        }
        if (!billingAddressData.city) {
            formIsValid = false;
            error["city"] = intl.formatMessage({ id: "cityreq" });
        }

        if (!billingAddressData.country_id) {
            formIsValid = false;
            error['country_id'] = intl.formatMessage({ id: "countryreq" });
        }
        if (!billingAddressData.street) {
            formIsValid = false;
            error["street"] = intl.formatMessage({ id: "addressreq" });
        }
        if (!billingAddressData.firstname) {
            formIsValid = false;
            error["firstname"] = intl.formatMessage({ id: "firstnamerequired" });
        }
        if (!billingAddressData.lastname) {
            formIsValid = false;
            error["lastname"] = intl.formatMessage({ id: "lastnamerequired" });
        }

        setBillingError({ errors: error });
        return formIsValid;
    }
    const applyPromo = async () => {
        setLoaderOnCheckout(true)
        let result: any;
        if (promoCode === '') {
            setErrorPromo(intl.formatMessage({ id: "promoreq" }));
            return false;
        }
        let customer_id = props.token.cust_id;
        if (customer_id) {
            result = await applyPromoCode(promoCode, props.languages);
        } else {
            result = await applyPromoCodeGuest(promoCode, props.languages)
        }
        //console.log(result.data)
        if (!result.data.message) {
            setErrorPromo("");
            setLoaderOnCheckout(false)
            checkoutScreen();
            notification("success", "", intl.formatMessage({ id: "promosucc" }));
        } else {
            setErrorPromo("");
            setLoaderOnCheckout(false)
            setErrorPromo(result.data.message)
            return notification("error", "", result.data.message);
        }
    }

    //PLACE ORDER CODE GOES HERE
    const placeOrder = async () => {
        // console.log('add')
        setIsShow(true);
        let customer_id = props.token.cust_id;
        let orderPlace: any;
        let billAddress: any = {};
        if (customer_id) {
            const add: any = itemsVal.address;
            //  console.log(add)
            add.addresses.forEach(el => {
                if (el.default_billing || el.default_shipping || add.addresses.length === 1) {
                    billAddress.street = el.street[0];
                    billAddress.address = el.city;
                    billAddress.phone = el.telephone;
                    billAddress.name = el.firstname + ' ' + el.lastname;
                }
            })
        } else {
            if (state.email) {
                if (props.guestBilling) {
                    billAddress.CustomerEmail = state.email;
                    billAddress.street = props.guestBilling && props.guestBilling.street ? props.guestBilling.street[0] : '';
                    billAddress.address = props.guestBilling ? props.guestBilling.city : "";
                    billAddress.phone = props.guestBilling ? props.guestBilling.telephone : "";
                    billAddress.name = props.guestBilling ? props.guestBilling.firstname + ' ' + props.guestBilling.lastname : "";
                }
            } else {
                setIsShow(false)
                return notification("error", "", intl.formatMessage({ id: "emailrequired" }));
            }

        }
        //  console.log(selectedPaymentMethod);
        if (selectedPaymentMethod === 'myfatoorah_gateway') {
            // console.log('fscfsd', billAddress)
            const payment: any = await myFatoora(billAddress);
            if (payment && payment.data && payment.data.length > 0 && payment.data[0].IsSuccess) {
                let url = payment.data[0].Data.PaymentURL;
                if (url) {
                    window.location.href = url;
                    // history.push(url);
                }
            }

        } else {
            //  console.log(selectedShippingMethod)
            if (customer_id) {
                orderPlace = await placeUserOrder('checkmo');
            } else {
                if (!props.guestBilling.firstname) {
                    setIsShow(false)
                    return notification("error", "", intl.formatMessage({ id: "addbillingaddress" }));
                    // return false;
                }

                if (!props.guestShipp.firstname) {
                    return notification("error", "", intl.formatMessage({ id: "addshippingaddress" }));
                }

                if (!state.email) {
                    return notification("error", "", intl.formatMessage({ id: "emailrequired" }));
                }
                setIsShow(true)
                orderPlace = await placeGuestOrder('checkmo');

            }
            if (orderPlace && orderPlace.data && orderPlace.data !== undefined && orderPlace.data.message === undefined) {
                setIsShow(false)
                props.addToCartTask(true)
                localStorage.removeItem('cartQuoteId');
                localStorage.removeItem('cartQuoteToken');
                let orderId = parseInt(orderPlace.data);
                //return <Redirect to={'/thankyou/' + orderId} />
                history.push('/thankyou?id=' + orderId);
            } else {
                setIsShow(false)
                if (orderPlace.data.message === 'Some of the products are currently out of stock') {
                    return notification("error", "", intl.formatMessage({ id: "outofstock" }));
                } else if (orderPlace.data.message === 'The requested qty is not available') {
                    return notification("error", "", intl.formatMessage({ id: "qtrynotfound" }));
                } else {
                    return notification("error", "", orderPlace.data.message);
                }
            }
        }

    }
    const handleShippingMethodSelect = async (e) => {
        setCheckedData(prevState => ({
            ...prevState,
            shipping: true
        }))
        setSelectedShippingMethod(e.target.value)
    }
    const selectPayment = async (code) => {

        setSelectedPaymentMethod(code)
    }

    const getPaymentStatusAPi = async (getPaymentStatusAPi) => {
        let paymentStatus: any = await getPaymentStatus(getPaymentStatusAPi);
        // console.log(paymentStatus.data);
        let detailsRequired = [];
        detailsRequired['transactionId'] = paymentStatus.data && paymentStatus.data.length > 0 && paymentStatus.data[0].Data.InvoiceTransactions && paymentStatus.data[0].Data.InvoiceTransactions && paymentStatus.data[0].Data.InvoiceTransactions.length > 0 && paymentStatus.data[0].Data.InvoiceTransactions[0].TransactionId ? paymentStatus.data[0].Data.InvoiceTransactions[0].TransactionId : 0;
        detailsRequired['InvoiceId'] = paymentStatus.data && paymentStatus.data.length > 0 && paymentStatus.data[0].Data.InvoiceId ? paymentStatus.data[0].Data.InvoiceId : 0;
        detailsRequired['PaymentGateway'] = paymentStatus.data && paymentStatus.data.length > 0 && paymentStatus.data[0].Data.InvoiceTransactions && paymentStatus.data[0].Data.InvoiceTransactions && paymentStatus.data[0].Data.InvoiceTransactions.length > 0 && paymentStatus.data[0].Data.InvoiceTransactions[0].PaymentGateway ? paymentStatus.data[0].Data.InvoiceTransactions[0].PaymentGateway : 0;
        detailsRequired['TransactionStatus'] = paymentStatus.data && paymentStatus.data.length > 0 && paymentStatus.data[0].IsSuccess ? paymentStatus.data[0].IsSuccess : 0;
        //console.log(detailsRequired);

        setPaymentDetails(detailsRequired)
        // placeOrderonMagento('myfatoorah_gateway')
        let customer_id = props.token.cust_id;
        let orderPlace: any;
        if (customer_id) {
            orderPlace = await placeUserOrder('myfatoorah_gateway');
        } else {
            orderPlace = await placeGuestOrder('myfatoorah_gateway');
        }
        if (orderPlace && orderPlace.data) {
            let details = {
                "orderId": orderPlace.data,
                "transactionId": detailsRequired['transactionId'],
                "PaymentGateway": detailsRequired['PaymentGateway'],
                "InvoiceId": detailsRequired['InvoiceId'],
                "TransactionStatus": detailsRequired['TransactionStatus']
            }
            let addOrderDetails: any = await addPaymentDetailsToMagento(details);
            if (addOrderDetails.data) {
                setIsShow(false)

                let orderId = parseInt(orderPlace.data);
                if (orderId) {
                    props.addToCartTask(true);
                    localStorage.removeItem('cartQuoteId');
                    localStorage.removeItem('cartQuoteToken');
                    history.push('/thankyou?id=' + orderId);
                } else {

                    setOrderProcessing(false);
                    notification("error", "", "Error ocurred! If amount deducted please check your order status in my account section or call site admin");
                }
            } else {
                notification("error", "", "Error ocurred! If amount deducted please check your order status in my account section or call site admin");
            }

        } else {
            setIsShow(false)
        }
        // }
    }

    const addPaymentDetailsToMagento = async (data) => {

        let result: any = await addPaymentDetailstoOrder(data);
        return result;

    }

    return (
        <main>
            {orderProcessing && (
                <div className="CLE-loading order-processing" style={{ "position": "fixed" }}>
                    <p> Please do not refresh the page and wait while we are processing your payment. This can take a few minutes</p>   <img className="loading-gif" src={orderprocessing} alt="loader" />
                </div>
            )}
            <section className="checkout-main">

                <div className="container">

                    <div className="back-block">
                        <i className="fas fa-chevron-left back-icon"></i>
                        <Link className="back-to-shop" to="/my-cart" ><IntlMessages id="checkout-back-link" /></Link>
                    </div>

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
                                                                onChange={(e) => setPromoCode(e.target.value)}
                                                                placeholder="1234 5678 9101 2131" />
                                                            <span className="error">{errorPromo}</span>
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="submit" onClick={applyPromo} className="btn btn-primary mb-3"><IntlMessages id="applyCode" /></button>
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
                                            <IntlMessages id="checkoutemail_address" />
                                            {checkedData.email && (<span className='confirmedPoint' ><i className="fa fa-check" aria-hidden="true"></i></span>)}
                                        </button>
                                    </h2>
                                    <div id="CheckoutTwo" className="accordion-collapse collapse" aria-labelledby="CheckoutHTwo"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">

                                            {props.token.token_email ? <span className="note"><IntlMessages id="emailchangenote" /></span> : ''}
                                            <label><IntlMessages id="profile.email" /></label>

                                            <p>{props.token.token_email ?
                                                props.token.token_email :
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
                                    <h2 className="accordion-header" onClick={checkEmailData} id="CheckoutHThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#CheckoutThree" aria-expanded="false" aria-controls="CheckoutThree">
                                            <IntlMessages id="deliveryAddress" />
                                            {checkedData.address && (<span className='confirmedPoint'><i className="fa fa-check" aria-hidden="true"></i></span>)}
                                        </button>
                                    </h2>
                                    <div id="CheckoutThree" className="accordion-collapse collapse" aria-labelledby="CheckoutHThree"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <b><IntlMessages id="order.deliveryAddress" /></b>

                                            {/* {props.guestShipp && (

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
                                                                <p>{props.guestShipp.country_id ? getCountryName(props.guestShipp.country_id) : ""}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            )}
                                            {console.log(itemsVal)} */}
                                            {itemsVal.address['addresses'] && itemsVal.address['addresses'].length > 0 && (
                                                <>

                                                    {itemsVal.address['addresses'].map((item, i) => {
                                                        return (
                                                            <div className="row" key={i}>
                                                                <div className="col-md-7">
                                                                    <div className="single-address">

                                                                        <div>
                                                                            <p> {item.firstname} {item.lastname}</p>
                                                                            {item && item.street && item.street.length > 0 && item.street.map((street, j) => {
                                                                                <p key={j}>{street}</p>
                                                                            })}
                                                                            <p>{item.postcode}</p>
                                                                            <p>{item.city}</p>
                                                                            {item.region_id ? <p>{getRegionName(item.country_id, item.region_id)}</p> : ""}
                                                                            {item.country_id ? <p>{getCountryName(item.country_id)}</p> : ""}
                                                                        </div>
                                                                        {item.id === parseInt(custForm.default_shipping) ?
                                                                            <p className="text-muted">
                                                                                <IntlMessages id="myaccount.defaultDeliveryAddress" />
                                                                            </p> : ""}

                                                                        <div className="form-check">
                                                                            <input
                                                                                type="radio"
                                                                                style={{ "display": isBillingAddress === parseInt(item.id) ? "none" : "inline-block" }}
                                                                                defaultValue={item.id}
                                                                                name={`billingaddress`}
                                                                                onChange={handleBillingChange}
                                                                                className="form-check-input"

                                                                                // checked={item.id === isBillingAddressConfirm ? true : false}
                                                                                checked={item.id === isBillingAddressConfirm ? true : false}
                                                                            />

                                                                            <Link to="#" style={{ "display": isBillingAddress === parseInt(item.id) ? "inline-block" : "none" }} ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                                            </Link>
                                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                                <IntlMessages id="usethisAddress" />
                                                                            </label>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <div className="select-address">
                                                                        <div className="select-address-inner form-check">

                                                                            {itemsVal.address['addresses'].length > 1 ? <div className='greateAddress form-check'> <input
                                                                                style={{ "display": isSetAddress === item.id ? "none" : "inline-block" }}
                                                                                type="radio"
                                                                                name={`addressdelivery`}
                                                                                defaultValue={item.id}
                                                                                onChange={handleAddressChange}
                                                                                className="form-check-input"
                                                                                defaultChecked={item.id === isSetAddress ? true : false}
                                                                            />
                                                                                <label htmlFor="rad1"> <IntlMessages id="great" /></label>
                                                                            </div>
                                                                                : ""}

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
                                            {addNewAddressModal && (
                                                <div className='addressInlineForm col-md-6'>
                                                    <div className="CLE_pf_details">
                                                        <h1><IntlMessages id="order.deliveryAddress" /></h1>
                                                        <h5><IntlMessages id="order.adddeliveryaddress" /></h5>
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
                                                                <label className="form-label"><IntlMessages id="myaccount.city" /><span className="maindatory">*</span></label>
                                                                <input type="text" className="form-control" id="city"
                                                                    placeholder="City"
                                                                    value={custAddForm.city}
                                                                    onChange={handleAddChange} />
                                                                <span className="error">{errors.errors["city"]}</span>

                                                            </div>
                                                            <div className="width-100 mb-3 form-field">
                                                                <label className="form-label"><IntlMessages id="myaccount.postCode" /><span className="maindatory">*</span></label>
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
                                                            {changeCountryLoader && (
                                                                <div> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></div>
                                                            )}
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
                                                            <div className="width-100 mb-3 form-field">
                                                                <div className="Frgt_paswd">
                                                                    <div className="save-btn">
                                                                        <button type="button" className="btn btnaddressave" style={{ "display": !addShippingAddressLoader ? "inline-block" : "none" }} onClick={saveCustAddress}><IntlMessages id="checkout.save" /></button>

                                                                        <div className="spinner" style={{ "display": addShippingAddressLoader ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                                                                    </div>
                                                                    <div className="confirm-btn">
                                                                        <button type="button" className="btn btnaddressave" onClick={cancelCustAddress}><IntlMessages id="checkout.cancel" /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHfour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#Checkoutfour" aria-expanded="false" aria-controls="Checkoutfour" onClick={getshippingMethods}>
                                            <IntlMessages id="deliveryOption" />   {checkedData.shipping && (<span className='confirmedPoint'><i className="fa fa-check" aria-hidden="true"></i></span>)}
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
                                                                    <div className="delivery-charges">{siteConfig.currency}{item.amount}</div>
                                                                </div>
                                                                <div className="col-md-5">
                                                                    <label>{item.carrier_title}</label>
                                                                    {/* <p></p>Delivery on or before Mon, 31 May 2021 */}
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="select-address-inner form-check">
                                                                        <input
                                                                            id={item.carrier_code}
                                                                            type="radio"
                                                                            name='shipingmethod'
                                                                            defaultValue={item.carrier_code}
                                                                            onChange={handleShippingMethodSelect}
                                                                            className={selectedShippingMethod === item.carrier_code ? "checked  form-check-input" : "form-check-input"}
                                                                        />
                                                                        <label htmlFor="rad1"> <IntlMessages id="great" /></label>
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
                                            <IntlMessages id="payment" />{checkedData.billingAddress && (<span className='confirmedPoint'><i className="fa fa-check" aria-hidden="true"></i></span>)}
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

                                                        return (
                                                            <div className="row" key={i}>
                                                                <div className="col-md-7">
                                                                    <div className="single-address">

                                                                        <div>
                                                                            <p> {item.firstname} {item.lastname}</p>
                                                                            {item.street.length > 0 && item.street.map((street, j) => {
                                                                                <p key={j}>{street}</p>
                                                                            })}
                                                                            <p>{item.postcode}</p>
                                                                            <p>{item.city}</p>
                                                                            {item.country_id ? <p>{getCountryName(item.country_id)}</p> : ""}
                                                                        </div>
                                                                        {item.id === parseInt(custForm.default_billing) ?
                                                                            <p className="text-muted">
                                                                                <IntlMessages id="myaccount.defaultBillingAddress" />
                                                                            </p> : ""}
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-5">

                                                                    {itemsVal.address['addresses'].length > 1 ? <div className="select-address-inner form-check">
                                                                        <input
                                                                            type="radio"
                                                                            style={{ "display": isBillingAddress === item.id ? "none" : "inline-block" }}
                                                                            name={`billingaddress2`}
                                                                            defaultValue={item.id}
                                                                            onChange={handleBillingChange}
                                                                            className="form-check-input"
                                                                            checked={item.id === isBillingAddressConfirm ? true : false}
                                                                        />

                                                                        <label htmlFor="rad1"> <IntlMessages id="great" /></label>
                                                                        <Link to="#" style={{ "display": isBillingAddress === parseInt(item.id) ? "inline-block" : "none" }} ><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                                        </Link>

                                                                    </div>
                                                                        : ""}
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
                                            {addBillingAddress && (
                                                <div className='addressInlineForm col-md-6'>
                                                    <div className="CLE_pf_details">
                                                        <h1><IntlMessages id="payment" /></h1>
                                                        <h5><IntlMessages id="myaccount.myBillingAddress" /></h5>
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
                                                                <input type="number" className="form-control" id="telephone"
                                                                    min="10"
                                                                    max="11"
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
                                                                <label className="form-label"><IntlMessages id="myaccount.city" /><span className="maindatory">*</span></label>
                                                                <input type="text" className="form-control" id="city"
                                                                    placeholder="City"
                                                                    value={billingAddressData.city}
                                                                    onChange={handleBillingAddressChange} />
                                                                <span className="error">{billingError.errors["city"]}</span>

                                                            </div>
                                                            <div className="width-100 mb-3 form-field">
                                                                <label className="form-label"><IntlMessages id="myaccount.postCode" /><span className="maindatory">*</span></label>
                                                                <input type="text" className="form-control" id="postcode"
                                                                    placeholder="Post Code"
                                                                    value={billingAddressData.postcode}
                                                                    onChange={handleBillingAddressChange} />
                                                                <span className="error">{billingError.errors["postcode"]}</span>

                                                            </div>
                                                            <div className="width-100 mb-3 form-field">
                                                                <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>
                                                                <select value={billingAddressData.country_id} onChange={handleCountryChangeBilling} id="country_id" className="form-select">
                                                                    {countries && countries.map(opt => {
                                                                        return (<option key={opt.id} value={opt.id} >{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                                                    })}
                                                                </select>
                                                                <span className="error">{billingError.errors["country_id"]}</span>
                                                            </div>
                                                            {changeCountryLoader && (
                                                                <div> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></div>
                                                            )}
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
                                                            <div className="width-100 mb-3 form-field">
                                                                <div className="Frgt_paswd">
                                                                    <div className="save-btn">
                                                                        <button type="button" className="btn btnaddressave" style={{ "display": !addBillingAddressLoader ? "inline-block" : "none" }} onClick={saveBillingAddress}><IntlMessages id="checkout.save" /></button>

                                                                        <div className="spinner" style={{ "display": addBillingAddressLoader ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                                                                    </div>
                                                                    <div className="confirm-btn">
                                                                        <button type="button" className="btn btnaddressave" onClick={cancelCustAddress}><IntlMessages id="checkout.cancel" /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="row">

                                                <div className="we-accept">
                                                    <p><strong><IntlMessages id="we-accept" />:</strong></p>
                                                    <img src={cardPlaceholder} alt="cards" />
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
                                                                        }} className={selectedPaymentMethod === item.code ? 'active btn btn-outline-dark' : "btn btn-outline-dark"}>{item.title}</button>
                                                                        {i >= props.payTrue.length - 1 ? ""
                                                                            : <p><IntlMessages id="signup.or" /></p>}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-2 col-8 mx-auto">
                                {!isShow ?
                                    <button className="btn btn-secondary" disabled={(itemsVal.shippingData['firstname'] === null && itemsVal.shippingData['postcode'] === null) ? true : false} onClick={placeOrder} type="button"><IntlMessages id="place-Order" /> </button>
                                    : <div className="spinner"> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>}


                            </div>
                        </div>
                        {/* <CheckoutSidebar sidebarData={itemsVal} /> */}
                        <div className="col-md-4" id="checkoutsidebar">
                            <div className="sticky-cart">
                                <div className="order-detail-checkout">
                                    <h5>{itemsVal.checkData['total_items'] ? itemsVal.checkData['total_items'] : 0} <IntlMessages id="item" /></h5>
                                    {itemsVal.items['items'] && itemsVal.items['items'].length > 0 && (
                                        <ul className="Ordered-pro-list">
                                            {itemsVal.items['items'].map(item => {
                                                return (<li key={item.item_id} >
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="product-image">
                                                                <Link to={'/product-details/' + item.sku}> <img src={item.extension_attributes ? item.extension_attributes.item_image : ""} alt={item.name} /></Link>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <div className="pro-name-tag">
                                                                {item.extension_attributes.brand && (<div className="product_name"><Link to={'/search/' + item.extension_attributes.brand}>{item.extension_attributes.brand}</Link></div>
                                                                )}
                                                                <div className="product_vrity"><Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                                <p className="check-tag"><IntlMessages id="cart.qty" /> {item.qty}</p>
                                                                {/* <br />One Size */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>)
                                            })}

                                        </ul>
                                    )}

                                    <div className="product-total-price">
                                        {loaderOnCheckout && (
                                            <div className="checkout-loading" >
                                                <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                                            </div>
                                        )}
                                        <p> <IntlMessages id="subTotal" /><span className="text-end">{siteConfig.currency}{itemsVal.checkData['sub_total'] ? formatprice(itemsVal.checkData['sub_total']) : 0} </span></p>
                                        <p> <IntlMessages id="order.discount" /><span className="text-end">{siteConfig.currency}{itemsVal.checkData['discount'] ? formatprice(itemsVal.checkData['discount']) : 0} </span></p>
                                        <p> <IntlMessages id="shipping" /><span className="text-end"> {siteConfig.currency}{itemsVal.checkData['shipping_charges'] ? formatprice(itemsVal.checkData['shipping_charges']) : 0}</span></p>
                                        <p> <IntlMessages id="tax" /><span className="text-end">{siteConfig.currency}{itemsVal.checkData['tax'] ? formatprice(itemsVal.checkData['tax']) : 0} </span></p>
                                        <hr />
                                        <div className="final-price"><IntlMessages id="total" /> <span>{siteConfig.currency}{formatprice(itemsVal.checkData['total'])} </span></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        guestBilling: guestBilling,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToCartTask, showPaymentMethods, shippingAddressState, billingAddressState, getCheckoutSideBar }
)(Checkout);