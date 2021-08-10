import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { getCustomerDetails, saveCustomerDetails, getCountriesList, getPreference } from '../../../redux/pages/customers';


function CustomerDetails(props) {
    //for customer details
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [countries, setCountries] = useState([]);
    const [telephone, setTelephone] = useState("");
    const [country, setCountry] = useState("");
    const [custForm, setCustForm] = useState({
        id: custId,
        email: "",
        firstname: "",
        lastname: "",
        middlename: "",
        gender: 0,
        dob:"",
        website_id: 0,
        addresses: [],
        created_at:"",
        created_in:"",
        updated_at:"",
        group_id:"",
        disable_auto_group_change:"",
        extension_attributes:""
    });
    const [errors, setError] = useState({
        errors: {}
    });

    //for attributes details
    const [attributes, setAttributes] = useState({});
    
    
    useEffect(() => {
        async function getData() {
            let result: any = await getCustomerDetails(custId);
            setCustForm(result.data);
            if(result.data.addresses.length > 0){
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
        const address = {
            country_id: country,
            telephone: telephone,
            id: custForm.addresses[0].id
        }
        custForm.addresses.push(address);
        delete custForm.created_at;
        delete custForm.created_in;
        delete custForm.updated_at;
        delete custForm.group_id;
        delete custForm.disable_auto_group_change;
        delete custForm.extension_attributes;

        console.log(custForm);
        let result: any = await saveCustomerDetails(custId, {customer:custForm});
    }


    //for attributes
    const getAttributes = async () => {
        let result: any = await getPreference(custId);
        console.log(result);
        setAttributes(result.data[0]);
    }


    return (
        <div className="container" style={{ marginTop: '150px' }}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Customer Details</h4>
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