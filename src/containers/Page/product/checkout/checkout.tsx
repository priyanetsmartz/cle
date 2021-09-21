import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import CheckoutSidebar from './sidebar';
import Modal from "react-bootstrap/Modal";
import notification from '../../../../components/notification';
import { getCartItems, getCartTotal, getGuestCart, getGuestCartTotal, applyPromoCode } from '../../../../redux/cart/productApi';
import { getCustomerDetails, saveCustomerDetails, getCountriesList } from '../../../../redux/pages/customers';
function Checkout(props) {
    const [itemsVal, SetItems] = useState({
        checkData: {}, items: {}, address: {}
    });
    const [promoCode, setPromoCode] = useState('');

    //for customer address starts here------
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [countries, setCountries] = useState([]); // for countries dropdown
    const [addNewAddressModal, setAddNewAddressModal] = useState(false);
    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: custId,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "",
        street: ""
    });

    const [custForm, setCustForm] = useState({
        id: custId,
        email: "",
        firstname: "",
        lastname: "",
        gender: "",
        dob: "",
        website_id: 1,
        addresses: []
    });
    
    const [errors, setError] = useState({
        errors: {}
    });
    //for customer address ends here-------

    useEffect(() => {
        checkoutScreen();
        getCutomerDetails();
        getCountries();

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.posts])

    async function checkoutScreen() {
        let cartItems: any, cartTotal: any;
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            cartItems = await getCartItems();
            // get cart total 
            cartTotal = await getCartTotal();
        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart();
                cartTotal = await getGuestCartTotal();


            }
        }
        // let result: any = await getCheckOutTotals();
        let checkoutData = {}, checkItems = {}, addresses = {}
        checkoutData['discount'] = cartTotal.data.base_discount_amount;
        checkoutData['sub_total'] = cartTotal.data.base_subtotal;
        checkoutData['shipping_charges'] = cartTotal.data.base_shipping_amount;
        checkoutData['total'] = cartTotal.data.base_grand_total;
        checkoutData['tax'] = cartTotal.data.base_tax_amount;
        checkoutData['total_items'] = cartTotal.data.items_qty;
        checkItems['items'] = cartItems.data.items;
        addresses['addresses'] = cartItems.data.customer.addresses;
        // SetItems(result.data);
        SetItems({ checkData: checkoutData, items: checkItems, address: addresses });
        // console.log(itemsVal.address['addresses'])
    }

    //customer address functinonality start here
    const getCutomerDetails = async () => {
        let result: any = await getCustomerDetails(custId);
        setCustForm(result.data);
    }

    const getCountries = async () => {
        let result: any = await getCountriesList();
        setCountries(result.data);
    }

    const toggleAddressModal = () => {
        setAddNewAddressModal(!addNewAddressModal);
    }

    const handleAddChange = (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    // for customer address popup window starts here
    const saveCustAddress = async () => {
        if (validateAddress()) {
            let obj: any = { ...custAddForm };
            obj.street = [obj.street];
            custForm.addresses.push(obj);
            
            // console.log(custAddForm);
            let result: any = await saveCustomerDetails(custId, { customer: custForm });
            if (result) {
                checkoutScreen();
                setCustAddForm({
                    id: 0,
                    customer_id: custId,
                    firstname: "",
                    lastname: "",
                    telephone: "",
                    postcode: "",
                    city: "",
                    country_id: "",
                    street: ""
                });
                toggleAddressModal();
                notification("success", "", "Customer Address Updated");
            }
        }else{

            console.log(errors)
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

    const applyPromo = async () => {
        if (promoCode == '') return notification("error", "", "Promo code is required!");
        const result: any = await applyPromoCode(promoCode, props.languages);
        if (result) {
            checkoutScreen();
            notification("success", "", "Promo code applied.");
        } else {
            return notification("error", "", "Invalid Promo code!");
        }
    }

    
    return (
        <main>
            {/* <div className="container">44
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="new-breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                                <li className="breadcrumb-item">My Cart</li>
                                <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div> */}
            <section className="checkout-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#CheckoutOne"
                                            aria-expanded="true" aria-controls="CheckoutOne">
                                            Promo code or voucher
                                        </button>
                                    </h2>
                                    <div id="CheckoutOne" className="accordion-collapse collapse show" aria-labelledby="CheckoutH	One"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link active" id="pills-promo-tab" data-bs-toggle="pill"
                                                        data-bs-target="#pills-promo" type="button" role="tab" aria-controls="pills-promo"
                                                        aria-selected="true">Promo code</button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link" id="pills-voucher-tab" data-bs-toggle="pill"
                                                        data-bs-target="#pills-voucher" type="button" role="tab" aria-controls="pills-voucher"
                                                        aria-selected="false">Voucher</button>
                                                </li>
                                            </ul>
                                            <div className="tab-content" id="pills-tabContent">
                                                <div className="tab-pane fade show active" id="pills-promo" role="tabpanel"
                                                    aria-labelledby="pills-promo-tab">
                                                    <p>Add a Promo Code</p>
                                                    <div>
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Promo code</label>
                                                    </div>
                                                    <div className="row g-3">
                                                        <div className="col-auto">
                                                            <label htmlFor="input1234ABCD" className="visually-hidden">1234ABCD</label>
                                                            <input type="text" className="form-control"
                                                                value={promoCode}
                                                                onChange={(e) => setPromoCode(e.target.value) }
                                                             id="input1234ABCD" placeholder="1234ABCD" />
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="submit" className="btn btn-primary mb-3" onClick={applyPromo}>Apply code</button>
                                                        </div>
                                                    </div>
                                                    <p>Need to know</p>
                                                    <ul>
                                                        <li>you can only use one discount / promo code per order. This applies to our free-delivery
                                                            codes, too.</li>
                                                        <li>Discount / promo codes cannot be used while buying gift vouchers.</li>
                                                    </ul>
                                                </div>
                                                <div className="tab-pane fade" id="pills-voucher" role="tabpanel" aria-labelledby="pills-voucher-tab">
                                                    <p>Add a Voucher</p>
                                                    <div>
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">16-digit voucher code</label>
                                                    </div>
                                                    <div className="row g-3">
                                                        <div className="col-auto">
                                                            <label htmlFor="input16-digit" className="visually-hidden">1234 5678 9101 2131</label>
                                                            <input type="text" className="form-control" id="input16-digit"
                                                                placeholder="1234 5678 9101 2131" />
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="submit" className="btn btn-primary mb-3">Apply code</button>
                                                        </div>
                                                    </div>
                                                    <p>Need to know</p>
                                                    <ul>
                                                        <li>you can use more than one voucher at once. After applying the code, a new input will
                                                            appear.</li>
                                                    </ul>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#CheckoutTwo" aria-expanded="false" aria-controls="CheckoutTwo">
                                            Email address
                                        </button>
                                    </h2>
                                    <div id="CheckoutTwo" className="accordion-collapse collapse" aria-labelledby="CheckoutHTwo"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <label>Email</label>
                                            <p>{localStorage.getItem('token_email') ? localStorage.getItem('token_email') : ""}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#CheckoutThree" aria-expanded="false" aria-controls="CheckoutThree">
                                            Delivery address
                                        </button>
                                    </h2>
                                    <div id="CheckoutThree" className="accordion-collapse collapse" aria-labelledby="CheckoutHThree"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <div className="row">

                                                {itemsVal.address['addresses'] && itemsVal.address['addresses'].length > 0 && (
                                                    <div className="col-md-7">
                                                        {itemsVal.address['addresses'].map((item, i) => {
                                                            return (
                                                                <div className="single-address" key={i}>
                                                                    <label>Delivery address</label>
                                                                    <div>
                                                                        <p> {item.firstname} {item.lastname}</p>
                                                                        {item.street.map((street, j) => {
                                                                            <p key={j}>{street}</p>
                                                                        })}
                                                                        <p>{item.postcode}</p>
                                                                        <p>{item.city}</p>
                                                                        <p>{item.country_id}</p>
                                                                    </div>
                                                                    <p className="text-muted">Default delivery address</p>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            use this as billing address
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                                <div className="col-md-5">
                                                    <div className="select-address">
                                                        <div className="select-address-inner">
                                                            <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                            <label className="btn btn-primary" htmlFor="btn-check-2"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-address-btn">
                                                <hr />
                                                <button className="add-ad-btn btn btn-link" onClick={toggleAddressModal}>Add new address</button>
                                            </div>
                                            <div className="address-form" style={{ "display": "none" }}>
                                                <div className="row g-3">
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputFname" className="form-label">First name*</label>
                                                        <input type="text" className="form-control" id="inputFname" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputSurname" className="form-label">Surname*</label>
                                                        <input type="text" className="form-control" id="inputSurname" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputAddress" className="form-label">Address*</label>
                                                        <input type="text" className="form-control" id="inputAddress" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputCity" className="form-label">City*</label>
                                                        <input type="text" className="form-control" id="inputCity" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputCountry" className="form-label">Country*</label>
                                                        <select id="inputCountry" className="form-select">
                                                            <option>Choose Country</option>
                                                            <option>India</option>
                                                            <option>UAE</option>
                                                            <option>USA</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="gridCheck" />
                                                            <label className="form-check-label" htmlFor="gridCheck">
                                                                Save this as billing address
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="button" className="btn btn-link float-start">Save</button>
                                                        <button type="button" className="btn btn-link float-end">Cancel</button>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHfour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#Checkoutfour" aria-expanded="false" aria-controls="Checkoutfour">
                                            Delivery Option
                                        </button>
                                    </h2>
                                    <div id="Checkoutfour" className="accordion-collapse collapse" aria-labelledby="CheckoutHfour"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="delivery-charges">$5.99</div>
                                                </div>
                                                <div className="col-md-5">
                                                    <label>Standard</label>
                                                    <p></p>Delivery on or before Mon, 31 May 2021
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="select-address-inner">
                                                        <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                        <label className="btn btn-primary" htmlFor="btn-check-2"></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="delivery-charges">$10.99</div>
                                                </div>
                                                <div className="col-md-5">
                                                    <label>Express</label>
                                                    <p></p>Delivery on or before Friday, 25 May 2021
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="select-address-inner">
                                                        <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                        <label className="btn btn-primary" htmlFor="btn-check-2"></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="delivery-charges">$19.99</div>
                                                </div>
                                                <div className="col-md-5">
                                                    <label>Next Day</label>
                                                    <p></p>Delivery on or before Mon, 15 May 2021
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="select-address-inner">
                                                        <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                        <label className="btn btn-primary" htmlFor="btn-check-2"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="CheckoutHfive">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#Checkoutfive" aria-expanded="false" aria-controls="Checkoutfive">
                                            Payment
                                        </button>
                                    </h2>
                                    <div id="Checkoutfive" className="accordion-collapse collapse" aria-labelledby="CheckoutHfive"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="single-address">
                                                        <label>Billing address</label>
                                                        <div>
                                                            Anna Smith<br />
                                                            Baker Street 105<br />
                                                            40-333<br />
                                                            London<br />
                                                            Great Britain
                                                        </div>
                                                        <p className="text-muted">Default billing address</p>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Issue an invoice
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="select-address">
                                                        <div className="select-address-inner">
                                                            <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                            <label className="btn btn-primary" htmlFor="btn-check-2"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-address-btn">
                                                <hr />
                                                <button className="add-ad-btn btn btn-link">Add new billing address</button>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="single-address">
                                                        <label>Payment Type</label>
                                                        <div>
                                                            Mastercard<br />
                                                            **** **** **** 0356<br />
                                                            Exp: 06/25<br />
                                                            Anna Smith<br />
                                                        </div>
                                                        <p className="text-muted">Default payment method</p>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Issue an invoice
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="select-address">
                                                        <div className="select-address-inner">
                                                            <input type="checkbox" className="btn-check" id="btn-check-2" autoComplete="off" />
                                                            <label className="btn btn-primary" htmlFor="btn-check-2"></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="choose-method">
                                                <hr />
                                                <div className="d-grid gap-2 col-6">
                                                    <button type="button" className="btn btn-outline-dark">Add Credit / Debit Card</button>
                                                    <p>Or</p>
                                                    <button type="button" className="btn btn-outline-dark">Add Paypal</button>
                                                </div>
                                            </div>

                                            <div className="address-form" style={{ "display": "none" }}>
                                                <div className="row g-3">
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputFname" className="form-label">First name*</label>
                                                        <input type="text" className="form-control" id="inputFname" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputSurname" className="form-label">Surname*</label>
                                                        <input type="text" className="form-control" id="inputSurname" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputAddress" className="form-label">Address*</label>
                                                        <input type="text" className="form-control" id="inputAddress" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputCity" className="form-label">City*</label>
                                                        <input type="text" className="form-control" id="inputCity" />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputCountry" className="form-label">Country*</label>
                                                        <select id="inputCountry" className="form-select">
                                                            <option>Choose Country</option>
                                                            <option>India</option>
                                                            <option>UAE</option>
                                                            <option>USA</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="button" className="btn btn-link float-start">Save</button>
                                                        <button type="button" className="btn btn-link float-end">Cancel</button>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                                <div className="row g-3">
                                                    <label>Billing address</label>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputCard" className="form-label">Card Number*</label>
                                                        <input type="text" className="form-control" id="inputCard" />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputExpiry" className="form-label">Expiry Date*</label>
                                                        <select id="inputExpiry" className="form-select">
                                                            <option>Month</option>
                                                            <option>Jan</option>
                                                            <option>Feb</option>
                                                            <option>March</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="" className="form-label"></label>
                                                        <select id="" className="form-select">
                                                            <option >Year</option>
                                                            <option>2021</option>
                                                            <option>2022</option>
                                                            <option>2023</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4"></div>
                                                    <div className="col-md-12">
                                                        <label htmlFor="inputCardN" className="form-label">Name on card*</label>
                                                        <input type="text" className="form-control" id="inputCardN" />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputSurname" className="form-label">CVV*</label>
                                                        <input type="text" className="form-control" id="inputSurname" />
                                                    </div>
                                                    <div className="col-12">
                                                        <button type="button" className="btn btn-link float-start">Save</button>
                                                        <button type="button" className="btn btn-link float-end">Cancel</button>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-2 col-8 mx-auto">
                                <button className="btn btn-secondary" type="button">Place Order</button>
                                <p></p>
                            </div>
                        </div>
                        <CheckoutSidebar sidebarData={itemsVal} />
                    </div>
                </div>

                 {/* change delivery address modalc */}
            <Modal show={addNewAddressModal}>
                <div className="CLE_pf_details">
                    <h1>My Address</h1>
                    <a className="cross_icn" onClick={toggleAddressModal}> <i className="fas fa-times"></i></a>
                    <div className="">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">First name<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Ann"
                                id="firstname"
                                value={custAddForm.firstname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["firstname"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Surname<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="lastname"
                                placeholder="Surname"
                                value={custAddForm.lastname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["lastname"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Phone<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="telephone"
                                placeholder="Phone"
                                value={custAddForm.telephone}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["telephone"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Address<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="street"
                                placeholder="Address"
                                value={custAddForm.street}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["street"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">City*</label>
                            <input type="text" className="form-control" id="city"
                                placeholder="City"
                                value={custAddForm.city}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["city"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Post Code*</label>
                            <input type="text" className="form-control" id="postcode"
                                placeholder="Post Code"
                                value={custAddForm.postcode}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["postcode"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Country<span className="maindatory">*</span></label>
                            <select value={custAddForm.country_id} onChange={handleAddChange} id="country_id" className="form-select">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country_id"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <div className="Frgt_paswd">
                                <div className="confirm-btn">
                                    <button type="button" className="btn btn-secondary" onClick={saveCustAddress}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>


            </section>


        </main>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(Checkout);