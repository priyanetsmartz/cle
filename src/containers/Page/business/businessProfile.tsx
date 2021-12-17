import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import {
    saveCustomerDetails, getCountriesList, changePassword,
    updateCustEmail, deleteAddress, getRegionsByCountryID
} from '../../../redux/pages/customers';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { DROPDOWN } from '../../../config/constants';
import callIcon from '../../../image/call-icon.png';
import deleteIcon from '../../../image/delete-icon.png';
import timerIcon from '../../../image/timer_icon.png';
import { sessionService } from 'redux-react-session';
import { useIntl } from 'react-intl';
import { getVendorDetails } from '../../../redux/pages/vendorLogin';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const companylogo = `${baseUrl}/pub/media/`;
function BusinessProfile(props) {
    const intl = useIntl();
    const [vendorData, setVendorData] = useState({
        vendor_name: '',
        telephone: '',
        country_id: '',
        dob: '',
        email: '',
        street: '',
        city: ''
    });

    const [custId, setCustid] = useState(props.token.cust_id);
    const [businessDetails, setBusinessDetails] = useState({});
    const [bankDetails, setBankDetails] = useState({});
    const [billingAddressDetails, setBillingAddrssDetails] = useState({});
    const [custForm, setCustForm] = useState({
        id: custId,
        email: "",
        firstname: "",
        lastname: "",
        gender: "",
        dob: "",
        website_id: 1,
        addresses: [],
        custom_attributes: []
    });


    const userGroup = props.token.token;
    const [isShow, setIsShow] = useState(false);
    // const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup == '4') ? true : false);


    const [myDetailsModel, setMyDetailsModel] = useState(false);
    const [myBussinessModel, setMyBussinessModel] = useState(false);
    const [openBankModal, setOpenBankModal] = useState(false);

    const [myAddressModal, setMyAddressModal] = useState(false);
    const [addCard, setAddCard] = useState(false);
    const [passMask, setPassMask] = useState({
        password: true,
        newPassword: true,
        confirmNewPassword: true,
        emailPass: true
    })

    const [countries, setCountries] = useState([]); // for countries dropdown
    const [regions, setRegions] = useState([]); // for regions dropdown

    const [dob, setDob] = useState({
        day: '',
        month: '',
        year: ''
    });
    const [country, setCountry] = useState("");


    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: custId,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "",
        region_id: "",
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

    //--------------------------------------------------------------
    useEffect(() => {
        getVendor();
        getData();

        getCountries();
        return () => {
            setIsShow(false)
            setBankDetails({})
            setBusinessDetails({})
            setBillingAddrssDetails({})
        }
    }, []);
    async function getVendor() {
        let vendor = await sessionService.loadUser()
        if (vendor && vendor.type === "vendor") {
            // console.log(vendor)
            setVendorData(vendor);
        } else {
            window.location.href = '/';
        }
    }

    async function getData() {
        let result: any = await getVendorDetails('english');
        setBankDetails(result['data'] && result['data'].length > 0 ? result['data'][0]['bankDetails'] : [])
        setBusinessDetails(result['data'] && result['data'].length > 0 ? result['data'][0]['businessDetails'] : [])
        setBillingAddrssDetails(result['data'] && result['data'].length > 0 ? result['data'][0]['billingAddress'] : [])

    }
    // async function getData() {
    //     let result: any = await getCustomerDetails();
    //     const d = result.data.dob ? result.data.dob.split("-") : moment().format("YYYY-MM-DD").split("-");
    //     dob.day = d[2];
    //     dob.month = d[1];
    //     dob.year = d[0];
    //     setDob(dob);

    //     if (result) {
    //         setCustForm(result.data);
    //     }
    // }
    //-----------------------------------------------------------------------------------------------------

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
    const handlebussinessChange = (e) => {
        const { id, value } = e.target
        setBusinessDetails(prevState => ({
            ...prevState,
            [id]: value
        }))

    }
    const saveCustDetails = async (e) => {
        e.preventDefault();
        if (dob.day !== '' && dob.month !== '' && dob.year !== '') {
            custForm.dob = `${dob.day}/${dob.month}/${dob.year}`;
        }
        let result: any = await saveCustomerDetails(custId, { customer: custForm });
        if (result) {
            setMyDetailsModel(false);
            notification("success", "", intl.formatMessage({ id: "customerdetailsupdated" }));
        }
    }

    // for customer address popup window starts here
    const saveCustAddress = async (e) => {
        if (validateAddress()) {
            setIsShow(true);
            let obj: any = { ...custAddForm };
            if (obj.region_id == '') delete obj.region_id;
            obj.street = [obj.street];
            if (obj.id === 0) {
                custForm.addresses.push(obj);
            } else {
                custForm.addresses[addIndex] = obj;
            }
            //console.log(custAddForm);
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
                    region_id: "",
                    street: ""
                });
                notification("success", "", intl.formatMessage({ id: "customerAddressUpdate" }));
                setIsShow(false);
            }
        }
    }

    const saveBankDetails = async (e) => {
        console.log(bankDetails['companyname'])
    }
    const saveBussinessDetails = async (e) => {
        console.log(businessDetails)
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
            error["city"] = intl.formatMessage({ id: "pinreq" });
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
    // for customer address popup window ends here

    //edit existing address starts here------------->
    const editAddress = (index) => {
        delete custForm.addresses[index].region;
        getRegions(custForm.addresses[index].country_id, index);
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
            notification("success", "", intl.formatMessage({ id: "customerAddressDelete" }));
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

    const handleBankChange = (e) => {
        const { id, value } = e.target;
        setBankDetails(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleCountryChange = async (e) => {
        const { id, value } = e.target;
        setCustAddForm(prevState => ({
            ...prevState,
            [id]: value
        }));
        getRegions(value);
    }

    const getRegions = async (value, i?) => {
        const res: any = await getRegionsByCountryID(value);
        if (res.data.available_regions === undefined) {
            setRegions([]);
            if (i) {
                setCustAddForm(prevState => ({
                    ...prevState,
                    region_id: ''
                }));
            }
        } else {
            setRegions(res.data.available_regions);
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
                notification("success", "", intl.formatMessage({ id: "passwordUpdate" }));
                setChangePass({
                    confirmNewPassword: "",
                    newPassword: "",
                    password: ""
                });
            } else {
                notification("error", "", intl.formatMessage({ id: "passwordInvalid" }));
            }
        }
    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!changePass["password"]) {
            formIsValid = false;
            error["password"] = intl.formatMessage({ id: "passwordreq" });
        }
        if (!changePass["newPassword"]) {
            formIsValid = false;
            error["newPassword"] = intl.formatMessage({ id: "newpasswordreq" });
        }
        if (!changePass["confirmNewPassword"]) {
            formIsValid = false;
            error["confirmNewPassword"] = intl.formatMessage({ id: "confirmnewpasswordreq" });
        }
        if (changePass["confirmNewPassword"] !== changePass["newPassword"]) {
            formIsValid = false;
            error["confirmNewPassword"] = intl.formatMessage({ id: "confirmnewnotmatched" });
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
                notification("success", "", intl.formatMessage({ id: "newEmailUpdate" }));
                setChangeEmail({
                    confirmNewEmail: "",
                    newEmail: "",
                    password: ""
                })
            } else {
                notification("error", "", intl.formatMessage({ id: "errorNewEmailUpdate" }));
            }
        }
    }

    const handleValidationEmail = () => {
        let error = {};
        let formIsValid = true;

        if (typeof changeEmail["newEmail"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(changeEmail["newEmail"]))) {
                formIsValid = false;
                error["newEmail"] = intl.formatMessage({ id: "emailvalidation" });
            }
        }
        if (typeof changeEmail["confirmNewEmail"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(changeEmail["confirmNewEmail"]))) {
                formIsValid = false;
                error["confirmNewEmail"] = intl.formatMessage({ id: "confirmneemailvalid" });
            }
        }
        if (!changeEmail["newEmail"]) {
            formIsValid = false;
            error["newEmail"] = intl.formatMessage({ id: "emailrequired" });
        }
        if (!changeEmail["confirmNewEmail"]) {
            formIsValid = false;
            error["confirmNewEmail"] = intl.formatMessage({ id: "confirmneemailreq" })
        }

        if (!changeEmail["password"]) {
            formIsValid = false;
            error["password"] = intl.formatMessage({ id: "passwordreq" })
        }

        if (changeEmail["confirmNewEmail"] !== changeEmail["newEmail"]) {
            formIsValid = false;
            error["confirmNewEmail"] = intl.formatMessage({ id: "confirmpasswordnotmatched" })
        }

        setError({ errors: error });
        return formIsValid;
    }
    //change email ends here----------------------------------------->

    const openMyDetails = () => {
        setMyDetailsModel(!myDetailsModel);
    }

    const openBussinessModel = () => {
        setMyBussinessModel(!myBussinessModel);
    }

    const openBankDetailsModal = () => {
        setOpenBankModal(!openBankModal)
    }
    // const openMyPreferences = () => {
    //     getAttributes();
    //     setMyPreferenceModel(!myPreferenceModel);
    // }

    const openAddressModal = () => {
        setMyAddressModal(!myAddressModal);
    }

    // const openGigitingModal = () => {
    //     setGiftingModal(!giftingModal);
    // }



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
                                        <div className="field-name">{vendorData.vendor_name}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.phoneNo" /></label>
                                        <div className="field-name">{vendorData.telephone}</div>
                                    </div>
                                    {/* <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.surName" /></label>
                                        <div className="field-name"></div>
                                    </div> */}
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.street" /></label>
                                        <div className="field-name">{vendorData.street} </div>
                                    </div>
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.city" /></label>
                                        <div className="field-name">{vendorData.city} </div>
                                    </div>

                                </div>
                                <div className="col-sm-4">

                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.country" /></label>
                                        <div className="field-name">{vendorData.country_id}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-sm-3">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary" onClick={openMyDetails}>
                                    <IntlMessages id="myaccount.edit" />
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="business.Details" /></h1>
                            <p><IntlMessages id="myaccount.feelFreeToEdit" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-3">
                                    <div className='companylogo'> <img className="rounded-circle" src={companylogo + '/' + businessDetails['logoImagePath']} alt={businessDetails['businessCompanyName']} width="100%" height="100%" />
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="business.companyname" /></label>
                                        <div className="field-name">{businessDetails['businessCompanyName']}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="business.Website" /></label>
                                        <div className="field-name">{businessDetails['businessWebsite']}</div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="business.IbamNo" /></label>
                                        <div className="field-name">{businessDetails['businessIbamNo']} </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="business.Facebook" /></label>
                                        <div className="field-name">{businessDetails['businessFacebook']}</div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="tax" /></label>
                                        <div className="field-name">{businessDetails['businessTax']}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="businessInstagram" /></label>
                                        <div className="field-name">{businessDetails['businessInstagram']}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary" onClick={openBussinessModel}>
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
                        {(custForm && custForm.addresses && custForm.addresses.length > 0) && (<>
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
                                    {i == 0 && <><div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                        <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div></>}
                                    <div className="address-action">
                                        <Link to="#" onClick={() => deleteAdd(i)} className="delete_btn"><IntlMessages id="myaccount.delete" /></Link>
                                        <Link to="#" className="edit_btn" onClick={() => editAddress(i)}>
                                            <IntlMessages id="myaccount.edit" />
                                        </Link>
                                    </div>
                                </div>);
                            })}
                        </>)}

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
                    <div className="row">
                        <div className="col-sm-12">
                            <h5><IntlMessages id="myaccount.Bank" /></h5>
                            <p><IntlMessages id="myaccount.addOrChangePayments" /> </p>
                        </div>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-4">
                                        <label className="form-label"><IntlMessages id="business.companyname" /></label>
                                        <div className="field-name">{bankDetails['bankName']}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details  mb-4">
                                        <label className="form-label"><IntlMessages id="business.bankName" /></label>
                                        <div className="field-name">{bankDetails['bankName']}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-4">
                                        <label className="form-label"><IntlMessages id="business.accountNumber" /></label>
                                        <div className="field-name">{bankDetails['accountNumber']} </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary" onClick={openBankDetailsModal}>
                                    <IntlMessages id="myaccount.edit" />
                                </button>
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
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="change-paswd-sec col-sm-6">
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
                        <div className="row">

                            <div className="col-sm-6">
                                <label className="form-label heading_lbl"><IntlMessages id="login.email" /></label>
                                <div className="password_edit">{custForm.email}</div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="newemail-sec col-sm-6">
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
                                                <img src={callIcon} className="img-fluid" alt="" /> Step 1: Contact Customer Care
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
                                                <img src={deleteIcon} className="img-fluid" alt="" /> Step II: We'll deactivate your
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
                                                <img src={timerIcon} className="img-fluid" alt="" /> Don't want to close your account but
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
                <div className="CLE_pf_details">
                    <Modal.Header>
                        <h1>My Details</h1>
                        <Link to="#" onClick={openMyDetails} className="cross_icn"> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <Modal.Body className="arabic-rtl-direction">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">First name<span className="maindatory">*</span></label>
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
                            <select className="form-select" value={custForm.gender} aria-label="Default select example" onChange={handleChange} id="gender">
                                <option value="">Select</option>
                                {DROPDOWN.gender.map(opt => {
                                    return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                })}
                            </select>
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
                                <select className="form-select me-3" value={dob.day} aria-label="Default select example" onChange={dobHandler} id="day">
                                    <option value="">Select</option>
                                    {DROPDOWN.dates.map(opt => {
                                        return (<option value={opt} key={opt}>{opt}</option>);
                                    })}

                                </select>
                                <select className="form-select me-3" value={dob.month} aria-label="Default select example" onChange={dobHandler} id="month">
                                    <option value="">Select</option>
                                    {DROPDOWN.months.map(opt => {
                                        return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                    })}
                                </select>
                                <select className="form-select" value={dob.year} aria-label="Default select example" onChange={dobHandler} id="year">
                                    <option value="">Select</option>
                                    {DROPDOWN.years.map(opt => {
                                        return (<option value={opt} key={opt}>{opt}</option>);
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Country<span className="maindatory">*</span></label>
                            <select value={country} onChange={(e) => { setCountry(e.target.value) }} id="country" className="form-select" aria-label="Default select example">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id}>{opt.full_name_english}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country"]}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="width-100 mb-3 form-field">
                        <div className="Frgt_paswd">
                            <div className="confirm-btn">
                                <button type="button" className="btn btn-secondary" onClick={saveCustDetails}>Confirm</button>
                            </div>
                        </div>
                    </Modal.Footer>

                </div>
            </Modal>

            {/* my bussiness details  */}
            <Modal show={myBussinessModel} >
                <div className="CLE_pf_details">
                    <Modal.Header>
                        <h1><IntlMessages id="business.Details" /></h1>
                        <Link to="#" onClick={openBussinessModel} className="cross_icn"> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <Modal.Body className="arabic-rtl-direction">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.companyname" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.companyname" })}
                                id="companyname"
                                value={businessDetails['businessCompanyName']}
                                onChange={handlebussinessChange} />
                            <span className="error">{errors.errors["companyname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.IbamNo" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.IbamNo" })} id="ibam"
                                value={businessDetails['businessIbamNo']}
                                onChange={handlebussinessChange} />
                            <span className="error">{errors.errors["ibam"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="tax" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "tax" })} id="tax"
                                value={businessDetails['businessTax']}
                                onChange={handlebussinessChange} />
                            <span className="error">{errors.errors["tax"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.Website" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.Website" })} id="webite"
                                value={businessDetails['businessWebsite']}
                                onChange={handlebussinessChange} />
                            <span className="error">{errors.errors["webite"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.Facebook" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.Facebook" })} id="facebook"
                                value={businessDetails['businessFacebook']}
                                onChange={handlebussinessChange} />
                            <span className="error">{errors.errors["facebook"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="businessInstagram" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "businessInstagram" })} id="instagram"
                                value={businessDetails['businessInstagram']}
                                onChange={handlebussinessChange} />
                            <span className="error">{errors.errors["instagram"]}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="width-100 mb-3 form-field">
                        <div className="Frgt_paswd">
                            <div className="confirm-btn">
                                <button type="button" className="btn btn-secondary" onClick={saveBussinessDetails}><IntlMessages id="gift.confirm" /></button>
                            </div>
                        </div>
                    </Modal.Footer>

                </div>
            </Modal>

            {/* my Billing adrress details modal */}
            <Modal show={myAddressModal}>
                <Modal.Body className="CLE_pf_details">
                    <Modal.Header><h1><IntlMessages id="myaccount.myAddress" /></h1>
                        <Link to="#" className="cross_icn" onClick={openAddressModal}> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <div className="">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="register.first_name" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "register.first_name" })}
                                id="firstname"
                                value={custAddForm.firstname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["firstname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.surName" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="lastname"
                                placeholder={intl.formatMessage({ id: "myaccount.surName" })}
                                value={custAddForm.lastname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["lastname"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.phoneNo" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="telephone"
                                placeholder={intl.formatMessage({ id: "myaccount.phoneNo" })}
                                value={billingAddressDetails['billing_telephone']}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["telephone"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.address" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="street"
                                placeholder={intl.formatMessage({ id: "myaccount.address" })}
                                value={billingAddressDetails['billing_street']}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["street"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.city" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="city"
                                placeholder={intl.formatMessage({ id: "myaccount.city" })}
                                value={billingAddressDetails['billing_city']}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["city"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.postCode" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="postcode"
                                placeholder={intl.formatMessage({ id: "myaccount.postCode" })}
                                value={billingAddressDetails['billing_zip']}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["postcode"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>
                            <select value={billingAddressDetails['billing_country_id']} onChange={handleCountryChange} id="country_id" className="form-select">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id} >{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country_id"]}</span>
                        </div>
                        {regions.length > 0 &&
                            <div className="width-100 mb-3 form-field">
                                <label className="form-label">
                                    <IntlMessages id="myaccount.region" /></label>
                                <select value={custAddForm.region_id} onChange={handleAddChange} id="region_id" className="form-select">
                                    <option value="">Select</option>
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
                                        <button type="button" className="btn btn-secondary" onClick={saveCustAddress} style={{ "display": !isShow ? "inline-block" : "none" }}>
                                            <IntlMessages id="myaccount.confirm" />
                                        </button>
                                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                            <IntlMessages id="loading" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Footer>
                    </div>
                </Modal.Body>
            </Modal>

            {/* my details modal */}
            {/* <Modal show={myAddressModal}>
                <Modal.Body className="CLE_pf_details">
                    <Modal.Header><h1><IntlMessages id="myaccount.myAddress" /></h1>
                        <Link to="#" className="cross_icn" onClick={openAddressModal}> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
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
                        {regions.length > 0 &&
                            <div className="width-100 mb-3 form-field">
                                <label className="form-label">
                                    <IntlMessages id="myaccount.region" /></label>
                                <select value={custAddForm.region_id} onChange={handleAddChange} id="region_id" className="form-select">
                                    <option value="">Select</option>
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
                                        <button type="button" className="btn btn-secondary" onClick={saveCustAddress} style={{ "display": !isShow ? "inline-block" : "none" }}>
                                            <IntlMessages id="myaccount.confirm" />
                                        </button>
                                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                            <IntlMessages id="loading" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Footer>
                    </div>
                </Modal.Body>
            </Modal> */}


            {/* add payment method modal */}
            <Modal show={openBankModal}>
                <Modal.Body className="CLE_pf_details">
                    <Modal.Header>
                        <h1 className="mb-3"><IntlMessages id="myaccount.Bank" /></h1>
                        <Link to="#" onClick={openBankDetailsModal} className="cross_icn"> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <div className="payment_medt">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.companyname" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.companyname" })}
                                id="companyname"
                                value={businessDetails['businessCompanyName']}
                                onChange={handleBankChange} />
                            <span className="error">{errors.errors["companyname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.bankName" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.bankName" })}
                                id="bankname"
                                value={bankDetails['bankName']}
                                onChange={handleBankChange} />
                            <span className="error">{errors.errors["bankname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.accountNumber" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="**** **** **** ****"
                                id="accountnumber"
                                pattern="[+-]?\d+(?:[.,]\d+)?"
                                value={bankDetails['accountNumber']}
                                onChange={handleBankChange} />
                            <span className="error">{errors.errors["accountnumber"]}</span>
                        </div>
                        <Modal.Footer>
                            <div className="width-100 mb-3 form-field">
                                <div className="Frgt_paswd">
                                    <div className="confirm-btn">
                                        <button type="button" className="btn btn-secondary" onClick={saveBankDetails} style={{ "display": !isShow ? "inline-block" : "none" }}>
                                            <IntlMessages id="myaccount.confirm" />
                                        </button>
                                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                            <IntlMessages id="loading" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Footer>
                    </div>
                </Modal.Body>
            </Modal>

            {/* add credit card modal */}
            {/* <Modal show={addCard}>
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
            </Modal> */}
        </div>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps
)(BusinessProfile);