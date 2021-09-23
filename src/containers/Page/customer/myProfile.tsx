import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import {
    getCustomerDetails, saveCustomerDetails, getCountriesList, getPreference, changePassword,
    updateCustEmail, deleteAddress
} from '../../../redux/pages/customers';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { language } from '../../../settings';


function MyProfile(props) {
    const userGroup = localStorage.getItem('token');
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup == '4') ? true : false);
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [myDetailsModel, setMyDetailsModel] = useState(false);
    const [myPreferenceModel, setMyPreferenceModel] = useState(false);
    const [myAddressModal, setMyAddressModal] = useState(false);
    const [giftingModal, setGiftingModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [addCard, setAddCard] = useState(false);
    const [passMask, setPassMask] = useState({
        password: true,
        newPassword: true,
        confirmNewPassword: true,
        emailPass: true
    })

    const [countries, setCountries] = useState([]); // for countries dropdown
    const [telephone, setTelephone] = useState("");
    const [dob, setDob] = useState({
        day: '',
        month: '',
        year: ''
    });
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
        country_id: "",
        street: ""
    });
    const [addIndex, setAddIndex] = useState(null);

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
    const [attributes, setAttributes]:any = useState({});


    useEffect(() => {
        async function getData() {
            let result: any = await getCustomerDetails(custId);
            console.log(result.data);
            setCustForm(result.data);
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

    const saveCustDetails = async (e) => {
        e.preventDefault();
        if (dob.day != '' && dob.month != '' && dob.year != '') {
            custForm.dob = `${dob.day}/${dob.month}/${dob.year}`;
        }
        let result: any = await saveCustomerDetails(custId, { customer: custForm });
        if (result) {
            setMyDetailsModel(false);
            notification("success", "", "Customer details Updated");
        }
    }

    // for customer address popup window starts here
    const saveCustAddress = async (e) => {
        if (validateAddress()) {
            let obj: any = { ...custAddForm };
            obj.street = [obj.street];
            if (obj.id == 0) {
                custForm.addresses.push(obj);
            } else {
                custForm.addresses[addIndex] = obj;
            }
            // console.log(custAddForm);
            let result: any = await saveCustomerDetails(custId, { customer: custForm });
            if (result) {
                openAddressModal();
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
                notification("success", "", "Customer Address Updated");
            }
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
    // for customer address popup window ends here

    //edit existing address starts here------------->
    const editAddress = (index) => {
        setAddIndex(index);
        custForm.addresses[index].street = custForm.addresses[index].street[0];
        setCustAddForm(custForm.addresses[index]);
        openAddressModal();
    }

    const deleteAdd = async (index) => {
        if (!custForm.addresses[index]) return;
        let result: any = await deleteAddress(custForm.addresses[index].id);
        if (result) {
            custForm.addresses.splice(index, 1);
            setCustForm(custForm);
            notification("success", "", "Customer Address deleted!");
        }
    }
    //edit existing address ends here--------------->


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
        let lang = props.languages ? props.languages : language;
        let result: any = await getPreference(lang);
        console.log(result.data[0].preference);
        if(result.data[0].preference){
            setAttributes(result.data[0].preference);
        }
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
                notification("error", "", "Invalid password!");
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
            if (result.data) {
                notification("success", "", "New email Updated");
                setChangeEmail({
                    confirmNewEmail: "",
                    newEmail: "",
                    password: ""
                })
            } else {
                notification("error", "", "Error in updating email!");
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

    const openPaymentMethodModal = () => {
        setPaymentMethod(!paymentMethod);
    }

    const OpenCardModal = () => {
        setAddCard(!addCard);
    }

    const dobHandler = (e) => {
        const { id, value } = e.target;
        setDob(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const togglePasswordVisiblity = (id) => {
        const val = !passMask[id];
        setPassMask(pre => ({
            ...pre,
            [id]: val
        }));
    }

    return (
        <div className="col-sm-9">
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
                                    {/* <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.phoneNo" /></label>
                                        <div className="field-name">{custForm.addresses[0]?.telephone}</div>
                                    </div> */}
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.dob" /></label>
                                        <div className="field-name">{custForm.dob}</div>
                                    </div>
                                    {/* <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.country" /></label>
                                        <div className="field-name">{custForm.addresses[0]?.country_id}</div>
                                    </div> */}
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
                                            {/* {Object.values(attributes.mostly_intersted_in).map((type, i) => {
                                                return (
                                                    <span key={i}>{type},</span>
                                                )
                                            })} */}
                                        </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.clothingSize" /></label>
                                        <div className="field-name">
                                            {/* {Object.values(attributes.clothing_size).map((s, j) => {
                                                return (
                                                    <span key={j}>{s}/</span>
                                                )
                                            })} */}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.shoeSize" /></label>
                                        <div className="field-name">
                                            {/* {Object.values(attributes.clothing_size).map((s,k) => {
                                                return (
                                                    <span key={k}>/{s}</span>
                                                )
                                            })} */}
                                        </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.favoriteDesigners" /></label>
                                        <div className="field-name">
                                            {/* {Object.values(attributes.favourite_designers).map((d, l) => {
                                                return (
                                                    <span key={l}>{d},</span>
                                                )
                                            })} */}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.favoriteCategories" /></label>
                                        <div className="field-name">
                                            {/* {Object.values(attributes.favourite_designers).map((type, m) => {
                                                return (
                                                    <span key={m}>{type},</span>
                                                )
                                            })} */}
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
                        <div className={`addnew_address ${isPriveUser ? 'prive-bg': ''}`} onClick={openAddressModal}>
                            <div className="addressnew_addressblue">
                                <span> <IntlMessages id="myaccount.addNewAddress" /> </span>
                            </div>
                        </div>

                        {custForm && custForm.addresses.map((address, i) => {
                            return (<div className="addressnew_addressbodr" key={i}>
                                <h3><IntlMessages id="myaccount.address" /></h3>
                                <ul>
                                    <li>{address.firstname + ' ' + address.lastname}</li>
                                    <li>{address.street}</li>
                                    <li>{address.postcode}</li>
                                    <li>{address.city}</li>
                                    <li>{address.country_id}</li>
                                </ul>
                                <div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div>
                                <div className="address-action">
                                    <a onClick={() => deleteAdd(i)} className="delete_btn"><IntlMessages id="myaccount.delete" /></a>
                                    <a className={`edit_btn ${isPriveUser ? 'prive-txt': ''}`} onClick={() => editAddress(i)}>
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
                        <div className={`addnew_address ${isPriveUser ? 'prive-bg': ''}`} onClick={openPaymentMethodModal}>
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
                                <Link to="#" className="delete_btn"><IntlMessages id="myaccount.delete" /></Link>
                                <Link to="#" className={`edit_btn ${isPriveUser ? 'prive-txt': ''}`}><IntlMessages id="myaccount.edit" /></Link>
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
                                <Link to="#" className="delete_btn"><IntlMessages id="myaccount.delete" /></Link>
                                <Link to="#" className={`edit_btn ${isPriveUser ? 'prive-txt': ''}`}><IntlMessages id="myaccount.edit" /></Link>
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
                                <label className="heading_lbl"><IntlMessages id="myaccount.changePassword" /></label>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="login.password" /></label>
                                    <input type={passMask.password ? 'password' : 'text'} className="form-control" placeholder="000"
                                        id="password"
                                        value={changePass.password}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass" onClick={() => togglePasswordVisiblity('password')}>
                                        {passMask.password ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                    </span>
                                    <span className="error">{errors.errors["password"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.newPassword" /> <span
                                        className="maindatory">&#42;</span></label>
                                    <input type={passMask.newPassword ? 'password' : 'text'} className="form-control" placeholder="000" id="newPassword"
                                        value={changePass.newPassword}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass" onClick={() => togglePasswordVisiblity('newPassword')}>
                                        {passMask.newPassword ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                    </span>

                                    <span className="error">{errors.errors["newPassword"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.confirmPassword" /> <span
                                        className="maindatory">&#42;</span></label>
                                    <input type={passMask.confirmNewPassword ? 'password' : 'text'} className="form-control" placeholder="000"
                                        id="confirmNewPassword"
                                        value={changePass.confirmNewPassword}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass" onClick={() => togglePasswordVisiblity('confirmNewPassword')}>
                                        {passMask.confirmNewPassword ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                    </span>
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
                                    <input type={passMask.emailPass ? 'password' : 'text'} className="form-control" placeholder="000"
                                        id="password"
                                        value={changeEmail.password}
                                        onChange={handleEmail} />
                                    <span className="hidden-pass" onClick={() => togglePasswordVisiblity('emailPass')}>
                                        {passMask.emailPass ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                    </span>
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
                            <h1><IntlMessages id="myaccount.deleteAccount" /></h1>
                            <p><IntlMessages id="myaccount.weAreSorryToSee" /> </p>
                            <p><IntlMessages id="myaccount.ifYouStillLike" /> </p>
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
                                <Link to="customer-orders" className={`btn btn-secondary ${isPriveUser ? 'prive-bg': ''}`}>
                                    <IntlMessages id="myaccount.myOrdersReturns" /></Link>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <Link to="customer-orders" className={`btn btn-secondary ${isPriveUser ? 'prive-bg': ''}`}>
                                    <IntlMessages id="myaccount.orderDetails" /></Link>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <button type="button" className={`btn btn-secondary ${isPriveUser ? 'prive-bg': ''}`}><IntlMessages id="myaccount.returnDetails" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* customer details modal */}
            <Modal show={myDetailsModel} >
                <div className="CLE_pf_details">
                    <h1>My Details</h1>
                    <a onClick={openMyDetails} className="cross_icn"> <i className="fas fa-times"></i></a>
                    <div className="">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Frist name<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Ann"
                                id="firstname"
                                value={custForm.firstname}
                                onChange={handleChange} />
                            <span className="error">{errors.errors["firstname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Surname<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Smith" id="lastname"
                                value={custForm.lastname}
                                onChange={handleChange} />
                            <span className="error">{errors.errors["lastname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Gender</label>
                            <input type="text" className="form-control" placeholder="Woman" id="gender"
                                value={custForm.gender}
                                onChange={handleChange} />
                            <span className="error">{errors.errors["gender"]}</span>
                        </div>
                        {/* <div className="width-100 mb-3 form-field">
                            <label className="form-label">Phone number</label>
                            <input type="number" className="form-control" placeholder="+48 123 456 789" id="phone"
                                value={telephone}
                                onChange={(e) => { setTelephone(e.target.value) }}
                            />
                            <span className="error">{errors.errors["phone"]}</span>
                        </div> */}
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Date of birth</label>
                            <div className="dobfeild">
                                <select className="form-select me-3" aria-label="Default select example" onChange={dobHandler} id="day">
                                    <option value="">Select</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                </select>
                                <select className="form-select me-3" aria-label="Default select example" onChange={dobHandler} id="month">
                                    <option value="">Select</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                </select>
                                <select className="form-select" aria-label="Default select example" onChange={dobHandler} id="year">
                                    <option value="">Select</option>
                                    <option value="1990">1990</option>
                                    <option value="1991">1991</option>
                                    <option value="1993">1993</option>
                                </select>
                            </div>
                        </div>
                        {/* <div className="width-100 mb-3 form-field">
                            <label className="form-label">Country<span className="maindatory">*</span></label>
                            <select value={country} onChange={(e) => { setCountry(e.target.value) }} id="country" className="form-select" aria-label="Default select example">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country"]}</span>
                        </div> */}
                        <div className="width-100 mb-3 form-field">
                            <div className="Frgt_paswd">
                                <div className="confirm-btn">
                                    <button type="button" className="btn btn-secondary" onClick={saveCustDetails}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* my preference details modal */}
            <Modal show={myPreferenceModel} size="lg">
                <div className="CLE_pf_details">
                    <h1>My Preferences</h1>
                    <a onClick={openMyPreferences} className="cross_icn"> <i className="fas fa-times"></i></a>
                    <div className="Mosty_interested_in">
                        <h2>Mosty interested in</h2>
                        <div className="interestd_check">
                            {attributes.mostly_intersted && attributes.mostly_intersted.map((interest) => {
                                return (
                                    <div className="form-check" key={interest.id}>
                                        <input className="form-check-input" type="checkbox" value="" id={interest.name}
                                            checked={false} />
                                        <label className="form-check-label" htmlFor={interest.name}>
                                            {interest.name}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className="clothing_size mb-4">
                                    <h2>Clothing size</h2>
                                    <div className="cl_size_sec">
                                        <ul>
                                            {attributes.clothing_size && attributes.clothing_size.map(clothingSize => {
                                                return (clothingSize && clothingSize.value !== '' &&
                                                    <li key={clothingSize.value}>
                                                        {/* class active */}
                                                        <a key={clothingSize.value}>
                                                            {clothingSize.label}
                                                        </a>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="sizebtn clothnmrgin">
                                        <div className="save-btn"><Link to="#" className="btn-link-blue">Save</Link></div>
                                        <div className="save-btn removel_allbtn"><Link to="#" className="btn-link-grey">Remove all</Link></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="clothing_size">
                                    <h2>Shoes size</h2>
                                    <div className="cl_size_sec">
                                        <ul>
                                            {attributes.shoes_size && attributes.shoes_size.map(shoeSize => {
                                                return (shoeSize && shoeSize.value !== '' &&
                                                    <li><a key={shoeSize.value}>{shoeSize.label}</a></li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="sizebtn">
                                        <div className="save-btn"><Link to="#" className="btn-link-blue">Save</Link></div>
                                        <div className="save-btn removel_allbtn"><Link to="#" className="btn-link-grey">Remove all</Link></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="favorite_designers mb-4">
                        <h2>Favorite designers</h2>
                        <div className="row">

                            <div className="col-sm-6">
                                <div className="search_results">
                                    <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                                    <input type="search" placeholder="Search..." className="form-control me-1" />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="favt_section">
                                    <ul>
                                        {attributes.designers && attributes.designers.map(design => {
                                            return (design && design.value !== '' &&
                                                <li key={design.value}>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                        <label className="form-check-label">
                                                            {design.label}
                                                        </label>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="favt_dragdrop">
                                    <div className="favdesignr_size_sec">
                                        <ul>
                                            <li><Link to="#">À La Garçonne</Link></li>
                                            <li><Link to="#">ADAMO</Link></li>
                                            <li><Link to="#">A.EMERY</Link></li>
                                            <li><Link to="#" className="active">Dodo Bar Or</Link></li>
                                        </ul>
                                        <div className="save-btn removel_allbtn"><Link to="#" className="btn-link-grey">Remove all</Link></div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="favorite_designers mb-4">
                        <h2>Favorite categories</h2>
                        <div className="row">

                            <div className="col-sm-6">
                                <div className="search_results">
                                    <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                                    <input type="search" placeholder="Search..." className="form-control me-1" />
                                </div>
                            </div>

                        </div>
                        <div className="row">

                            <div className="col-sm-6">
                                <div className="favt_section">
                                    <ul>
                                        {attributes.categories && attributes.categories.map(cat => {
                                            return (
                                                <li key={cat.id}>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                                                            checked={ false} />
                                                        <label className="form-check-label">
                                                            {cat.name}
                                                        </label>
                                                    </div>
                                                </li>
                                            )
                                        })}

                                    </ul>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="favt_dragdrop">
                                    <div className="favdesignr_size_sec">
                                        <ul>

                                            <li><Link to="#">Belts</Link></li>
                                            <li><Link to="#">Necklaces</Link></li>
                                            <li><Link to="#">Scarves</Link></li>
                                            <li><Link to="#" className="active">Watches</Link></li>

                                        </ul>
                                        <div className="save-btn removel_allbtn"><Link to="#" className="btn-link-grey">Remove all</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="width-100 mb-4">
                        <div className="float-end">
                            <button type="button" className="btn btn-secondary">Confirm</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* my details modal */}
            <Modal show={myAddressModal}>
                <div className="CLE_pf_details">
                    <h1><IntlMessages id="myaccount.myAddress" /></h1>
                    <a className="cross_icn" onClick={openAddressModal}> <i className="fas fa-times"></i></a>
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
                                    <button type="button" className="btn btn-secondary" onClick={saveCustAddress}><IntlMessages id="myaccount.confirm" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Gifting preference details modal */}
            <Modal show={giftingModal} size="lg">
                <div className="gifting_pref">
                    <div className="girft_details">
                        <h1>Gifting Preferences</h1>
                        <a onClick={openGigitingModal} className="cross_icn"> <i className="fas fa-times"></i></a>
                        <div className="my_birthday mb-3">
                            <label className="form-label">My birthday</label>
                            <div className="birthdate">01 May 1990</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="width-100">
                                <div className="dobfeild_gift row">
                                    <div className="col-sm-4">
                                        <label className="form-label">I like</label>
                                        <select className="form-select me-3" aria-label="Default select example">
                                            <option value="">01</option>
                                            <option value="1">01</option>
                                            <option value="2">02</option>
                                            <option value="3">03</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-4">
                                        <label className="form-label">&nbsp;</label>
                                        <select className="form-select me-3" aria-label="Default select example">
                                            <option value="">May</option>
                                            <option value="1">May</option>
                                            <option value="2">June</option>
                                            <option value="3">July</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-4">
                                        <label className="form-label">&nbsp;</label>
                                        <select className="form-select" aria-label="Default select example">
                                            <option value="">1988</option>
                                            <option value="1">1990</option>
                                            <option value="2">1991</option>
                                            <option value="3">1993</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="dobfeild_gift row">
                                <div className="col-sm-6">
                                    <label className="form-label">I like</label>
                                    <select className="form-select " aria-label="Default select example">
                                        <option value="">Watches</option>
                                        <option value="1">01</option>
                                        <option value="2">02</option>
                                        <option value="3">03</option>
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">Style</label>
                                    <select className="form-select " aria-label="Default select example">
                                        <option value="">Contemporary</option>
                                        <option value="1">May</option>
                                        <option value="2">June</option>
                                        <option value="3">July</option>
                                    </select>
                                </div>

                            </div>
                        </div>


                    </div>

                    <div className="row">
                        <div className="col-sm-12 mt-3 mb-5">
                            <div className="form-check form-switch custom-switch">
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Notify me via emial</label>
                                <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="add_frd_birthdaysec">
                                <h2>Add a friend’s birthday</h2>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Name<span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" placeholder="John" />

                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Date of birth</label>
                                    <div className="dobfeild">
                                        <select className="form-select me-3" aria-label="Default select example">
                                            <option value="">01</option>
                                            <option value="1">01</option>
                                            <option value="2">02</option>
                                            <option value="3">03</option>
                                        </select>
                                        <select className="form-select me-3" aria-label="Default select example">
                                            <option value="">May</option>
                                            <option value="1">May</option>
                                            <option value="2">June</option>
                                            <option value="3">July</option>
                                        </select>
                                        <select className="form-select" aria-label="Default select example">
                                            <option value="">1990</option>
                                            <option value="1">1990</option>
                                            <option value="2">1991</option>
                                            <option value="3">1993</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="width-100 mb-3 form-field">
                                    <div className="dobfeild_gift row">
                                        <div className="col-sm-6">
                                            <label className="form-label">Gift for</label>
                                            <select className="form-select " aria-label="Default select example">
                                                <option value="">Watches</option>
                                                <option value="1">01</option>
                                                <option value="2">02</option>
                                                <option value="3">03</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label">Who loves</label>
                                            <select className="form-select " aria-label="Default select example">
                                                <option value="">Watches</option>
                                                <option value="1">May</option>
                                                <option value="2">June</option>
                                                <option value="3">July</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>

                                <div className="width-100 mb-3 form-field">
                                    <div className="dobfeild_gift row">
                                        <div className="width-100">
                                            <label className="form-label">Style</label>
                                        </div>
                                        <div className="col-sm-6">

                                            <select className="form-select " aria-label="Default select example">
                                                <option value="">Contemporary</option>
                                                <option value="1">01</option>
                                                <option value="2">02</option>
                                                <option value="3">03</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="float-end">
                                                <button type="button" className="btn btn-secondary">Add date</button>
                                            </div>
                                        </div>
                                        <div className="width-100 my-4">
                                            <div className="form-check form-switch custom-switch">
                                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Notify me via
                                                    emial</label>
                                                <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked"
                                                    checked={false} />
                                            </div>
                                        </div>

                                    </div>
                                </div>




                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="list_birthday">
                                <div className="width-100">
                                    <h2>List of added birthdays</h2>
                                </div>

                                <div className="favt_dragdrop  mt-3">

                                    <div className="favdesignr_size_sec">
                                        <ul>

                                            <li><Link to="#">John / 20 May 1988</Link></li>
                                            <li><Link to="#">Mom / 20 June 1964</Link></li>
                                            <li><Link to="#">Dad / 20 July 1962</Link></li>

                                        </ul>
                                        <div className="save-btn removel_allbtn"><Link to="#" className="btn-link-grey">Remove all</Link></div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="width-100 mb-4">
                            <div className="float-end">
                                <button type="button" className="btn btn-secondary">Confirm</button>
                            </div>
                        </div>

                    </div>

                </div>
            </Modal>

            {/* add payment method modal */}
            <Modal show={paymentMethod}>
                <div className="CLE_pf_details">
                    <h1 className="mb-3"><IntlMessages id="myaccount.paymentMethods" /></h1>
                    <a onClick={openPaymentMethodModal} className="cross_icn"> <i className="fas fa-times"></i></a>
                    <div className="payment_medt">
                        <div className="width-100">
                            <div className="d-grid gap-2 mx-auto">
                                <button type="button" className="btn btn-outline-primary" onClick={OpenCardModal}>
                                    <IntlMessages id="checkout.addCards" /></button>
                            </div>
                            <div className="or_diivdr">
                                <IntlMessages id="signup.or" />
                            </div>
                        </div>
                        <div className="width-100">
                            <div className="d-grid gap-2 mx-auto">
                                <button type="button" className="btn btn-outline-primary"> <IntlMessages id="checkout.addpaypal" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* add credit card modal */}
            <Modal show={addCard}>
                <div className="CLE_pf_detahils">
                    <h1 className="mb-3"><IntlMessages id="myaccount.paymentMethods" /></h1>
                    <a onClick={OpenCardModal} className="cross_icn"> <i className="fas fa-times"></i></a>
                    <div className="payment_mode">
                        <h2><IntlMessages id="checkout.addCards" /></h2>
                        <div className="width-100 mb-3 form-field">
                            <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="checkout.cardNumber" />*<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="XXXX XXXX XXXX XXXX" />
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="checkout.expiryDate" />*</label>
                            <div className="dobfeild">
                                <select className="form-select me-3" aria-label="Default select example">
                                    <option value="">Month</option>
                                    <option value="1">01</option>
                                    <option value="2">02</option>
                                    <option value="3">03</option>
                                </select>
                                <select className="form-select me-3" aria-label="Default select example">
                                    <option value="">Year</option>
                                    <option value="1">May</option>
                                    <option value="2">June</option>
                                    <option value="3">July</option>
                                </select>
                            </div>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="checkout.nameOnCard" />*<span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Baker Street 105" />
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label htmlFor="exampleInputEmail1" className="form-label">CVV<span className="maindatory">*</span></label>
                            <input type="text" className="form-control cvv_inpt" placeholder="XXX" />
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    <IntlMessages id="myaccount.saveCardDetails" />
                                </label>
                            </div>
                        </div>
                        <div className="width-100 mb-4">
                            <div className="float-end">
                                <button type="button" className="btn btn-secondary"><IntlMessages id="myaccount.confirm" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
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
)(MyProfile);