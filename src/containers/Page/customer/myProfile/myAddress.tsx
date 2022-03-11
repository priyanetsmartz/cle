import { useState, useEffect } from 'react';
import IntlMessages from "../../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
import notification from '../../../../components/notification';
import { deleteAddress, getCustomerDetails, saveCustomerDetails } from '../../../../redux/pages/customers';
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";

function MyAddress(props) {
    const intl = useIntl();
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    const userGroup = localToken ? localToken.token : '';
    const [myAddressModal, setMyAddressModal] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
    const [custForm, setCustForm] = useState({
        addresses: []
    });

    const [errors, setError] = useState({
        errors: {}
    });
    const [custAddForm, setCustAddForm] = useState({
        id: 0,
        customer_id: localToken?.cust_id,
        firstname: "",
        lastname: "",
        telephone: "",
        postcode: "",
        city: "",
        country_id: "",
        region_id: "",
        street: ""
    });

    const openAddressModal = () => {
        setMyAddressModal(!myAddressModal);
    }
    const deleteAdd = async (index) => {// function to delete address
        if (!custForm.addresses[index]) return;
        let result: any = await deleteAddress(custForm.addresses[index].id);
        if (result) {
            custForm.addresses.splice(index, 1);
            setCustForm(custForm);
            await getData();
            notification("success", "", intl.formatMessage({ id: "customerAddressDelete" }));
        }
    }

    const editAddress = (index, id) => {// function to update address
        delete custForm.addresses[index].region;
        setAddIndex(index);
        getData();
        custForm.addresses[index].street = custForm.addresses[index].street[0];
        setCustAddForm(custForm.addresses[index]);
        openAddressModal();
    }

    const [addIndex, setAddIndex] = useState(null);

    const closePopAddress = () => { // closing the modal which is opened for editing purpose
        setCustAddForm({
            id: 0,
            customer_id: localToken?.cust_id,
            firstname: "",
            lastname: "",
            telephone: "",
            postcode: "",
            city: "",
            country_id: "",
            region_id: "",
            street: ""
        });
        setMyAddressModal(false);
    }


    useEffect(() => {
        getData();
        return () => {
            setIsShow(false)
        }
    }, []);

    const getData = async () => {// function to hit api for getting customer dtails and set in customer form
        let result: any = await getCustomerDetails();
        setCustForm(result?.data);
    }

    // for customer address popup window starts here
    const saveCustAddress = async (e) => {// firstly, all the fields in address are validated, and post that updated customer address is saved
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
            let result: any = await saveCustomerDetails({ customer: custForm });
            if (result) {
                await getData();
                openAddressModal();
                if (obj.id === 0) {
                    notification("success", "", intl.formatMessage({ id: "customerAddressSave" }));
                } else {
                    notification("success", "", intl.formatMessage({ id: "customerAddressUpdate" }));
                }
                setCustAddForm({
                    id: 0,
                    customer_id: localToken?.cust_id,
                    firstname: "",
                    lastname: "",
                    telephone: "",
                    postcode: "",
                    city: "",
                    country_id: "",
                    region_id: "",
                    street: ""
                });

                setIsShow(false);

            }
        }
    }

    const validateAddress = () => {// validation constraints are checked under this function
        let error = {};
        let formIsValid = true;
        if (typeof custAddForm.telephone !== "undefined") {
            if (!(/^((?:[+?0?0?966]+)(?:\s?\d{2})(?:\s?\d{7}))$/.test(custAddForm.telephone))) {
                formIsValid = false;
                error["telephone"] = intl.formatMessage({ id: "phoneinvalid" });
            }
        }
        
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

    }


    // for customer address popup window ends here

    //edit existing address ends here--------------->
    return (
        <section className="my_profile_sect mb-4">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <h2><IntlMessages id="myaccount.myAddresses" /></h2>
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

                    {custForm && custForm.addresses && custForm.addresses.length > 0 && custForm.addresses.map((address, i) => {
                       

                        return (<div className="addressnew_addressbodr" key={i}>
                            <h3><IntlMessages id="myaccount.address" /></h3>
                            <ul>
                                <li>{address.firstname + ' ' + address.lastname}</li>
                                <li>{address.street}</li>
                                <li>{address.postcode}</li>
                                <li>{address.city}</li>
                                <li>Saudi Arabia</li>
                            </ul>
                            {i === 0 && <><div className="default_dlivy mt-3"><IntlMessages id="myaccount.defaultDeliveryAddress" /></div>
                                <div className="default_billing"><IntlMessages id="myaccount.defaultBillingAddress" /></div></>}
                            <div className="address-action">
                                <Link to="#" onClick={() => deleteAdd(i)} className="delete_btn"><IntlMessages id="myaccount.delete" /></Link>
                                <Link to="#" className={`edit_btn ${isPriveUser ? 'prive-txt' : ''}`} onClick={() => editAddress(i, address.id)}>
                                    <IntlMessages id="myaccount.edit" />
                                </Link>
                            </div>
                        </div>);
                    })}


                </div>
            </div>
            {/* my details modal */}
            <Modal show={myAddressModal}>
                <Modal.Body className="CLE_pf_details">
                    <Modal.Header><h1><IntlMessages id="myaccount.myAddress" /></h1>
                        <Link to="#" className="cross_icn" onClick={closePopAddress}> <i className="fas fa-times"></i></Link>
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
                                placeholder={intl.formatMessage({ id: "register.last_name" })}
                                value={custAddForm.lastname}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["lastname"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.phoneNo" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="telephone"
                                placeholder={intl.formatMessage({ id: 'myaccount.phoneNo' })}
                                value={custAddForm.telephone}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["telephone"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.address" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="street"
                                placeholder={intl.formatMessage({ id: 'myaccount.address' })}
                                value={custAddForm.street}
                                maxLength={50}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["street"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.city" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="city"
                                placeholder={intl.formatMessage({ id: 'myaccount.city' })}
                                value={custAddForm.city}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["city"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.postCode" /><span className="maindatory">*</span></label>
                            <input type="text" className="form-control" id="postcode"
                                placeholder={intl.formatMessage({ id: 'myaccount.postCode' })}
                                value={custAddForm.postcode}
                                onChange={handleAddChange} />
                            <span className="error">{errors.errors["postcode"]}</span>

                        </div>
                        <div className="width-100 mb-3 form-field">
                            <label className="form-label"><IntlMessages id="myaccount.country" /><span className="maindatory">*</span></label>

                            <select value={custAddForm.country_id} onChange={handleCountryChange} id="country_id" className="form-select">
                                <option key="0" value="">{intl.formatMessage({ id: 'select' })}</option>
                                <option key="1" value="SA">{intl.formatMessage({ id: 'saudi' })}</option>
                            </select>
                            <span className="error">{errors.errors["country_id"]}</span>
                        </div>
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
        </section>
    );
}

const mapStateToProps = (state) => {
    let languages = '';
    if (state?.LanguageSwitcher) {
        languages = state?.LanguageSwitcher?.language
    }

    return {
        languages: languages,
        token: state?.session?.user
    }
}

export default connect(
    mapStateToProps,
    {}
)(MyAddress);