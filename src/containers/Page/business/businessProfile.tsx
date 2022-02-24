import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import {
    getCountriesList, getRegionsByCountryID
} from '../../../redux/pages/customers';
import moment from 'moment';
import { language } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { DROPDOWN } from '../../../config/constants';
import HtmlContent from '../../partials/htmlContent';
import { sessionService } from 'redux-react-session';
import { useIntl } from 'react-intl';
import { getVendorDetails, editBusinessDetails, editVendor, editBankDetails, editVendorAddress, changePasswordVendor, vendorResetEmail } from '../../../redux/pages/vendorLogin';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import user from '../../../image/user.png';
import { capitalize, getCountryName, getRegionName } from '../../../components/utility/allutils';
import ForgottenPassword from './bussinessForgotpassword';
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const companylogo = `${baseUrl}pub/media/`;
function BusinessProfile(props) {
    const intl = useIntl();
    const [forgotPopup, setForgotPopup] = useState(false);
    const [vendorId, setVendorId] = useState(props?.token?.vendor_id)
    const [saveCustDetailsLoader, setSaveCustDetailsLoader] = useState(false);
    const [saveBusinessDetailsLoader, setSaveBusinessDetailsLoader] = useState(false);

    const [vendorForm, setVendorForm] = useState({
        vendorId: vendorId,
        email: '',
        vendorName: '',
        vendorTelephone: '',
        countryName: '',
        countryId: '',
        vendorDateofBirth: '',
        location: '',
        gender: "",
        contactMethod: ""
    });

    const [businessDetailsForm, setbussinessDetailsForm] = useState({
        vendorId: vendorId,
        businessCompanyName: "",
        businessIbamNo: "",
        businessTax: "",
        businessWebsite: "",
        businessFacebook: "",
        businessInstagram: "",
        logoImagePath: ""
    });

    const [bankDetails, setBankDetails] = useState({
        vendorId: vendorId,
        companyName: "",
        bankName: "",
        accountNumber: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isShow, setIsShow] = useState(false);
    const [isAddShow, setIsAddShow] = useState(false);

    const [myDetailsModel, setMyDetailsModel] = useState(false);
    const [myBussinessModel, setMyBussinessModel] = useState(false);
    const [openBankModal, setOpenBankModal] = useState(false);

    const [myAddressModal, setMyAddressModal] = useState(false);

    const [passMask, setPassMask] = useState({
        password: true,
        newPassword: true,
        confirmNewPassword: true,
        emailPass: true
    })

    const [countries, setCountries] = useState([]); // for countries dropdown
    const [regions, setRegions] = useState([]); // for regions dropdown

    const [dob, setDob] = useState({
        day: moment().format("DD"),
        month: moment().format("MM"),
        year: moment().format("YYYY")
    });



    const [vendorAddForm, setVendorAddForm] = useState({
        vendorId: vendorId,
        zip: "",
        city: "",
        country: "",
        countryId: "",
        region_id: "",
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
        password2: "",
    });

    const [errors, setError] = useState({
        errors: {}
    });
    const [errorsPersonal, setErrorPersonal] = useState({
        errors: {}
    });
    const [errorsBussiness, setErrorsBussiness] = useState({
        errors: {}
    });
    const [errorsBank, setErrorBank] = useState({
        errors: {}
    });
    //--------------------------------------------------------------
    useEffect(() => {
        getVendor();
        getData();

        getCountries();
        return () => {
            setIsShow(false)
        }
    }, []);

    async function getVendor() {
        let vendor = await sessionService.loadUser()
        if (vendor && vendor.type === "vendor") {
        } else {
            window.location.href = '/';
        }
    }

    async function getData() {
        let lang = props.languages ? props.languages : language;
        let result: any = await getVendorDetails(lang);

        const d = result && result['data'] && result['data'].length > 0 && result['data'][0]['vendorPersonalDetails'] ? result['data'][0]['vendorPersonalDetails'].vendorDateofBirth.split("-") : moment().format("YYYY-MM-DD").split("-");

        dob.day = d[2];
        dob.month = d[1];
        dob.year = d[0];
        setDob(dob);
        let country = result && result['data'] && result['data'].length > 0 ? result['data'][0]['shippingAddress'].countryId : '';
        getRegions(country)
        setVendorForm(result && result['data'] && result['data'].length > 0 ? result['data'][0]['vendorPersonalDetails'] : [])
        setBankDetails(result && result['data'] && result['data'].length > 0 ? result['data'][0]['bankDetails'] : [])
        setbussinessDetailsForm(result && result['data'] && result['data'].length > 0 ? result['data'][0]['businessDetails'] : [])
        setVendorAddForm(result && result['data'] && result['data'].length > 0 ? result['data'][0]['shippingAddress'] : [])

    }

    const getCountries = async () => {
        let result: any = await getCountriesList();
        let country = result && result.data ? result.data : []
        setCountries(country);
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setVendorForm(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const handlebussinessChange = (e) => {
        const { id, value } = e.target
        setbussinessDetailsForm(prevState => ({
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

    const handleCountryChangeAdd = async (e) => {
        const { id, value } = e.target;
        setVendorAddForm(prevState => ({
            ...prevState,
            [id]: value
        }));
        getRegions(value);
    }


    const saveCustDetails = async (e) => {
        e.preventDefault();
        if (validatePersonalDetails()) {
            setSaveCustDetailsLoader(true)
            if (dob.day !== '' && dob.month !== '' && dob.year !== '') {
                vendorForm.vendorDateofBirth = `${dob.year}-${dob.month}-${dob.day}`;
            }
            let payload = {
                "vendorId": props?.token?.vendor_id,
                "location": vendorForm.location,
                "vendorName": vendorForm.vendorName,
                "telephone": vendorForm.vendorTelephone,
                "dateofbirth": vendorForm.vendorDateofBirth,
                "countryId": vendorForm.countryId,
                "gender": vendorForm.gender,
                "contactmethod": vendorForm.contactMethod
            }
            let result: any = await editVendor(payload);
            if (result && result.data && !result.data.message) {
                getData();
                setSaveCustDetailsLoader(false)
                setMyDetailsModel(false);
                notification("success", "", intl.formatMessage({ id: "customerdetailsupdated" }));
            } else {
                setSaveCustDetailsLoader(false)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
        }
    }


    // for vendor address popup window starts here
    const saveCustAddress = async (e) => {

        if (validateAddress()) {

            vendorAddForm.vendorId = props?.token?.vendor_id;
            delete vendorAddForm['countryName']
            delete vendorAddForm['region']
            vendorAddForm['region'] = vendorAddForm['region_id']
            setIsAddShow(true);
            let result: any = await editVendorAddress(vendorAddForm);
            if (result && result.data && !result.data.message) {
                getData();
                setIsAddShow(false)
                setMyAddressModal(false);
                notification("success", "", intl.formatMessage({ id: "customerdetailsupdated" }));
            } else {
                setIsAddShow(false)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
        }
    }

    const saveBankDetails = async (e) => {
        e.preventDefault()
        bankDetails.companyName = businessDetailsForm.businessCompanyName;
        if (validateBankDetails()) {
            setIsShow(true)
            bankDetails.vendorId = props?.token?.vendor_id;
            let result: any = await editBankDetails(bankDetails);
            if (result && result.data && !result.data.message) {
                setIsShow(false)
                setOpenBankModal(false)
                notification("success", "", intl.formatMessage({ id: "customerdetailsupdated" }));
            } else {
                setIsShow(false)
                setOpenBankModal(false)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
        }
    }
    const saveBussinessDetails = async (e) => {

        e.preventDefault()
        let payload = {
            "vendorId": props?.token?.vendor_id,
            "companyName": businessDetailsForm.businessCompanyName,
            "businessIBAMNo": businessDetailsForm.businessIbamNo,
            "businessTax": businessDetailsForm.businessTax,
            "businessWebsite": businessDetailsForm.businessWebsite,
            "businessFacebook": businessDetailsForm.businessFacebook,
            "businessInstagram": businessDetailsForm.businessInstagram,
            "logoImagePath": ""
        }
        if (validateBussinessDetails()) {
            setSaveBusinessDetailsLoader(true)
            let result: any = await editBusinessDetails(payload);
            if (result && result.data && !result.data.message) {
                setMyBussinessModel(false);
                setSaveBusinessDetailsLoader(false)
                notification("success", "", intl.formatMessage({ id: "customerdetailsupdated" }));
            } else {
                setSaveBusinessDetailsLoader(false)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
        }
    }


    const validatePersonalDetails = () => {
        let error = {};
        let formIsValid = true;

        if (!vendorForm.vendorName) {
            formIsValid = false;
            error['vendorName'] = intl.formatMessage({ id: "vendorName" });
        }
        if (!vendorForm.location) {
            formIsValid = false;
            error["location"] = intl.formatMessage({ id: "locationreq" });
        }
        if (!vendorForm.gender) {
            formIsValid = false;
            error["gender"] = intl.formatMessage({ id: "gifting.gender" });
        }

        if (!vendorForm.vendorTelephone) {
            formIsValid = false;
            error['vendorTelephone'] = intl.formatMessage({ id: "phonereq" });
        }
        if (!vendorForm.countryId) {
            formIsValid = false;
            error["countryId"] = intl.formatMessage({ id: "countryreq" });
        }
        setErrorPersonal({ errors: error });
        return formIsValid;
    }

    const validateAddress = () => {
        let error = {};
        let formIsValid = true;
        if (!businessDetailsForm.businessCompanyName) {
            formIsValid = false;
            error["businessCompanyName"] = intl.formatMessage({ id: "companynamefirst" });
        }
        if (!vendorAddForm.zip) {
            formIsValid = false;
            error["zip"] = intl.formatMessage({ id: "pinreq" });
        }
        if (!vendorAddForm.street) {
            formIsValid = false;
            error["street"] = intl.formatMessage({ id: "addressreq" });
        }
        if (!vendorAddForm.city) {
            formIsValid = false;
            error["city"] = intl.formatMessage({ id: "cityreq" });
        }

        setError({ errors: error });
        return formIsValid;
    }

    const validateBankDetails = () => {
        let error = {};
        let formIsValid = true;
        if (!bankDetails.companyName) {
            formIsValid = false;
            error['companyName'] = intl.formatMessage({ id: "companynamefirst" });
        }
        if (!bankDetails.bankName) {
            formIsValid = false;
            error["bankName"] = intl.formatMessage({ id: "bankname" });
        }
        if (bankDetails.accountNumber && (bankDetails.accountNumber.length < 12 || bankDetails.accountNumber.length > 16)) {
            formIsValid = false;
            error['accountNumber'] = intl.formatMessage({ id: "accountnumberlength" });
        }
        if (!bankDetails.accountNumber) {
            formIsValid = false;
            error['accountNumber'] = intl.formatMessage({ id: "accountnumber" });
        }
        setErrorBank({ errors: error });
        return formIsValid;
    }

    const validateBussinessDetails = () => {
        let error = {};
        let formIsValid = true;

        if (!businessDetailsForm.businessCompanyName) {
            formIsValid = false;
            error['businessCompanyName'] = intl.formatMessage({ id: "companyreq" });
        }

        if (!businessDetailsForm.businessIbamNo) {
            formIsValid = false;
            error['businessIbamNo'] = intl.formatMessage({ id: "IBAMreq" });
        }
        if (!businessDetailsForm.businessTax) {
            formIsValid = false;
            error['businessTax'] = intl.formatMessage({ id: "businessTaxreq" });
        }
        if (businessDetailsForm.businessFacebook !== "") {
            if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(businessDetailsForm.businessFacebook))) {
                formIsValid = false;
                error["businessFacebook"] = intl.formatMessage({ id: "facebookinvalid" });
            }
        }

        if (businessDetailsForm.businessInstagram !== "") {
            if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(businessDetailsForm.businessInstagram))) {
                formIsValid = false;
                error["businessInstagram"] = intl.formatMessage({ id: "instagraminvalid" });
            }
        }

        if (typeof (businessDetailsForm.businessWebsite) !== "undefined") {
            if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(businessDetailsForm.businessWebsite))) {
                formIsValid = false;
                error["businessWebsite"] = intl.formatMessage({ id: "websiteinvalid" });
            }
        }


        if (!businessDetailsForm.businessWebsite) {
            formIsValid = false;
            error['businessWebsite'] = intl.formatMessage({ id: "websitereq" });
        }
        setErrorsBussiness({ errors: error });
        return formIsValid;
    }

    //for customer address
    const handleAddChange = (e) => {
        const { id, value } = e.target;
        setVendorAddForm(prevState => ({
            ...prevState,
            [id]: value
        }))

    }

    const getRegions = async (value, i?) => {
        const res: any = await getRegionsByCountryID(value);
        if (res.data.available_regions === undefined) {
            setRegions([]);
            if (i) {
                setVendorAddForm(prevState => ({
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
            let data = {
                email: props.token.email,
                password: changePass.password,
                confirmPass: changePass.newPassword
            }
            let result: any = await changePasswordVendor(data);
            if (result && result.data && !result.data.message) {
                notification("success", "", intl.formatMessage({ id: "passwordUpdate" }));
                setChangePass({
                    confirmNewPassword: "",
                    newPassword: "",
                    password: ""
                });
            } else {
                setChangePass({
                    confirmNewPassword: "",
                    newPassword: "",
                    password: ""
                });
                if (result.data.message) {
                    notification("error", "", result.data.message);
                } else {
                    notification("error", "", intl.formatMessage({ id: "passwordInvalid" }));
                }

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
                email: props.token.email,
                password: changeEmail.password2,
                new_email: changeEmail.newEmail,
            }

            let result: any = await vendorResetEmail(req);
            if (result && result.data && !result.data.message) {
                notification("success", "", intl.formatMessage({ id: "newEmailUpdatenotification" }));
                setChangeEmail({
                    confirmNewEmail: "",
                    newEmail: "",
                    password2: ""
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

        if (!changeEmail["password2"]) {
            formIsValid = false;
            error["password2"] = intl.formatMessage({ id: "passwordreq" })
        }

        if (changeEmail["confirmNewEmail"] !== changeEmail["newEmail"]) {
            formIsValid = false;
            error["confirmNewEmail"] = intl.formatMessage({ id: "confirmnewemailtmatched" })
        }

        setError({ errors: error });
        return formIsValid;
    }
    //change email ends here----------------------------------------->

    const openMyDetails = () => {
        getData();
        setMyDetailsModel(!myDetailsModel);
    }

    const openBussinessModel = () => {
        getData();
        setMyBussinessModel(!myBussinessModel);
    }

    const openBankDetailsModal = () => {
        getData();
        setOpenBankModal(!openBankModal)
    }

    const openAddressModal = () => {
        getData();
        setMyAddressModal(!myAddressModal);
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
    async function onFileChange(event) {
        const formData = new FormData();
        formData.append(
            "vendorprofile",
            event.target.files[0],
            event.target.files[0].name
        );

        const file = event.target.files[0];
        const base64 = await convertToBase64(file);
        setSelectedFile(base64);
        let payload = {
            "vendorId": props?.token?.vendor_id,
            "logoImagePath": base64
        }
        let result: any = await editBusinessDetails(payload);
        if (result && result.data && !result.data.message) {
            getData();
            notification("success", "", intl.formatMessage({ id: "customerdetailsupdated" }));
            setSelectedFile(null);
        } else {
            notification("error", "", intl.formatMessage({ id: "errorNewEmailUpdate" }));
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };


    const handleForgetPopup = (e) => {
        e.preventDefault();
        setForgotPopup(true);
    }
    const hideModall = () => setForgotPopup(false);

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2><IntlMessages id="business.Details" /></h2>
                            <p><IntlMessages id="vendor.feelFreeToEdit" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-3">
                                    <div className='companylogo'> <img className="rounded-circle" src={businessDetailsForm['logoImagePath'] ? companylogo + '' + businessDetailsForm['logoImagePath'] + `?${Math.random()}` : user} alt={businessDetailsForm['businessCompanyName']} width="100%" height="100%" />
                                        <div className='onhoveredit'> <input type="file" onChange={onFileChange} /></div>
                                        <div className='onhoveredit-2'><IntlMessages id="myaccount.edit" /></div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="business.companyname" /></label>
                                        <div className="field-name">{businessDetailsForm['businessCompanyName']}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="business.Website" /></label>
                                        <div className="field-name"><Link to={{ pathname: `${businessDetailsForm['businessWebsite']}` }} target="_blank" >{businessDetailsForm['businessWebsite']}</Link></div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="business.IbamNo" /></label>
                                        <div className="field-name">{businessDetailsForm['businessIbamNo']} </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="business.Facebook" /></label>
                                        <div className="field-name"><Link to={{ pathname: `${businessDetailsForm['businessFacebook']}` }} target="_blank" >{businessDetailsForm['businessFacebook']}</Link></div>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="tax" /></label>
                                        <div className="field-name">{businessDetailsForm['businessTax']}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="businessInstagram" /></label>
                                        <div className="field-name"><Link to={{ pathname: `${businessDetailsForm['businessInstagram']}` }} target="_blank" >{businessDetailsForm['businessInstagram']}</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 mt-4">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary edit" onClick={openBussinessModel}>
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
                            <h2><IntlMessages id="vendor.myDetails" /></h2>
                            <p><IntlMessages id="vendor.feelFreeToEdit" /></p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-4">
                            <div className="field_details mb-3">
                                <label className="form-label"><IntlMessages id="vendor.fullname" /></label>
                                <div className="field-name">{vendorForm.vendorName}</div>
                            </div>
                            <div className="field_details">
                                <label className="form-label"><IntlMessages id="vendor.location" /></label>
                                <div className="field-name">{vendorForm.location}</div>
                            </div>
                        </div>
                        <div className="col-sm-4">

                            <div className="field_details mb-3">
                                <label className="form-label"><IntlMessages id="myaccount.gender" /></label>
                                <div className="field-name">{vendorForm.gender ? capitalize(vendorForm.gender) : ""} </div>
                            </div>
                            <div className="field_details">
                                <label className="form-label"><IntlMessages id="myaccount.phoneNo" /></label>
                                <div className="field-name">{vendorForm.vendorTelephone}</div>
                            </div>

                        </div>
                        <div className="col-sm-4">
                            <div className="field_details mb-3">
                                <label className="form-label"><IntlMessages id="myaccount.dob" /></label>
                                <div className="field-name">{vendorForm.vendorDateofBirth} </div>
                            </div>
                            <div className="field_details">
                                <label className="form-label"><IntlMessages id="vendor.contactMethod" /></label>
                                <div className="field-name">{vendorForm.contactMethod ? capitalize(vendorForm.contactMethod) : ""}</div>
                            </div>
                        </div>


                        <div className="col-sm-3 mt-4">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary edit" onClick={openMyDetails}>
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
                            <h2><IntlMessages id="myaccount.myAddresses" /></h2>
                            <p><IntlMessages id="myaccount.addOrChange" /></p>
                        </div>
                    </div>
                    <div className="add_changeaddress">
                        {(vendorAddForm && vendorAddForm.zip === '') && (
                            <div className="addnew_address" onClick={openAddressModal}>
                                <div className="addressnew_addressblue">
                                    <span> <IntlMessages id="myaccount.addNewAddress" /> </span>
                                    <i className="fas fa-plus"></i>
                                </div>
                            </div>
                        )}
                        {(vendorAddForm) && (<>
                            <div className="addressnew_addressbodr" >
                                <h3><IntlMessages id="myaccount.address" /></h3>
                                <ul>
                                    <li>{businessDetailsForm['businessCompanyName']}</li>
                                    <li>{vendorAddForm?.street}</li>
                                    <li>{vendorAddForm?.zip}</li>
                                    <li>{vendorAddForm?.city}</li>
                                    <li>{vendorAddForm && vendorAddForm.region_id ? getRegionName(vendorAddForm.countryId, vendorAddForm.region_id) : ""}</li>
                                    <li>{vendorAddForm.countryId ? getCountryName(vendorAddForm.countryId) : ""}</li>
                                </ul>
                                <div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div>
                                <div className="address-action">
                                    <Link to="#" className="edit_btn" onClick={() => openAddressModal()}>
                                        <IntlMessages id="myaccount.edit" />
                                    </Link>
                                </div>
                            </div>
                        </>)}

                    </div>
                </div>
            </section>

            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2><IntlMessages id="vendor.payouts" /></h2>
                            <p><IntlMessages id="myaccount.addOrChangePayments" /> </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <h5><IntlMessages id="myaccount.Bank" /></h5>
                        </div>
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-4">
                                        <label className="form-label"><IntlMessages id="business.companyname" /></label>
                                        <div className="field-name">{businessDetailsForm['businessCompanyName']}</div>
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
                                <button type="button" className="btn btn-secondary edit" onClick={openBankDetailsModal}>
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
                            <h2><IntlMessages id="myaccount.changePasswordEmail" /></h2>
                            <p><IntlMessages id="myaccount.feelFreeToUpdate" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <label className="form-label heading_lbl"><IntlMessages id="login.password" />*</label>
                            <div className="password_edit">*******</div>
                        </div>
                        <div className="col-sm-6"></div>
                    </div>
                    <div className="row">
                        <div className="change-paswd-sec col-sm-6">
                            <div className="width-100">
                                <label className="form-label heading_lbl"><IntlMessages id="myaccount.changePassword" /></label>
                            </div>
                            <div className="width-100 mb-3 form-field">
                                <label className="form-label"><IntlMessages id="login.password" />*</label>
                                <input type={passMask.password ? 'password' : 'text'} className="form-control" placeholder=""
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
                                <input type={passMask.newPassword ? 'password' : 'text'} className="form-control" placeholder="" id="newPassword"
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
                                <input type={passMask.confirmNewPassword ? 'password' : 'text'} className="form-control" placeholder=""
                                    id="confirmNewPassword"
                                    value={changePass.confirmNewPassword}
                                    onChange={handlePassword} />
                                <span className="hidden-pass" onClick={() => togglePasswordVisiblity('confirmNewPassword')}>
                                    {passMask.confirmNewPassword ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                </span>
                                <span className="error">{errors.errors["confirmNewPassword"]}</span>
                            </div>
                            <div className="width-100 mb-3 form-field forgot_paswd">
                                <div className="Frgt_paswd">
                                    <Link to='#' onClick={(e) => { handleForgetPopup(e); }} className="forgt-pasdw"><IntlMessages id="myaccount.forgotPassword" />?</Link>
                                </div>
                                <div className="Frgt_paswd">
                                    <div className="confirm-btn">
                                        <button type="button" className="btn btn-secondary" onClick={handleChangePass}>
                                            <IntlMessages id="myaccount.confirm" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6"></div>
                    </div>

                    <div className="row mb-3">

                        <div className="col-sm-6">
                            <label className="form-label heading_lbl"><IntlMessages id="login.email" /></label>
                            <div className="password_edit">{props.token.email}</div>
                        </div>
                        <div className="col-sm-6"></div>
                    </div>

                    <div className="row">
                        <div className="newemail-sec col-sm-6">
                            <div className="width-100">
                                <label className="heading_lbl"><IntlMessages id="myaccount.newEmail" /></label>
                            </div>
                            <div className="width-100 mb-3">
                                <label className="form-label"><IntlMessages id="myaccount.newEmailAddress" /></label>
                                <input type="email" className="form-control" placeholder="" id="newEmail"
                                    value={changeEmail.newEmail}
                                    onChange={handleEmail} />
                                <span className="error">{errors.errors["newEmail"]}</span>
                            </div>
                            <div className="width-100 mb-3">
                                <label className="form-label"><IntlMessages id="myaccount.confirmNewEmailAddress" /><span
                                    className="maindatory"></span></label>
                                <input type="email" className="form-control" placeholder="" id="confirmNewEmail"
                                    value={changeEmail.confirmNewEmail}
                                    onChange={handleEmail} />
                                <span className="error">{errors.errors["confirmNewEmail"]}</span>
                            </div>
                            <div className="width-100 mb-3 form-field">
                                <label className="form-label"><IntlMessages id="login.password" />*<span
                                    className="maindatory"></span></label>
                                <input type={passMask.emailPass ? 'password' : 'text'} className="form-control" placeholder=""
                                    id="password2"
                                    value={changeEmail.password2}
                                    onChange={handleEmail} />
                                <span className="hidden-pass" onClick={() => togglePasswordVisiblity('emailPass')}>
                                    {passMask.emailPass ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                </span>
                                <span className="error">{errors.errors["password2"]}</span>
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
                        <div className="col-sm-6"></div>
                    </div>

                </div>

            </section>

            <HtmlContent identifier="vendor_block" />

            <section className="my_profile_sect check-als mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2 className="text-center mb-4"><IntlMessages id="myaccount.checkAlso" /></h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-1">
                            <div className="d-grid ">
                                <Link to="/vendor/returns-complaints" className="btn btn-secondary">
                                    <IntlMessages id="vendor.returnComplaints" />
                                    <i className="fas fa-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-1">
                            <div className="d-grid ">
                                <Link to="/vendor/sales-orders" className="btn btn-secondary">
                                    <IntlMessages id="vendor.salesOrders" />
                                    <i className="fas fa-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4 mb-1">
                            <div className="d-grid ">
                                <Link to="/vendor/product-listing" className="btn btn-secondary">
                                    <IntlMessages id="vendor.productListing" />
                                    <i className="fas fa-chevron-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* customer details modal */}
            <Modal show={myDetailsModel} >
                <div className="CLE_pf_details">
                    <Modal.Header>
                        <h1><IntlMessages id="myaccount.myDetails" /></h1>
                        <Link to="#" onClick={openMyDetails} className="cross_icn"> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <Modal.Body className="arabic-rtl-direction">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="vendor.fullname" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Ann"
                                id="vendorName"
                                value={vendorForm.vendorName}
                                onChange={handleChange} />
                            <span className="error">{errorsPersonal.errors["vendorName"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="vendor.location" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Great Britain" id="location"
                                value={vendorForm.location}
                                onChange={handleChange} />
                            <span className="error">{errorsPersonal.errors["location"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.gender" /></label>
                            <select className="form-select" defaultValue={vendorForm.gender} aria-label="Default select example" onChange={handleChange} id="gender">
                                <option value="">{intl.formatMessage({ id: 'select' })}</option>
                                {DROPDOWN.genderVendor.map(opt => {
                                    return (<option value={opt.id} key={opt.id}>{intl.formatMessage({ id: opt.name })}</option>);
                                })}
                            </select>
                            <span className="error">{errorsPersonal.errors["gender"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.phoneNo" /><span className="maindatory">*</span></label>
                            <input type="number" className="form-control" placeholder="+48 123 456 789" id="vendorTelephone"
                                value={vendorForm.vendorTelephone}
                                onChange={handleChange}
                            />
                            <span className="error">{errorsPersonal.errors["vendorTelephone"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.dob" /></label>
                            <div className="dobfeild">
                                <select className="form-select me-3" value={dob.day} aria-label="Default select example" onChange={dobHandler} id="day">
                                    <option value="">{intl.formatMessage({ id: "select" })}</option>
                                    {DROPDOWN.dates.map(opt => {
                                        return (<option value={opt} key={opt}>{opt}</option>);
                                    })}

                                </select>
                                <select className="form-select me-3" value={dob.month} aria-label="Default select example" onChange={dobHandler} id="month">
                                    <option value="">{intl.formatMessage({ id: "select" })}</option>
                                    {DROPDOWN.months.map(opt => {
                                        return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                    })}
                                </select>
                                <select className="form-select" value={dob.year} aria-label="Default select example" onChange={dobHandler} id="year">
                                    <option value="">{intl.formatMessage({ id: "select" })}</option>
                                    {DROPDOWN.years.map(opt => {
                                        return (<option value={opt} key={opt}>{opt}</option>);
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="vendor.contactMethod" /><span className="maindatory">*</span></label>
                            <select value={vendorForm.contactMethod} onChange={handleChange} id="contactMethod" className="form-select" aria-label="Default select example">
                                <option value="email">{intl.formatMessage({ id: 'profile.email' })}</option>
                                <option value="phone">{intl.formatMessage({ id: 'Phone' })}</option>
                            </select>
                            <span className="error">{errors.errors["contactMethod"]}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="width-100 mb-3 form-field">
                        <div className="Frgt_paswd">
                            <div className="confirm-btn">
                                <button type="button" className="btn btn-secondary" style={{ "display": !saveCustDetailsLoader ? "inline-block" : "none" }} onClick={saveCustDetails}><IntlMessages id="myaccount.confirm" /></button>

                                <button className="spinner" style={{ "display": saveCustDetailsLoader ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</button>
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
                            <label className="form-label"><IntlMessages id="business.companyname" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.companyname" })}
                                id="businessCompanyName"
                                value={businessDetailsForm.businessCompanyName}
                                onChange={handlebussinessChange} />
                            <span className="error">{errorsBussiness.errors["businessCompanyName"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.IbamNo" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.IbamNo" })}
                                id="businessIbamNo"
                                value={businessDetailsForm.businessIbamNo}
                                onChange={handlebussinessChange} />
                            <span className="error">{errorsBussiness.errors["businessIbamNo"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="tax" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "tax" })} id="businessTax"
                                value={businessDetailsForm.businessTax}
                                onChange={handlebussinessChange} />
                            <span className="error">{errorsBussiness.errors["businessTax"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.Website" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.Website" })} id="businessWebsite"
                                value={businessDetailsForm.businessWebsite}
                                onChange={handlebussinessChange} />
                            <span className="error">{errorsBussiness.errors["businessWebsite"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.Facebook" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.Facebook" })} id="businessFacebook"
                                value={businessDetailsForm.businessFacebook}
                                onChange={handlebussinessChange} />
                            <span className="error">{errorsBussiness.errors["businessFacebook"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="businessInstagram" /></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "businessInstagram" })} id="businessInstagram"
                                value={businessDetailsForm.businessInstagram}
                                onChange={handlebussinessChange} />
                            <span className="error">{errorsBussiness.errors["businessInstagram"]}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="width-100 mb-3 form-field">
                        <div className="Frgt_paswd">
                            <div className="confirm-btn">
                                <button type="button" className="btn btn-secondary" style={{ "display": !saveBusinessDetailsLoader ? "inline-block" : "none" }} onClick={saveBussinessDetails}><IntlMessages id="gift.confirm" /></button>

                                <button className="spinner" style={{ "display": saveBusinessDetailsLoader ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</button>
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
                            <label className="form-label"><IntlMessages id="business.companyname" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.companyname" })}
                                id="businessCompanyName"
                                readOnly
                                value={businessDetailsForm.businessCompanyName}
                                onChange={handleAddChange} />

                            <span className="error">{errors.errors["businessCompanyName"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.address" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="street"
                                placeholder={intl.formatMessage({ id: "myaccount.address" })}
                                value={vendorAddForm.street}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["street"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.city" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="city"
                                placeholder={intl.formatMessage({ id: "myaccount.city" })}
                                value={vendorAddForm.city}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["city"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.postCode" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="zip"
                                placeholder={intl.formatMessage({ id: "myaccount.postCode" })}
                                value={vendorAddForm.zip}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["zip"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>

                            <select value={vendorAddForm.countryId} onChange={handleCountryChangeAdd} id="countryId" className="form-select">
                                {countries && countries.map(opt => {
                                    return (<option key={opt.id} value={opt.id} >{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["countryId"]}</span>
                        </div>
                        {regions.length > 0 &&
                            <div className="width-100 mb-3 form-field">
                                <label className="form-label">
                                    <IntlMessages id="myaccount.region" /></label>
                                <select value={vendorAddForm.region_id} onChange={handleAddChange} id="region_id" className="form-select">
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
                                        <button type="button" className="btn btn-secondary" onClick={saveCustAddress} style={{ "display": !isAddShow ? "inline-block" : "none" }}>
                                            <IntlMessages id="myaccount.confirm" />
                                        </button>
                                        <div className="spinner" style={{ "display": isAddShow ? "inline-block" : "none" }}>
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
                                id="companyName"
                                readOnly
                                value={businessDetailsForm['businessCompanyName']}
                                onChange={handleBankChange} />
                            <span className="error">{errorsBank.errors["companyName"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.bankName" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder={intl.formatMessage({ id: "business.bankName" })}
                                id="bankName"
                                value={bankDetails.bankName}
                                onChange={handleBankChange} />
                            <span className="error">{errorsBank.errors["bankName"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="business.accountNumber" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="**** **** **** ****"
                                id="accountNumber"
                                pattern="[+-]?\d+(?:[.,]\d+)?"
                                value={bankDetails.accountNumber}
                                onChange={handleBankChange} />
                            <span className="error">{errorsBank.errors["accountNumber"]}</span>
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
            {/*  forgot passord popup */}
            <Modal show={forgotPopup} className="forgot-modal" onHide={hideModall}>
                <Modal.Body className="arabic-rtl-direction">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModall} aria-label="Close"></button>
                    <ForgottenPassword />
                </Modal.Body>
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
        languages: languages,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps
)(BusinessProfile);