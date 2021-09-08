import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import {
    getCustomerDetails, saveCustomerDetails, getCountriesList, getPreference, changePassword,
    updateCustEmail
} from '../../../redux/pages/customers';


function CustomerDetails(props) {
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
        let result: any = await getPreference();
        // console.log(result);
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
            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-10 offset-md-1">
                    <h3>My Details</h3>
                    <p>Feel free to edit any of your details below, so your CLE account is totally up to date.</p>
                    <div className="row">
                        <div className="col-md-3">
                            <b>Name</b>
                            <p>{custForm.firstname}</p>
                            <b>Surname</b>
                            <p>{custForm.lastname}</p>
                        </div>
                        <div className="col-md-3">
                            <b>Gender</b>
                            <p>{custForm.gender}</p>
                            <b>Phone Number</b>
                            <p>{custForm.addresses[0]?.telephone}</p>
                        </div>
                        <div className="col-md-3">
                            <b>Date Of Birth</b>
                            <p>{custForm.dob}</p>
                            <b>Country</b>
                            <p>{custForm.addresses[0]?.country_id}</p>
                        </div>
                        <div className="col-md-3">
                            <button className="signup-btn" onClick={openMyDetails}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-10 offset-md-1">
                    <h3>My Preferences</h3>
                    <p>You can personalize or re-manage the preference settings</p>
                    <div className="row">
                        <div className="col-md-3">
                            <b>Mostly Interested In</b>
                            <p>{custForm.firstname}</p>
                            <b>Clothing Size</b>
                            <p>{custForm.lastname}</p>
                        </div>
                        <div className="col-md-3">
                            <b>Shoe Size</b>
                            <p>{custForm.gender}</p>
                            <b>Favorite Designers</b>
                            <p>{custForm.addresses[0]?.telephone}</p>
                        </div>
                        <div className="col-md-3">
                            <b>Favorite Categories</b>
                            <p>{custForm.dob}</p>
                        </div>
                        <div className="col-md-3">
                            <button className="signup-btn" onClick={openMyPreferences}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-10 offset-md-1">
                    <h3>Address Details</h3>
                    <p>Your address details</p>
                    <div className="row">
                        <div className="col-md-3">
                            <b>Name</b>
                            <p>{custForm.addresses[0]?.firstname}</p>
                            <b>Surname</b>
                            <p>{custForm.addresses[0]?.lastname}</p>
                        </div>
                        <div className="col-md-3">
                            <b>Address</b>
                            <p>{custForm.addresses[0]?.street}</p>
                            <b>City</b>
                            <p>{custForm.addresses[0]?.city}</p>
                        </div>
                        <div className="col-md-3">
                            <b>Country</b>
                            <p>{custForm.addresses[0]?.country_id}</p>
                        </div>
                        <div className="col-md-3">
                            <button className="signup-btn" onClick={openAddressModal}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-10 offset-md-1">
                    <h3>Gifting Preferences</h3>
                    <p>You can put information abount certain occasions or birthdays them we'll communicate gift ideas.</p>
                    <div className="row">
                        <div className="col-md-3">
                            <b>My Birthday</b>
                            <p>01 May 1990</p>
                        </div>
                        <div className="col-md-3">
                            <b>List of Birthdays</b>
                            <p>Jhon / Mom +3 more</p>
                        </div>
                        <div className="col-md-3">
                        </div>
                        <div className="col-md-3">
                            <button className="signup-btn" onClick={openGigitingModal}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ marginTop: '150px' }}>
                <h3>Change Password and Email</h3>
                <div className="col-md-5 offset-md-1">
                    <div className="row">
                        <b>Change Password</b>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>Password</b></label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                value={changePass.password}
                                onChange={handlePassword}
                            />
                            <span className="error">{errors.errors["password"]}</span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>New Password</b></label>
                            <input type="password"
                                className="form-control"
                                id="newPassword"
                                value={changePass.newPassword}
                                onChange={handlePassword}
                            />
                            <span className="error">{errors.errors["newPassword"]}</span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>Confirm New Password</b></label>
                            <input type="password"
                                className="form-control"
                                id="confirmNewPassword"
                                value={changePass.confirmNewPassword}
                                onChange={handlePassword}
                            />
                            <span className="error">{errors.errors["confirmNewPassword"]}</span>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="signup-btn" onClick={handleChangePass}> Confirm</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-5 offset-md-1">
                    <div className="row">
                        <b>New Email</b>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>New Email Address</b></label>
                            <input type="email"
                                className="form-control"
                                id="newEmail"
                                value={changeEmail.newEmail}
                                onChange={handleEmail}
                            />
                            <span className="error">{errors.errors["newEmail"]}</span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>Confirm New Email Address</b></label>
                            <input type="email"
                                className="form-control"
                                id="confirmNewEmail"
                                value={changeEmail.confirmNewEmail}
                                onChange={handleEmail}
                            />
                            <span className="error">{errors.errors["confirmNewEmail"]}</span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>Password</b></label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                value={changeEmail.password}
                                onChange={handleEmail}
                            />
                            <span className="error">{errors.errors["password"]}</span>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="signup-btn" onClick={handleChangeEmail}> Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

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
                <Modal.Header> <h4>My Address</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={openAddressModal} aria-label="Close"></button></Modal.Header>
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
)(CustomerDetails);