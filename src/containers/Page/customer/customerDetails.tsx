import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { getCustomerDetails, saveCustomerDetails, getCountriesList } from '../../../redux/pages/customers';


function CustomerDetails(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [countries, setCountries] = useState([]);
    const [telephone, setTelephone] = useState("");
    const [country, setCountry] = useState("");
    const [dob, setDob] = useState("");
    const [custForm, setCustForm] = useState({
        id: custId,
        email: "",
        firstname: "",
        lastname: "",
        middlename: "",
        gender: 0,
        website_id: 0
    });

    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {
        async function getData() {
            let result: any = await getCustomerDetails(custId);
            setCustForm(result.data);
        }
        getData();
        getCountries();
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
        console.log(custForm, dob, country, telephone);
    }


    return (
        <div className="container" style={{marginTop:'150px'}}>
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
                                onChange={(e) => {setTelephone(e.target.value)}}
                            />
                            <span className="error">{errors.errors["phone"]}</span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor=""> <b>Date of Birth</b></label>
                            <input type="text"
                                className="form-control"
                                id="dob"
                                placeholder="Date of Birth"
                                value={dob}
                                onChange={(e) => {setDob(e.target.value)}}
                            />
                            <span className="error">{errors.errors["dob"]}</span>
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor=""> Country</label>
                            <select value={country} onChange={(e) => {setCountry(e.target.value)}} id="country" className='form-control'>
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