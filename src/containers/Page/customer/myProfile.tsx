import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import {
    getCustomerDetails, saveCustomerDetails, getCountriesList, changePassword,
    updateCustEmail, deleteAddress, getPreference, getRegionsByCountryID, savePreference
} from '../../../redux/pages/customers';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { language } from '../../../settings';
import MyPreferences from './myProfile/myPreferences';
import { DROPDOWN } from '../../../config/constants';
import { COUNTRIES } from '../../../config/counties';
import moment from 'moment';
import { capitalize } from '../../../components/utility/allutils';
import { useIntl } from 'react-intl';
import callIcon from '../../../image/call-icon.png';
import deleteIcon from '../../../image/delete-icon.png';
import timerIcon from '../../../image/timer_icon.png';
import cartAction from "../../../redux/cart/productAction";
import ForgottenPassword from '../../Page/forgotPassword';
const { closePrefPopup } = cartAction;
function MyProfile(props) {
    const intl = useIntl();
    const userGroup = props.token.token;
    const [isShow, setIsShow] = useState(false);
    const [showCustomdate, setShowCustomdate] = useState(false);
    const [saveCustDetailsLoader, setSaveCustDetailsLoader] = useState(false);
    const [isShown, setIsShown] = useState(-1);
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
    const [custId, setCustid] = useState(props.token.cust_id);
    const [attributes, setAttributes]: any = useState({});
    const [customerPrefer, setCustomerPrefer]: any = useState({
        interestedIn: '',
        shoes_size: [],
        clothing_size: [],
        favCat: [],
        favDesigner: [],
        gifting_preferencees: []
    });
    const [loaderPassChange, setLoaderPassChange] = useState(false);
    const [loaderEmailChange, setloaderEmailChange] = useState(false);
    const [myDetailsModel, setMyDetailsModel] = useState(false);
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
    const [ishowGifting, setIshowGifting] = useState(false);

    const [forgotPopup, setForgotPopup] = useState(false);
    const [countries, setCountries] = useState([]); // for countries dropdown
    const [regions, setRegions] = useState([]); // for regions dropdown
    const [telephone, setTelephone] = useState("");
    const [dob, setDob] = useState({
        day: '',
        month: '',
        year: ''
    });
    const [custForm, setCustForm] = useState({
        id: props.token.cust_id,
        email: "",
        firstname: "",
        lastname: "",
        gender: 0,
        dob: "",
        country: "",
        phone: "",
        website_id: 1,
        addresses: [],
        custom_attributes: []
    });

    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: props.token.cust_id,
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
        password2: "",
    });

    const [giftingPrefer, setGiftingPrefer] = useState({
        name: "",
        surName: "",
        occasion: "",
        annualReminder: "",
        dobDate: "",
        dobMonth: "",
        dobYear: "",
        dodDate: "",
        dodMonth: "",
        dodYear: "",
        dateofevent: "",
        DateOfDelivery: "",
        gender: "",
        categoryPreference: "",
        notifyMe: ""
    });

    const [errors, setError] = useState({
        errors: {}
    });

    const [giftErrors, setGiftErrors] = useState({
        errors: {}
    });

    useEffect(() => {
        getData();
        getCountries();
        return () => {
            setIsShow(false)
        }
    }, [props.prefrences]);

    const handleForgetPopup = (e) => {
        e.preventDefault();
        setForgotPopup(true);
    }
    const hideModall = () => setForgotPopup(false);

    async function getData() {
        let lang = props.languages ? props.languages : language;
        // to get cutomer preferences
        let result: any = await getCustomerDetails();
        // const today = moment();
        // console.log(result.data);
        const d = result.data.dob ? result.data.dob.split("-") : moment().format("YYYY-MM-DD").split("-");
        dob.day = d[2];
        dob.month = d[1];
        dob.year = d[0];
        setDob(dob);
        let custom_attributes = result.data.custom_attributes;

        let clothing_size = [], shoes_size = [], mostly_intersted_in = 0, favourite_categories = [], favourite_designers = [];
        let mostly_intersted_inArray = [], shoes_size_inArray = [], clothing_size_inArray = [], categories_array = [], catToShow = [], designer_array = [], gifting_preferencees = [], phone = '', country = '';
        //console.log(custom_attributes)
        // match keys and extract values//
        if (custom_attributes && custom_attributes.length > 0) {
            custom_attributes.map((attributes) => {
                if (attributes.attribute_code === "clothing_size") {
                    let cloths = attributes.value
                    clothing_size = cloths.split(",");
                }
                if (attributes.attribute_code === "shoes_size") {
                    let shoes = attributes.value
                    shoes_size = shoes.split(",");
                }
                if (attributes.attribute_code === "mostly_intersted_in") {
                    mostly_intersted_in = attributes.value;
                }
                if (attributes.attribute_code === "favourite_categories") {
                    let favs = attributes.value
                    favourite_categories = favs.split(",");
                    //console.log(favourite_categories)
                }
                if (attributes.attribute_code === "favourite_designers") {
                    let favDesigns = attributes.value
                    favourite_designers = favDesigns.split(",");
                }
                if (attributes.attribute_code === "gifting_preference") {
                    let gifting = attributes.value;
                    gifting_preferencees = JSON.parse(gifting);
                }
                if (attributes.attribute_code === "mp_sms_telephone") {
                    let phoneNo = attributes.value;
                    // console.log(phoneNo)
                    phone = phoneNo
                }
                if (attributes.attribute_code === "country") {
                    let countryId = attributes.value;
                    // console.log(countryId)
                    country = countryId;
                }
            })
        }

        // console.log(custForm)
        // to get all the preferences list
        let preference: any = await getPreference(lang);
        setAttributes(preference);
        mostly_intersted_inArray = preference.data[0].preference.mostly_intersted;
        shoes_size_inArray = preference.data[0].preference.shoes_size;
        clothing_size_inArray = preference.data[0].preference.clothing_size;
        categories_array = preference.data[0].preference.categories;
        designer_array = preference.data[0].preference.designers;

        let intersted_in = mostly_intersted_inArray.filter((eq) => {
            return eq.id === mostly_intersted_in;
        });
        // console.log(mostly_intersted_inArray)
        // console.log(categories_array);
        let shoes_sizeData = shoes_size_inArray.filter(function (o1) {
            return shoes_size.some(function (o2) {
                return o1.value === o2; // return the ones with equal id
            });
        });

        let clothing_sizeData = clothing_size_inArray.filter(function (o1) {
            return clothing_size.some(function (o2) {
                return o1.value === o2; // return the ones with equal id
            });
        });
        // console.log(intersted_in);
        let index = mostly_intersted_inArray.findIndex(x => x.name === intersted_in[0].name);
        catToShow = categories_array[index];


        // console.log(catToShow)
        var favCategoryArray = [];
        if (catToShow && catToShow.length > 0) {
            favCategoryArray = catToShow.filter(function (o1) {
                return favourite_categories.some(function (o2) {
                    //  console.log(o1.id, o2)
                    return o1.id === o2; // return the ones with equal id
                });
            });
        }


        var favDesignerArray = designer_array[0].filter(function (o1) {
            return favourite_designers.some(function (o2) {
                return o1.id === o2; // return the ones with equal id
            });
        });
        //    console.log(preference.data[0].preference.mostly_intersted)
        setCustomerPrefer(prevState => ({
            ...prevState,
            interestedIn: intersted_in[0] ? intersted_in[0].name : "",
            shoes_size: shoes_sizeData,
            clothing_size: clothing_sizeData,
            favCat: favCategoryArray,
            favDesigner: favDesignerArray,
            gifting_preferencees: gifting_preferencees,
        }));


        if (result) {
            setCustForm(result.data);
            setCustForm(prevState => ({
                ...prevState,
                country: country,
                phone: phone
            }))
            //  getAttributes(result.data);
        }
    }
    const getAttributes = async () => {
        let lang = props.languages ? props.languages : language;
        let result: any = await getPreference(lang);
        setAttributes(result);
    }

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

    const handleGiftingChange = (e) => {
        const { id, value } = e.target;
        if (id === 'DateOfDelivery' && value === "2") {
            setShowCustomdate(true);
        } else if (id === 'DateOfDelivery' && value === "1") {
            setShowCustomdate(false);
        }
        setGiftingPrefer(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const saveCustDetails = async (e) => {
        setSaveCustDetailsLoader(true)
        e.preventDefault();
        // console.log(custForm)
        custForm.email = props.token.token_email;
        if (dob.day !== '' && dob.month !== '' && dob.year !== '') {
            custForm.dob = `${dob.month}/${dob.day}/${dob.year}`;
        }
        // setCustomerPrefer(prevState => ({
        //     ...prevState,
        //     country: custForm.country,
        //     mp_sms_telephone: custForm.phone
        // }));
        let result: any = await saveCustomerDetails({ customer: custForm });
        // console.log(result.data)
        if (result && result.data && !result.data.message) {
            setMyDetailsModel(false);
            setSaveCustDetailsLoader(false)
            getData()
            notification("success", "", intl.formatMessage({ id: "customerUpdate" }));
        } else {
            getData()
            setMyDetailsModel(false);
            setSaveCustDetailsLoader(false)
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }
    }

    // for customer address popup window starts here
    const saveCustAddress = async (e) => {
        if (validateAddress()) {
            setIsShow(true);
            let obj: any = { ...custAddForm };
            if (obj.region_id === '') delete obj.region_id;
            obj.street = [obj.street];
            if (obj.id === 0) {
                custForm.addresses.push(obj);
            } else {
                custForm.addresses[addIndex] = obj;
            }
            //console.log(custAddForm);
            let result: any = await saveCustomerDetails({ customer: custForm });
            if (result) {
                openAddressModal();
                setCustAddForm({
                    id: 0,
                    customer_id: props.token.cust_id,
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

    const validateAddress = () => {
        let error = {};
        let formIsValid = true;

        if (!custAddForm.telephone) {
            formIsValid = false;
            error['telephone'] = intl.formatMessage({ id: "phonereq" })
        }
        if (!custAddForm.postcode) {
            formIsValid = false;
            error["postcode"] = intl.formatMessage({ id: "pinreq" })
        }
        if (!custAddForm.city) {
            formIsValid = false;
            error["city"] = intl.formatMessage({ id: "cityreq" })
        }

        if (!custAddForm.country_id) {
            formIsValid = false;
            error['country_id'] = intl.formatMessage({ id: "countryreq" })
        }
        if (!custAddForm.street) {
            formIsValid = false;
            error["street"] = intl.formatMessage({ id: "addressreq" })
        }
        if (!custAddForm.firstname) {
            formIsValid = false;
            error["firstname"] = intl.formatMessage({ id: "firstnamerequired" })
        }
        if (!custAddForm.lastname) {
            formIsValid = false;
            error["lastname"] = intl.formatMessage({ id: "lastnamerequired" })
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
        getData();
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
            getData();
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
            setLoaderPassChange(true);
            let result: any = await changePassword({ currentPassword: changePass.password, newPassword: changePass.newPassword });
            if (result.data) {
                // console.log(result.data)
                notification("success", "", intl.formatMessage({ id: "passwordUpdate" }));
                setChangePass({
                    confirmNewPassword: "",
                    newPassword: "",
                    password: ""
                });
                setLoaderPassChange(false);
            } else {

                setLoaderPassChange(false);
                notification("error", "", intl.formatMessage({ id: "passwordInvalid" }));
            }
        }
    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#^])([A-Za-z\d$@$!%*?&#^]{8,})$/.test(changePass["newPassword"]))) {
            formIsValid = false;
            error["newPassword"] = intl.formatMessage({ id: "passwordvalidation" });
        }
        if (!changePass["password"]) {
            formIsValid = false;
            error["password"] = intl.formatMessage({ id: "passwordreq" })
        }
        if (!changePass["newPassword"]) {
            formIsValid = false;
            error["newPassword"] = intl.formatMessage({ id: 'newpasswordreq' })
        }
        if (!changePass["confirmNewPassword"]) {
            formIsValid = false;
            error["confirmNewPassword"] = intl.formatMessage({ id: 'confirmnewpasswordreq' });
        }
        if (changePass["confirmNewPassword"] !== changePass["newPassword"]) {
            formIsValid = false;
            error["confirmNewPassword"] = intl.formatMessage({ id: 'confirmnewnotmatched' });
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
            setloaderEmailChange(true)
            const req = {
                customerId: props.token.cust_id,
                newEmail: changeEmail.newEmail,
                password: changeEmail.password2
            }

            let result: any = await updateCustEmail(req);
            if (result.data) {
                notification("success", "", intl.formatMessage({ id: "newEmailUpdate" }));
                setChangeEmail({
                    confirmNewEmail: "",
                    newEmail: "",
                    password2: ""
                })
                setloaderEmailChange(false)
            } else {
                setloaderEmailChange(false)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
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
            error["confirmNewEmail"] = intl.formatMessage({ id: "confirmneemailreq" });
        }

        if (!changeEmail["password2"]) {
            formIsValid = false;
            error["password2"] = intl.formatMessage({ id: "passwordreq" });
        }

        if (changeEmail["confirmNewEmail"] !== changeEmail["newEmail"]) {
            formIsValid = false;
            error["confirmNewEmail"] = intl.formatMessage({ id: "confirmnewemailtmatched" });
        }

        setError({ errors: error });
        return formIsValid;
    }
    //change email ends here----------------------------------------->

    const saveGiftingPrefer = async () => {

        if (handleValidationGifting()) {
            setIshowGifting(true);
            // console.log(giftingPrefer)
            let dateofevent = giftingPrefer.dobDate + '/' + giftingPrefer.dobMonth + '/' + giftingPrefer.dobYear;
            let customDod = giftingPrefer.dodDate + '/' + giftingPrefer.dodMonth + '/' + giftingPrefer.dodYear;
            let dateOfdelivery = giftingPrefer.DateOfDelivery === "1" ? dateofevent : customDod;

            giftingPrefer.dateofevent = dateofevent;
            giftingPrefer.DateOfDelivery = dateOfdelivery;

            let newObj = { ...customerPrefer }
            newObj.gifting_preferencees.push(giftingPrefer)
            let data = {
                customerId: props.token.cust_id,
                gifting_preference: newObj.gifting_preferencees
            }
            // console.log(data)
            const res = await savePreference(data);
            if (res) {
                setGiftingPrefer({
                    name: "",
                    surName: "",
                    occasion: "",
                    annualReminder: "",
                    dobDate: "",
                    dobMonth: "",
                    dobYear: "",
                    dodDate: "",
                    dodMonth: "",
                    dodYear: "",
                    dateofevent: "",
                    DateOfDelivery: "",
                    gender: "",
                    categoryPreference: "",
                    notifyMe: ""
                });
                getData();
                setGiftingModal(false);
                setIshowGifting(false);
                notification("success", "", intl.formatMessage({ id: "giftingsuccess" }));
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
        }
    }

    const handleValidationGifting = () => {
        let error = {};
        let formIsValid = true;
        if (!giftingPrefer['name']) {
            formIsValid = false;
            error["name"] = intl.formatMessage({ id: "gifting.name" });
        }
        if (!giftingPrefer['surName']) {
            formIsValid = false;
            error["surName"] = intl.formatMessage({ id: "surname" });
        }
        if (!giftingPrefer['occasion']) {
            formIsValid = false;
            error["occasion"] = intl.formatMessage({ id: "gifting.occasion" });
        }
        if (!giftingPrefer['annualReminder']) {
            formIsValid = false;
            error["annualReminder"] = intl.formatMessage({ id: "gifting.annualReminder" });
        }
        if (!giftingPrefer['dobDate']) {
            formIsValid = false;
            error["dobDate"] = intl.formatMessage({ id: "gifting.dobDate" });
        }
        if (!giftingPrefer['dobMonth']) {
            formIsValid = false;
            error["dobMonth"] = intl.formatMessage({ id: "gifting.dobMonth" });
        }

        if (!giftingPrefer['dobYear']) {
            formIsValid = false;
            error["dobYear"] = intl.formatMessage({ id: "gifting.dobYear" });
        }
        if (!giftingPrefer['DateOfDelivery']) {
            formIsValid = false;
            error["DateOfDelivery"] = intl.formatMessage({ id: "gifting.DateOfDelivery" });
        }
        if (!giftingPrefer['gender']) {
            formIsValid = false;
            error["gender"] = intl.formatMessage({ id: "gifting.gender" });
        }
        if (!giftingPrefer['categoryPreference']) {
            formIsValid = false;
            error["categoryPreference"] = intl.formatMessage({ id: "gifting.categoryPreference" });
        }
        if (!giftingPrefer['notifyMe']) {
            formIsValid = false;
            error["notifyMe"] = intl.formatMessage({ id: "gifting.notifyMe" });
        }

        setGiftErrors({ errors: error });
        return formIsValid;
    }
    const openMyDetails = () => {
        setMyDetailsModel(!myDetailsModel);
    }

    const openMyPreferences = () => {
        getAttributes();
        props.closePrefPopup(true);
    }
    const closeMyPreferences = () => {
        props.closePrefPopup(false);
    }

    const openAddressModal = () => {
        setMyAddressModal(!myAddressModal);
    }

    const openGigitingModal = () => {
        setGiftErrors({ errors: {} })
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
    const removeSeleted = async (i) => {
        let newObj = { ...customerPrefer }

        newObj.gifting_preferencees.splice(i)

        let data = {
            customerId: props.token.cust_id,
            gifting_preference: newObj.gifting_preferencees
        }

        // console.log(newObj.gifting_preferencees);

        const res = await savePreference(data);
        if (res) {
            getData();
            setGiftingModal(false);
            notification("success", "", intl.formatMessage({ id: "giftingsuccess" }));
        }
    }

    return (
        <div className={isPriveUser ? 'prive-txt col-sm-9' : 'col-sm-9'}>
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1><IntlMessages id="myaccount.myDetails" /></h1>
                            <p><IntlMessages id="myaccount.feelFreeToEdit" /></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 mb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.name" /></label>
                                        <div className="field-name">{custForm.firstname ? capitalize(custForm.firstname) : ""}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.surName" /></label>
                                        <div className="field-name">{custForm.lastname ? capitalize(custForm.lastname) : ""}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.gender" /></label>
                                        <div className="field-name">
                                            {DROPDOWN.gender.map(el => {
                                                return parseInt(el.id) === custForm.gender ? (<span key={el.id}>{el.name}</span>) : null
                                            })}
                                        </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.phoneNo" /></label>
                                        <div className="field-name">{custForm.phone}</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.dob" /></label>
                                        <div className="field-name">{custForm.dob}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.country" /></label>
                                        <div className="field-name">{custForm.country}</div>
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
                        <div className="col-sm-12 mb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.mostlyInterested" /></label>
                                        <div className="field-name">
                                            {customerPrefer.interestedIn}
                                        </div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.clothingSize" /></label>
                                        <div className="field-name">
                                            {
                                                customerPrefer.clothing_size.map((favs, i) => {
                                                    return (<span key={i}>{favs.label}{i === customerPrefer.clothing_size.length - 1 ? '' : '/'}  </span>)
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.shoeSize" /></label>
                                        <div className="field-name">
                                            {
                                                customerPrefer.shoes_size.map((favs, i) => {
                                                    return (<span key={i}>{favs.label}{i === customerPrefer.shoes_size.length - 1 ? '' : '/'} </span>)
                                                })
                                            }
                                        </div>
                                    </div>
                                    {/* <div className="field_details">
                                        <label className="form-label"><IntlMessages id="myaccount.favoriteDesigners" /></label>
                                        <div className="field-name">
                                            {
                                                customerPrefer.favDesigner.map((favs, i) => {
                                                    return (<span key={i}>{favs.name}, </span>)
                                                })
                                            }
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.favoriteCategories" /></label>
                                        <div className="field-name">
                                            {customerPrefer && customerPrefer.favCat && customerPrefer.favCat.length > 0 && (
                                                customerPrefer.favCat[0].name + ' ' + (customerPrefer.favCat.length - 1 > 0 ? ' /+ ' + (customerPrefer.favCat.length - 1) + ' ' + intl.formatMessage({ id: "more" }) : '')
                                            )}
                                            {/* {customerPrefer.favCat.map((favs, i) => {
                                                return (
                                                    <span key={favs.id} >{favs.name}{i === customerPrefer.favCat.length - 1 ?
                                                        '' : '/'} </span>
                                                )
                                            })
                                            } */}
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
                                <button type="button" className="btn btn-secondary" onClick={() => { openMyPreferences() }}>
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
                        <div className="col-sm-12 mb-3">
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.myBirthday" /></label>
                                        <div className="field-name">{custForm.dob}</div>
                                    </div>
                                    <div className="field_details">
                                        <label className="form-label">&nbsp;</label>
                                        <div className="field-name">&nbsp;</div>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="field_details mb-3">
                                        <label className="form-label"><IntlMessages id="myaccount.listOfBirthdays" /></label>
                                        <div className="field-name">

                                            <ul className='giftingPreflist'>
                                                {/* {customerPrefer.gifting_preferencees.map((opt, i) => {
                                                    return (<li key={i}>{opt.name}</li>);
                                                })} */}
                                                {customerPrefer && customerPrefer.gifting_preferencees && customerPrefer.gifting_preferencees.length > 0 && (
                                                    customerPrefer.gifting_preferencees[0].name + ' ' + (customerPrefer.gifting_preferencees.length - 1 > 0 ? ' /+ ' + (customerPrefer.gifting_preferencees.length - 1) + ' ' + intl.formatMessage({ id: "more" }) : '')
                                                )}
                                            </ul>
                                            {/* {customerPrefer.gifting_preferencees
                                            ['name']}/{customerPrefer.gifting_preferencees['dobDate']} {customerPrefer.gifting_preferencees['dobMonth']}  {customerPrefer.gifting_preferencees['dobYear']}
                                             */}
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
                        <div className={`addnew_address ${isPriveUser ? 'prive-bg' : ''}`} onClick={openAddressModal}>
                            <div className="addressnew_addressblue">
                                <span> <IntlMessages id="myaccount.addNewAddress" /> </span>
                                <i className="fas fa-plus"></i>
                            </div>
                        </div>

                        {custForm && custForm.addresses.map((address, i) => {
                            let countryList: any = COUNTRIES.filter(obj => obj.id === address.country_id);
                            // console.log(address)
                            return (<div className="addressnew_addressbodr" key={i}>
                                <h3><IntlMessages id="myaccount.address" /></h3>
                                <ul>
                                    <li>{address.firstname + ' ' + address.lastname}</li>
                                    <li>{address.street}</li>
                                    <li>{address.postcode}</li>
                                    <li>{address.city}</li>
                                    <li>{countryList[0].full_name_locale}</li>
                                </ul>
                                {i == 0 && <><div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                    <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div></>}
                                <div className="address-action">
                                    <Link to="#" onClick={() => deleteAdd(i)} className="delete_btn"><IntlMessages id="myaccount.delete" /></Link>
                                    <Link to="#" className={`edit_btn ${isPriveUser ? 'prive-txt' : ''}`} onClick={() => editAddress(i)}>
                                        <IntlMessages id="myaccount.edit" />
                                    </Link>
                                </div>
                            </div>);
                        })}


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
                            <label className="form-label heading_lbl"><IntlMessages id="login.password" /><span className="maindatory">&#42;</span></label>
                            <div className="password_edit">********</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="change-paswd-sec">
                                <label className="heading_lbl"><IntlMessages id="myaccount.changePassword" /></label>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="login.password" />*</label>
                                    <input type={passMask.password ? 'password' : 'text'} className="form-control"
                                        id="password"
                                        value={changePass.password}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass" onClick={() => togglePasswordVisiblity('password')}>
                                        {passMask.password ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                    </span>
                                    <span className="error">{errors.errors["password"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.newPassword" /><span
                                        className="maindatory">&#42;</span></label>
                                    <input type={passMask.newPassword ? 'password' : 'text'} className="form-control" id="newPassword"
                                        value={changePass.newPassword}
                                        onChange={handlePassword} />
                                    <span className="hidden-pass" onClick={() => togglePasswordVisiblity('newPassword')}>
                                        {passMask.newPassword ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                                    </span>

                                    <span className="error">{errors.errors["newPassword"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="myaccount.confirmPassword" /><span
                                        className="maindatory">&#42;</span></label>
                                    <input type={passMask.confirmNewPassword ? 'password' : 'text'} className="form-control"
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
                                        <Link to='#' onClick={(e) => { handleForgetPopup(e); }} className="forgt-pasdw"><IntlMessages id="myaccount.forgotPassword" />?</Link>

                                    </div>
                                    <div className="Frgt_paswd">
                                        <div className="confirm-btn">
                                            <button type="button" className="btn btn-secondary" style={{ "display": !loaderPassChange ? "inline-block" : "none" }} onClick={handleChangePass}>
                                                <IntlMessages id="myaccount.confirm" /></button>
                                            <div className="btn btn-secondary" style={{ "display": loaderPassChange ? "inline-block" : "none" }}>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                <IntlMessages id="loading" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
					
					<div className="profile-new-email">
                    <div className="row">
                        <div className="col-sm-6">
                            <label className="form-label heading_lbl"><IntlMessages id="login.email" /></label>
                            <div className="password_edit">{custForm.email}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="newemail-sec">
                                <label className="heading_lbl"><IntlMessages id="myaccount.newEmail" /></label>
                                <div className="width-100 mb-3">
                                    <label className="form-label"><IntlMessages id="myaccount.newEmailAddress" /></label>
                                    <input type="email" className="form-control" id="newEmail"
                                        value={changeEmail.newEmail}
                                        onChange={handleEmail} />
                                    <span className="error">{errors.errors["newEmail"]}</span>
                                </div>
                                <div className="width-100 mb-3">
                                    <label className="form-label"><IntlMessages id="myaccount.confirmNewEmailAddress" /><span
                                        className="maindatory"></span></label>
                                    <input type="email" className="form-control" id="confirmNewEmail"
                                        value={changeEmail.confirmNewEmail}
                                        onChange={handleEmail} />
                                    <span className="error">{errors.errors["confirmNewEmail"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label className="form-label"><IntlMessages id="login.password" /><span
                                        className="maindatory">&#42;</span></label>
                                    <input type={passMask.emailPass ? 'password' : 'text'} className="form-control"
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
                                            <button type="button" className="btn btn-secondary" style={{ "display": !loaderEmailChange ? "inline-block" : "none" }} onClick={handleChangeEmail}>
                                                <IntlMessages id="myaccount.confirm" />
                                            </button>
                                            <div className="btn btn-secondary" style={{ "display": loaderEmailChange ? "inline-block" : "none" }}>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                                <IntlMessages id="loading" />
                                            </div>
                                        </div>
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
                                                <img src={callIcon} className="img-fluid" alt="" /><IntlMessages id="myaccount.contactCustomerCare" />
                                            </button>
                                        </h2>
                                        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body"><IntlMessages id="myaccount.getInTouchWith" /></div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                <img src={deleteIcon} className="img-fluid" alt="callIcon" /> <IntlMessages id="myaccount.wellDeactvate" />
                                            </button>
                                        </h2>
                                        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">
                                                <IntlMessages id="myaccount.onceYouHaveConfirmd" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                <img src={timerIcon} className="img-fluid" alt="" />
                                                <IntlMessages id="myaccount.dontWantToclose" />
                                            </button>
                                        </h2>
                                        <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body"><IntlMessages id="myaccount.ifYouHaveChanges" /></div>
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



            {/* customer details modal */}
            <Modal show={myDetailsModel} >
                <div className="CLE_pf_details">
                    <Modal.Header>
                        <h1><IntlMessages id="myaccount.myDetails" /></h1>
                        <Link to="#" onClick={openMyDetails} className="cross_icn"> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <Modal.Body className="arabic-rtl-direction">
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="register.first_name" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Ann"
                                id="firstname"
                                value={custForm.firstname}
                                onChange={handleChange} />
                            <span className="error">{errors.errors["firstname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.surName" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" placeholder="Smith" id="lastname"
                                value={custForm.lastname}
                                onChange={handleChange} />
                            <span className="error">{errors.errors["lastname"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.gender" /></label>
                            <select className="form-select" value={custForm.gender} aria-label="Default select example" onChange={handleChange} id="gender">
                                <option value="">Select</option>
                                {DROPDOWN.gender.map(opt => {
                                    return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["gender"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label">Phone number</label>
                            <input type="number" className="form-control" placeholder="+48 123 456 789" id="phone"
                                value={custForm.phone}
                                onChange={handleChange}
                            />
                            <span className="error">{errors.errors["phone"]}</span>
                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.dob" /></label>
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
                            <select value={custForm.country} onChange={handleChange} id="country" className="form-select" aria-label="Default select example">
                                {countries && countries.map((opt, i) => {
                                    return (<option key={i} value={opt.name}>{opt.full_name_english ? opt.full_name_english : opt.id}</option>);
                                })}
                            </select>
                            <span className="error">{errors.errors["country"]}</span>
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

            {/* my preference details modal */}
            <Modal show={props.prefrences} size="lg">
                <Modal.Header>
                    <div className="CLE_pf_details">
                        <h1><IntlMessages id="myaccount.myPreferences" /></h1>
                        <Link to="#" onClick={closeMyPreferences} className="cross_icn"> <i className="fas fa-times"></i></Link>
                        <MyPreferences custData={custForm} preferences={attributes} />
                    </div>
                </Modal.Header>
            </Modal>

            {/* my details modal */}
            <Modal show={myAddressModal}>
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
            </Modal>

            {/* Gifting preference details modal */}

            <Modal show={giftingModal} size="lg" onHide={openGigitingModal}>
                <Modal.Body className="gifting_pref">
                    <div className="girft_details">
                        <Modal.Header>
                            <h1><IntlMessages id="myaccount.giftingPreferences" /></h1>
                            <Link to="#" onClick={openGigitingModal} className="cross_icn"> <i className="fas fa-times"></i></Link>
                        </Modal.Header>
                        <div className="my_birthday mb-3">
                            <label className="form-label"><IntlMessages id="myaccount.myBirthday" /></label>
                            <div className="birthdate">{custForm.dob}</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <div className="add_frd_birthdaysec">
                                <h2><IntlMessages id="myaccount.addAFriend" /></h2>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.name" /><span className="maindatory">*</span></label>
                                    <input type="text" className="form-control" placeholder="John" value={giftingPrefer.name} id="name"
                                        onChange={handleGiftingChange} />
                                    <span className="error">{giftErrors.errors["name"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.surName" /></label><span className="maindatory">*</span>
                                    <input type="text" className="form-control" placeholder="Doe" value={giftingPrefer.surName} id="surName"
                                        onChange={handleGiftingChange} />
                                    <span className="error">{giftErrors.errors["surName"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.occasion" /></label><span className="maindatory">*</span>
                                    <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.occasion} id="occasion"
                                        onChange={handleGiftingChange}>
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist1" })}>{intl.formatMessage({ id: "gifting.occasionlist1" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist2" })}>{intl.formatMessage({ id: "gifting.occasionlist2" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist3" })}>{intl.formatMessage({ id: "gifting.occasionlist3" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist4" })}>{intl.formatMessage({ id: "gifting.occasionlist4" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist5" })}>{intl.formatMessage({ id: "gifting.occasionlist5" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist6" })}>{intl.formatMessage({ id: "gifting.occasionlist6" })}</option>
                                        <option value={intl.formatMessage({ id: "gifting.occasionlist7" })}>{intl.formatMessage({ id: "gifting.occasionlist7" })}</option>
                                    </select>
                                    <span className="error">{giftErrors.errors["occasion"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.annualReminder" /></label><span className="maindatory">*</span>
                                    <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.annualReminder} id="annualReminder"
                                        onChange={handleGiftingChange}>
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                        <option value={intl.formatMessage({ id: "yes" })}>{intl.formatMessage({ id: "yes" })}</option>
                                        <option value={intl.formatMessage({ id: "no" })}>{intl.formatMessage({ id: "no" })}</option>
                                    </select>
                                    <span className="error">{giftErrors.errors["annualReminder"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="gifting.date" /></label><span className="maindatory">*</span>
                                    <div className="dobfeild">
                                        <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.dobDate} id="dobDate"
                                            onChange={handleGiftingChange}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            {DROPDOWN.dates.map(opt => {
                                                return (<option value={opt} key={opt}>{opt}</option>);
                                            })}
                                        </select>
                                        <span className="error">{giftErrors.errors["dobDate"]}</span>
                                        <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.dobMonth} id="dobMonth"
                                            onChange={handleGiftingChange}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            {DROPDOWN.months.map(opt => {
                                                return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                            })}
                                        </select>
                                        <span className="error">{giftErrors.errors["dobMonth"]}</span>
                                        <select className="form-select" aria-label="Default select example" value={giftingPrefer.dobYear} id="dobYear"
                                            onChange={handleGiftingChange}>
                                            <option value="">{intl.formatMessage({ id: "select" })}</option>
                                            {DROPDOWN.years.map(opt => {
                                                return (<option value={opt} key={opt}>{opt}</option>);
                                            })}
                                        </select>
                                        <span className="error">{giftErrors.errors["dobYear"]}</span>
                                    </div>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.dateOfDelivery" /></label><span className="maindatory">*</span>
                                    <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.DateOfDelivery} id="DateOfDelivery"
                                        onChange={handleGiftingChange}>
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                        <option value="1">{intl.formatMessage({ id: "deliveryDateoption1" })}</option>
                                        <option value="2">{intl.formatMessage({ id: "deliveryDateoption2" })}</option>
                                    </select>
                                    <span className="error">{giftErrors.errors["DateOfDelivery"]}</span>
                                </div>
                                {showCustomdate && (
                                    <div className="width-100 mb-3 form-field">
                                        <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="gifting.datedelivry" /></label><div className="dobfeild">
                                            <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.dodDate} id="dodDate"
                                                onChange={handleGiftingChange}>
                                                <option value="">{intl.formatMessage({ id: "select" })}</option>
                                                {DROPDOWN.dates.map(opt => {
                                                    return (<option value={opt} key={opt}>{opt}</option>);
                                                })}
                                            </select>
                                            <span className="error">{giftErrors.errors["dodDate"]}</span>
                                            <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.dodMonth} id="dodMonth"
                                                onChange={handleGiftingChange}>
                                                <option value="">{intl.formatMessage({ id: "select" })}</option>
                                                {DROPDOWN.months.map(opt => {
                                                    return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                                })}
                                            </select>
                                            <span className="error">{giftErrors.errors["dodMonth"]}</span>
                                            <select className="form-select" aria-label="Default select example" value={giftingPrefer.dodYear} id="dodYear"
                                                onChange={handleGiftingChange}>
                                                <option value="">{intl.formatMessage({ id: "select" })}</option>
                                                {DROPDOWN.years.map(opt => {
                                                    return (<option value={opt} key={opt}>{opt}</option>);
                                                })}
                                            </select>
                                            <span className="error">{giftErrors.errors["dodYear"]}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.gender" /></label><span className="maindatory">*</span>
                                    <select className="form-select" aria-label="Default select example" value={giftingPrefer.gender} id="gender"
                                        onChange={handleGiftingChange}>
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                        {DROPDOWN.gender.map(opt => {
                                            return (<option value={opt.id} key={opt.id}>{opt.name}</option>);
                                        })}
                                    </select>
                                    <span className="error">{giftErrors.errors["gender"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.categoryPrefer" /></label><span className="maindatory">*</span>
                                    <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.categoryPreference} id="categoryPreference"
                                        onChange={handleGiftingChange}>
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>

                                        {attributes.data && attributes.data.length > 0 && attributes.data[0].preference && attributes.data[0].preference.mostly_intersted && attributes.data[0].preference.mostly_intersted.map((inter, i) => {
                                            return (<option key={i} value={inter.id}>{inter.name}</option>)
                                        })}

                                    </select>
                                    <span className="error">{giftErrors.errors["categoryPreference"]}</span>
                                </div>
                                <div className="width-100 mb-3 form-field">
                                    <label htmlFor="exampleInputEmail1" className="form-label"><IntlMessages id="myaccount.notify" /></label><span className="maindatory">*</span>
                                    <select className="form-select me-3" aria-label="Default select example" value={giftingPrefer.notifyMe} id="notifyMe"
                                        onChange={handleGiftingChange}>
                                        <option value="">{intl.formatMessage({ id: "select" })}</option>
                                        <option value="1">{intl.formatMessage({ id: "notifyEmail" })}</option>
                                        <option value="2">{intl.formatMessage({ id: "notofyWhatsapp" })}</option>
                                    </select>
                                    <span className="error">{giftErrors.errors["notifyMe"]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="list_birthday">
                                <div className="width-100">
                                    <h2><IntlMessages id="myaccount.listOfBirthdays" /></h2>
                                </div>
                                <div className="favt_dragdrop  mt-3">
                                    <div className="favdesignr_size_sec">
                                        <ul>
                                            <ul className='giftingPreflistpop'>
                                                {customerPrefer.gifting_preferencees.map((opt, i) => {
                                                    return (
                                                        <li key={i} onMouseEnter={() => setIsShown(i)} onMouseLeave={() => setIsShown(-1)} ><Link to="#">{isShown === parseInt(i) ? <span className='textevents' onClick={() => removeSeleted(i)} > <i className="fa fa-times" aria-hidden="true"></i></span> : <span className='textevents' > {opt['name']}/{opt['dobDate']} {opt['dobMonth']}  {opt['dobYear']}</span>
                                                        }

                                                        </Link></li>
                                                    );
                                                })}
                                            </ul>

                                        </ul>
                                        {/* <div className="save-btn removel_allbtn"><Link to="#" className="btn-link-grey"><IntlMessages id="preferences.removeAll" /></Link></div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal.Footer>
                            <div className="width-100 mb-4">
                                <div className="float-end">
                                    <button type="button" style={{ "display": !ishowGifting ? "inline-block" : "none" }} className="btn btn-secondary" onClick={saveGiftingPrefer}><IntlMessages id="myaccount.confirm" /></button>
                                    <div className="spinner" style={{ "display": ishowGifting ? "inline-block" : "none" }}>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                                        <IntlMessages id="loading" />
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
    // console.log(state.Cart.isPrepOpen)

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages,
        token: state.session.user,
        prefrences: state.Cart.isPrepOpen
    }
}

export default connect(
    mapStateToProps,
    { closePrefPopup }
)(MyProfile);