import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";

import moment from 'moment';
import { language } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import HtmlContent from '../../partials/htmlContent';
import { sessionService } from 'redux-react-session';
import { useIntl } from 'react-intl';
import { getVendorDetails, changePasswordVendor } from '../../../redux/pages/vendorLogin';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import user from '../../../image/user.png';
import { capitalize, getCountryName } from '../../../components/utility/allutils';
import ForgottenPassword from './bussinessForgotpassword';
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const companylogo = `${baseUrl}pub/media/`;
function BusinessProfile(props) {
    const intl = useIntl();
    const [forgotPopup, setForgotPopup] = useState(false);
    const [vendorId, setVendorId] = useState(props?.token?.vendor_id)
 
    const [billingAddress, setBillingAddress] = useState('');
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
 

    const [passMask, setPassMask] = useState({
        password: true,
        newPassword: true,
        confirmNewPassword: true,
        emailPass: true
    })

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

    const [errors, setError] = useState({
        errors: {}
    });
  
    //--------------------------------------------------------------
    useEffect(() => {
        getVendor();
        getData();

        return () => {
          
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

        setVendorForm(result && result['data'] && result['data'].length > 0 ? result['data'][0]['vendorPersonalDetails'] : [])
        setBankDetails(result && result['data'] && result['data'].length > 0 ? result['data'][0]['bankDetails'] : [])
        setbussinessDetailsForm(result && result['data'] && result['data'].length > 0 ? result['data'][0]['businessDetails'] : [])
        setVendorAddForm(result && result['data'] && result['data'].length > 0 ? result['data'][0]['shippingAddress'] : [])
        setBillingAddress(result && result['data'] && result['data'].length > 0 ? result['data'][0]['billingAddress'] : [])

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


    const togglePasswordVisiblity = (id) => {
        const val = !passMask[id];
        setPassMask(pre => ({
            ...pre,
            [id]: val
        }));
    }




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
                        {(vendorAddForm) && (<>
                            <div className="addressnew_addressbodr" >
                                <h3><IntlMessages id="myaccount.address" /></h3>
                                <ul>
                                    <li>{businessDetailsForm['businessCompanyName']}</li>
                                    <li>{vendorAddForm?.street}</li>
                                    <li>{vendorAddForm?.zip}</li>
                                    <li>{vendorAddForm?.city}</li>
                                    <li>{vendorAddForm.countryId ? getCountryName(vendorAddForm.countryId) : ""}</li>
                                </ul>
                                <div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                {billingAddress?.['billing_use_shipping'] === '1' && (
                                    <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div>
                                )}
                            </div>
                        </>)}
                        {console.log(billingAddress)}
                        {(billingAddress?.['billing_use_shipping'] !== '1' || billingAddress?.['billing_zip'] !== null) && (
                            <>

                                <div className="addressnew_addressbodr" >
                                    <h3><IntlMessages id="myaccount.address" /></h3>
                                    <ul>
                                        <li>{businessDetailsForm['businessCompanyName']}</li>
                                        <li>{billingAddress?.['billing_street']}</li>
                                        <li>{billingAddress?.['billing_zip']}</li>
                                        <li>{billingAddress?.['billing_city']}</li>
                                        <li>{billingAddress?.['billing_country_id'] ? getCountryName(billingAddress?.['billing_country_id']) : ""}</li>
                                    </ul>
                                    <div className="default_dlivy mt-3"></div>
                                    <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div>
                                    <div className="address-action">
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