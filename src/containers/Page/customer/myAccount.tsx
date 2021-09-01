import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import {
    getCustomerDetails, saveCustomerDetails, getCountriesList, getPreference, changePassword,
    updateCustEmail
} from '../../../redux/pages/customers';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";


function MyAccount(props) {
    //for customer details
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [myDetailsModel, setMyDetailsModel] = useState(false);
    const [myPreferenceModel, setMyPreferenceModel] = useState(false);
    const [myAddressModal, setMyAddressModal] = useState(false);
    const [giftingModal, setGiftingModal] = useState(false);

    const [countries, setCountries] = useState([]); // for countries dropdown
    const [telephone, setTelephone] = useState("");
    const [country, setCountry] = useState("");
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
    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: custId,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        region_id: 538,
        country_id: "",
        street: ""
    });

    const [changePass, setChangePass] = useState({
        password: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [changeEmail, setChangeEmail] = useState({
        newEmail: "",
        confirmNewEmail: "",
        password: "",
    });

    const [errors, setError] = useState({
        errors: {}
    });

    //for attributes details
    const [attributes, setAttributes] = useState({
        clothing_size: {},
        favourite_categories: {},
        favourite_designers: {},
        mostly_intersted_in: {},
        shoes_size: {}
    });


    useEffect(() => {
        async function getData() {
            let result: any = await getCustomerDetails(custId);
            setCustForm(result.data);
            if (result.data.addresses.length > 0) {
                result.data.addresses[0].street = result.data.addresses[0].street[0];
                setCustAddForm(result.data.addresses[0]);
                setCountry(result.data.addresses[0].country_id);
                setTelephone(result.data.addresses[0].telephone);
            }
        }
        getData();
        getCountries();
        getAttributes();
    }, []);

    const getCountries = async () => {
        let result: any = await getCountriesList();
        setCountries(result.data);
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setCustForm(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        custForm.addresses[0] = custAddForm;
        custForm.addresses[0].street = [custForm.addresses[0].street];
        console.log(custForm);
        let result: any = await saveCustomerDetails(custId, { customer: custForm });
        if (result) {
            setMyDetailsModel(false);
            notification("success", "", "Customer details Updated");
        }
    }

    //for customer address
    const handleAddChange = (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }))


    }


    //for attributes
    const getAttributes = async () => {
        let result: any = await getPreference(custId);
        console.log(result);
        setAttributes(result.data[0]);
    }

    //change password starts here----------------------------------------->
    const handlePassword = (e) => {
        const { id, value } = e.target
        setChangePass(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleChangePass = async () => {
        if (handleValidation()) {
            let result: any = await changePassword({ currentPassword: changePass.password, newPassword: changePass.newPassword });
            if (result.data) {
                notification("success", "", "Password updated");
                setChangePass({
                    confirmNewPassword: "",
                    newPassword: "",
                    password: ""
                });
            } else {
                notification("error", "", "Invalid email or password");
            }
        }
    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!changePass["password"]) {
            formIsValid = false;
            error["password"] = 'Password is required';
        }
        if (!changePass["newPassword"]) {
            formIsValid = false;
            error["newPassword"] = 'New Password is required';
        }
        if (!changePass["confirmNewPassword"]) {
            formIsValid = false;
            error["confirmNewPassword"] = 'Confirm New Password is required';
        }
        if (changePass["confirmNewPassword"] !== changePass["newPassword"]) {
            formIsValid = false;
            error["confirmNewPassword"] = 'Confirm New password not matched';
        }

        setError({ errors: error });
        return formIsValid;
    }
    //change password ends here----------------------------------------->

    //change email starts here----------------------------------------->
    const handleEmail = (e) => {
        const { id, value } = e.target
        setChangeEmail(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleChangeEmail = async () => {
        if (handleValidationEmail()) {
            const req = {
                customerId: custId,
                newEmail: changeEmail.newEmail,
                password: changeEmail.password
            }

            let result: any = await updateCustEmail(req);
            console.log(result);
            if (result) {
                notification("success", "", "New email Updated");
                setChangeEmail({
                    confirmNewEmail: "",
                    newEmail: "",
                    password: ""
                })
            }
        }
    }

    const handleValidationEmail = () => {
        let error = {};
        let formIsValid = true;

        if (typeof changeEmail["newEmail"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(changeEmail["newEmail"]))) {
                formIsValid = false;
                error["newEmail"] = "New Email is not valid";
            }
        }
        if (typeof changeEmail["confirmNewEmail"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(changeEmail["confirmNewEmail"]))) {
                formIsValid = false;
                error["confirmNewEmail"] = "Confirm New Email is not valid";
            }
        }
        if (!changeEmail["newEmail"]) {
            formIsValid = false;
            error["newEmail"] = "New Email is required";
        }
        if (!changeEmail["confirmNewEmail"]) {
            formIsValid = false;
            error["confirmNewEmail"] = "Confirm New Email is required";
        }

        if (!changeEmail["password"]) {
            formIsValid = false;
            error["password"] = "Password is required";
        }

        if (changeEmail["confirmNewEmail"] !== changeEmail["newEmail"]) {
            formIsValid = false;
            error["confirmNewEmail"] = 'Confirm New password not matched';
        }

        setError({ errors: error });
        return formIsValid;
    }
    //change email ends here----------------------------------------->

    const openMyDetails = () => {
        setMyDetailsModel(!myDetailsModel);
    }

    const openMyPreferences = () => {
        setMyPreferenceModel(!myPreferenceModel);
    }

    const openAddressModal = () => {
        setMyAddressModal(!myAddressModal);
    }

    const openGigitingModal = () => {
        setGiftingModal(!giftingModal);
    }


    return (
        <>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">My profile</a></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.myDetails" /></h1>
                            <p><IntlMessages id="myaccount.feelFreeToEdit" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.name" /></label>
                                        <div className="field-name">{custForm.firstname}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.surName" /></label>
                                        <div className="field-name">{custForm.lastname}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.gender" /></label>
                                        <div className="field-name">{custForm.gender}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.phoneNo" /></label>
                                        <div className="field-name">{custForm.addresses[0]?.telephone}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.dob" /></label>
                                        <div className="field-name">{custForm.dob}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.country" /></label>
                                        <div className="field-name">{custForm.addresses[0]?.country_id}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary" onClick={openMyDetails}>
                                    <IntlMessages id="myaccount.edit" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.myPreferences" /></h1>
                            <p><IntlMessages id="myaccount.youCanPersonalize" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.mostlyInterested" /></label>
                                        <div className="field-name">
                                            {Object.values(attributes.mostly_intersted_in).map((type) => {
                                                return (
                                                    <span>{type},</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.clothingSize" /></label>
                                        <div className="field-name">{Object.values(attributes.clothing_size).map((s) => {
                                            return (
                                                <span>{s}/</span>
                                            )
                                        })}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.shoeSize" /></label>
                                        <div className="field-name">{Object.values(attributes.clothing_size).map((s) => {
                                            return (
                                                <span>{s}/</span>
                                            )
                                        })}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.favoriteDesigners" /></label>
                                        <div className="field-name">
                                            {Object.values(attributes.favourite_designers).map((d) => {
                                                return (
                                                    <span>{d},</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.favoriteCategories" /></label>
                                        <div className="field-name">
                                            {Object.values(attributes.favourite_designers).map((type) => {
                                                return (
                                                    <span>{type},</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label">&nbsp;</label>
                                        <div className="field-name">&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary" onClick={openMyPreferences}>
                                    <IntlMessages id="myaccount.edit" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.giftingPreferences" /></h1>
                            <p><IntlMessages id="myaccount.youCanPutInfo" /> </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.myBirthday" /></label>
                                        <div className="field-name">01 May 1990</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label">&nbsp;</label>
                                        <div className="field-name">&nbsp;</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.listOfBirthdays" /></label>
                                        <div className="field-name">John / Mom / +3 more</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label">&nbsp;</label>
                                        <div className="field-name">&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary" onClick={openGigitingModal}>
                                    <IntlMessages id="myaccount.edit" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.myAddresses" /></h1>
                            <p><IntlMessages id="myaccount.addOrChange" /></p>
                        </div>
                    </div>
                    <div className="add_changeaddress">
                        <div className="addnew_address" onClick={openAddressModal}>
                            <div className="addressnew_addressblue">
                                <span> <IntlMessages id="myaccount.addNewAddress" /> </span>
                            </div>
                        </div>

                        {custForm && custForm.addresses.map(address => {
                            return (<div className="addressnew_addressbodr">
                                <h3>Address</h3>
                                <ul>
                                    <li>{address.firstname + ' ' + address.lastname}</li>
                                    <li>{address.street}</li>
                                    {/* <li>40-333</li> */}
                                    <li>{address.city}</li>
                                    <li>{address.country_id}</li>
                                </ul>
                                <div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div>
                                <div className="address-action">
                                    <a href="#" className="delete_btn"><IntlMessages id="myaccount.delete" /></a>
                                    <a className="edit_btn" onClick={openAddressModal}>
                                        <IntlMessages id="myaccount.edit" />
                                    </a>
                                </div>
                            </div>);
                        })}


                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.paymentMethods" /></h1>
                            <p><IntlMessages id="myaccount.addOrChangePayments" /> </p>
                        </div>
                    </div>
                    <div className="add_changeaddress">
                        <div className="addnew_address">
                            <div className="addressnew_addressblue">
                                <span> <IntlMessages id="myaccount.addNewPayment" /> </span>
                            </div>
                        </div>
                        <div className="addressnew_addressbodr bank_card">
                            <h3><IntlMessages id="myaccount.bankCard" /></h3>
                            <ul>
                                <li>Mastercard</li>
                                <li>**** **** **** 0356</li>
                                <li>Exp: 06/25</li>
                                <li>Ann Smith</li>
                            </ul>
                            <div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                            <div className="address-action bank_card">
                                <a href="#" className="delete_btn"><IntlMessages id="myaccount.delete" /></a>
                                <a href="#" className="edit_btn"><IntlMessages id="myaccount.edit" /></a>
                            </div>
                        </div>
                        <div className="addressnew_addressbodr">
                            <h3>PayPal</h3>
                            <ul>
                                <li><IntlMessages id="myaccount.youWillNeedToEnter" /></li>
                                <li><IntlMessages id="myaccount.setAsDefault" /></li>
                            </ul>
                            <div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                            <div className="address-action paypal_card">
                                <a href="#" className="delete_btn"><IntlMessages id="myaccount.delete" /></a>
                                <a href="#" className="edit_btn"><IntlMessages id="myaccount.edit" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my_profile_sect change_passwordsec mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.changePasswordEmail" /></h1>
                            <p><IntlMessages id="myaccount.feelFreeToUpdate" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <label className="form-label heading_lbl"><IntlMessages id="login.password" /></label>
                            <div className="password_edit">&#9728;&#9728;&#9728;&#9728;&#9728;</div>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label heading_lbl"><IntlMessages id="login.email" /></label>
                            <div className="password_edit">{custForm.email}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="change-paswd-sec">
                                <label className="heading_lbl"><IntlMessages id="login.changePassword" /></label>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="login.password" /></label>
                                    <input type="password" className="form-control" placeholder="000"
                                        id="password"
                                        value={changePass.password}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass"> <i className="far fa-eye-slash"></i></span>
                                    <span className="error">{errors.errors["password"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.newPassword" /> <span
                                        className="maindatory">&#42;</span></label>
                                    <input type="password" className="form-control" placeholder="000" id="newPassword"
                                        value={changePass.newPassword}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass"> <i className="far fa-eye-slash"></i></span>
                                    <span className="error">{errors.errors["newPassword"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.confirmPassword" /> <span
                                        className="maindatory">&#42;</span></label>
                                    <input type="password" className="form-control" placeholder="000"
                                        id="confirmNewPassword"
                                        value={changePass.confirmNewPassword}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass"> <i className="far fa-eye-slash"></i></span>
                                    <span className="error">{errors.errors["confirmNewPassword"]}</span>
                                </div>
                                <div className="forgot_paswd">
                                    <div className="Frgt_paswd">
                                        <Link to="forget-password" className="forgt-pasdw"><IntlMessages id="myaccount.forgotPassword" /></Link>

                                    </div>
                                    <div className="Frgt_paswd">
                                        <div className="confirm-btn">
                                            <button type="button" className="btn btn-secondary" onClick={handleChangePass}>
                                                <IntlMessages id="myaccount.confirm" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="newemail-sec">
                                <label className="heading_lbl"><IntlMessages id="myaccount.newEmail" /></label>
                                <div className="width-100 mb-3">
                                    <label className="form-label"><IntlMessages id="myaccount.newEmailAddress" /></label>
                                    <input type="email" className="form-control" placeholder="000" id="newEmail"
                                        value={changeEmail.newEmail}
                                        onChange={handleEmail} />
                                    <span className="error">{errors.errors["newEmail"]}</span>
                                </div>
                                <div className="width-100 mb-3">
                                    <label className="form-label"><IntlMessages id="myaccount.confirmNewEmailAddress" /><span
                                        className="maindatory">&#42;</span></label>
                                    <input type="email" className="form-control" placeholder="000" id="confirmNewEmail"
                                        value={changeEmail.confirmNewEmail}
                                        onChange={handleEmail} />
                                    <span className="error">{errors.errors["confirmNewEmail"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="login.password" /><span
                                        className="maindatory">&#42;</span></label>
                                    <input type="password" className="form-control" placeholder="000"
                                        id="password"
                                        value={changeEmail.password}
                                        onChange={handleEmail} />
                                    <span className="hidden-pass"> <i className="far fa-eye-slash"></i></span>
                                    <span className="error">{errors.errors["password"]}</span>
                                </div>
                                <div className="forgot_paswd">
                                    <div className="Frgt_paswd">
                                        <div className="confirm-btn">
                                            <button type="button" className="btn btn-secondary" onClick={handleChangeEmail}>
                                                <IntlMessages id="myaccount.confirm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>Delete Account</h1>
                            <p>
                                We're sorry to see you go - remember, your CLé account is free and enables you to shop easily without
                                having to enter your details each time. With it, you're able to take advantage of the exclusive discounts
                                and promos on site.
                            </p>
                            <p>
                                If you'd still like to deactivate your CLé account, follow the below steps
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="delet_account_accordin">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingOne">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                <img src="images/call-icon.png" className="img-fluid" alt="" /> Step 1: Contact Customer Care
                                            </button>
                                        </h2>
                                        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate
                                                the <code>.accordion-flush</code> className. This is the first item's accordion body.</div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                <img src="images/delete-icon.png" className="img-fluid" alt="" /> Step II: We'll deactivate your
                                                account
                                            </button>
                                        </h2>
                                        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate
                                                the <code>.accordion-flush</code> className. This is the second item's accordion body. Let's imagine
                                                this being filled with some actual content.</div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                <img src="images/timer_icon.png" className="img-fluid" alt="" /> Don't want to close your account but
                                                fancy a break?
                                            </button>
                                        </h2>
                                        <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate
                                                the <code>.accordion-flush</code> className. This is the third item's accordion body. Nothing more
                                                exciting happening here in terms of content, but just filling up the space to make it look, at
                                                least at first glance, a bit more representative of how this would look in a real-world
                                                application.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="width-100 mt-3">
                                <Link to="contact-us" className="btn btn-secondary">
                                    <IntlMessages id="contact.title" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="my_profile_sect check-als mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1 className="text-center mb-4"><IntlMessages id="myaccount.checkAlso" /></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <Link to="customer-orders" className="btn btn-secondary">
                                    <IntlMessages id="myaccount.myOrdersReturns" /></Link>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <Link to="customer-orders" className="btn btn-secondary">
                                    <IntlMessages id="myaccount.orderDetails" /></Link>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary"><IntlMessages id="myaccount.returnDetails" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* customer details modal */}
            <Modal show={myDetailsModel} >
                <Modal.Header> <h4>Customer Details</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={openMyDetails} aria-label="Close"></button></Modal.Header>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="row">
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>First Name</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="firstname"
                                        placeholder="First Name"
                                        value={custForm.firstname}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["firstname"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>Surname</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="lastname"
                                        placeholder="Surname"
                                        value={custForm.lastname}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["lastname"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>Gender</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="gender"
                                        placeholder="Gender"
                                        value={custForm.gender}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["gender"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>Phone</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="phone"
                                        placeholder="Phone"
                                        value={telephone}
                                        onChange={(e) => { setTelephone(e.target.value) }}
                                    />
                                    <span className="error">{errors.errors["phone"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>Date of Birth</b></label>
                                    <input type="date"
                                        className="form-control"
                                        id="dob"
                                        placeholder="Date of Birth"
                                        value={custForm.dob}
                                        onChange={handleChange}
                                    />
                                    <span className="error">{errors.errors["dob"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> Country</label>
                                    <select value={country} onChange={(e) => { setCountry(e.target.value) }} id="country" className='form-control'>
                                        {countries && countries.map(opt => {
                                            return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                        })}
                                    </select>
                                    <span className="error">{errors.errors["country"]}</span>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="signup-btn" onClick={handleSubmitClick}> Confirm</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* my preference details modal */}
            <Modal show={myPreferenceModel} size="xl">
                <Modal.Header> <h4>My Preferences</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={openMyPreferences} aria-label="Close"></button></Modal.Header>
                <div className="container" style={{ marginTop: '150px' }}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="d-flex justify-content-between">
                                <span>{attributes.clothing_size['7']}</span>
                                <span>{attributes.clothing_size['8']}</span>
                                <span>{attributes.clothing_size['9']}</span>
                                <span>{attributes.clothing_size['10']}</span>
                                <span>{attributes.clothing_size['11']}</span>
                                <span>{attributes.clothing_size['12']}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6>Favourite Categories</h6>
                            <div className="d-flex justify-content-between">
                                <span>{attributes.favourite_categories['20']}</span>
                                <span>{attributes.favourite_categories['21']}</span>
                                <span>{attributes.favourite_categories['22']}</span>
                                <span>{attributes.favourite_categories['23']}</span>
                            </div>
                        </div>
                        <hr />
                        <div className="col-md-6">
                            <h6>Favourite Designers</h6>
                            <div className="d-flex justify-content-between">
                                <span>{attributes.favourite_designers['17']}</span>
                                <span>{attributes.favourite_designers['18']}</span>
                                <span>{attributes.favourite_designers['19']}</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6>Mostly Intersted In</h6>
                            <div className="d-flex justify-content-between">
                                <span>{attributes.mostly_intersted_in['4']}</span>
                                <span>{attributes.mostly_intersted_in['5']}</span>
                                <span>{attributes.mostly_intersted_in['6']}</span>
                            </div>
                        </div>
                        <hr />
                        <div className="col-md-6">
                            <h6>Shoe Size</h6>
                            <div className="d-flex justify-content-between">
                                <span>{attributes.shoes_size['13']}</span>
                                <span>{attributes.shoes_size['14']}</span>
                                <span>{attributes.shoes_size['15']}</span>
                                <span>{attributes.shoes_size['16']}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>

            {/* my details modal */}
            <Modal show={myAddressModal}>
                {/* <Modal.Header> <h4>My Address</h4> */}
                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={openAddressModal} aria-label="Close"></button></Modal.Header>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="row">
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>First Name</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="firstname"
                                        placeholder="First Name"
                                        value={custAddForm.firstname}
                                        onChange={handleAddChange}
                                    />
                                    <span className="error">{errors.errors["firstname"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>Surname</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="lastname"
                                        placeholder="Surname"
                                        value={custAddForm.lastname}
                                        onChange={handleAddChange}
                                    />
                                    <span className="error">{errors.errors["lastname"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>Address</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="street"
                                        placeholder="Address"
                                        value={custAddForm.street}
                                        onChange={handleAddChange}
                                    />
                                    <span className="error">{errors.errors["address"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> <b>City</b></label>
                                    <input type="text"
                                        className="form-control"
                                        id="city"
                                        placeholder="City"
                                        value={custAddForm.city}
                                        onChange={handleAddChange}
                                    />
                                    <span className="error">{errors.errors["city"]}</span>
                                </div>
                                <div className="col-sm-12">
                                    <label htmlFor=""> Country</label>
                                    <select value={custAddForm.country_id} onChange={handleAddChange} id="country_id" className='form-control'>
                                        {countries && countries.map(opt => {
                                            return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                        })}
                                    </select>
                                    <span className="error">{errors.errors["country"]}</span>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="signup-btn" onClick={handleSubmitClick}> Confirm</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="CLE_pf_details">
                    <h1>My Address</h1>
                    <a className="cross_icn" onClick={openAddressModal}> <i className="fas fa-times"></i></a>
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
                            <label className="form-label">Address<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="street"
                                placeholder="Address"
                                value={custAddForm.street}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["address"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">City*</label>
                            <input type="number" className="form-control" id="city"
                                placeholder="City"
                                value={custAddForm.city}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["city"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Country<span className="maindatory">*</span></label>
                            <select value={custAddForm.country_id} onChange={handleAddChange} id="country_id" className="form-select">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <div className="Frgt_paswd">
                                <div className="confirm-btn">
                                    <button type="button" className="btn btn-secondary" onClick={handleSubmitClick}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Gifting preference details modal */}
            <Modal show={giftingModal} size="lg">
                <Modal.Header>
                    <h4>Gifting Preferences</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={openGigitingModal} aria-label="Close"></button>
                </Modal.Header>
                <div className="row">
                    <b>My Birthday</b>
                    <p>01 May 1990</p>
                    <div className="col-md-6">

                    </div>
                </div>
            </Modal>
        </>

    );
}

function mapStateToProps(state) {
    return {
        state: state
    };
};
export default connect(
    mapStateToProps
)(MyAccount);