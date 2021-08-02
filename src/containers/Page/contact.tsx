import React, { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import notification from '../../components/notification';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
import { getContactUsForm, SubmitContactUs } from '../../redux/pages/allPages';
const { openSignUp } = appAction;

function ContactUS(props) {
    const [state, setState] = useState({
        name: "",
        email: "",
        reason: "",
        message: ""
    })
    const [errors, setError] = useState({
        errors: {}
    });

    const [form, setForm] = useState({
        "title": "",
        "form_id": null,
        "store_id": "",
        "form_json": [],
        "code": ""
    });
    const [payload, setPayload] = useState({
        "answer_id": null,
        "form_id": null,
        "store_id": null,
        "created_at": "",
        "ip": "122.173.115.186",
        "response_json": "",
        "customer_id": null,
        "admin_response_email": "",
        "response_message": "",
        "recipient_email": "",
        "customer_name": "",
        "admin_response_status": "0",
        "referer_url": "",
        "form_name": null,
        "form_code": null
    });

    useEffect(() => {
        async function getData() {
            let result: any = await getContactUsForm(props.languages);
            setForm(result.data[0]);
        }
        getData()
    }, [props.languages]);


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        //Email   
        if (typeof state["email"] !== "undefined") {
            let lastAtPos = state["email"].lastIndexOf('@');
            let lastDotPos = state["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && state["email"].indexOf('@@') === -1 && lastDotPos > 2 && (state["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                error["email"] = "Email is not valid";
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = "Email is required";
        }

        if (!state["reason"]) {
            formIsValid = false;
            error["reason"] = "Reason is required";
        }

        if (!state["name"]) {
            formIsValid = false;
            error["name"] = 'Name is required';
        }

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = 'Message is required';
        }


        setError({ errors: error });
        return formIsValid;
    }

    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = async (e) => {
        console.log(state);
        e.preventDefault();
        //  const { register } = props;
        console.log(state)
        if (handleValidation()) {
            let data: any = {};
            form.form_json[0].forEach(el => {
                data[el.name] = {
                    value: state[el.name],
                    label: el.label,
                    type: el.type
                }
            });

            payload.response_json = JSON.stringify(data);
            payload.form_id = form.form_id;
            payload.store_id = form.store_id;
            payload.form_name = form.title;
            payload.form_code = form.code;
            setPayload(payload);
            let result: any = await SubmitContactUs({ answer: payload });
            if (result) {
                notification("success", "", "Message sent!");
                setState(prevState => ({
                    ...prevState,
                    name: "",
                    email: "",
                    reason: "",
                    message: ""
                }))
            }
        } else {
            notification("warning", "", "Please enter required values");
        }
    }
    return (
        <div className="container about-inner"  >
            <figure className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                    <text id="Contact Us" data-name="Contact Us" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                        strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                        <tspan x="-423.555" y="0"><IntlMessages id="contact.title" /></tspan>
                    </text>
                </svg>
            </figure>
            <div className="row" style={{ marginTop: "80px" }}>
                <div className="col-md-4 offset-md-4">
                    <div className="blue-back-image" style={{ background: "#fff", height: "420px" }}>
                        <div className="about-inner-pic">
                            <div className="row g-3">
                                <div className="text-center">
                                    <h3><IntlMessages id="contact.reach" /></h3>
                                    <p><IntlMessages id="contact.do_you_have_question" /></p>
                                </div>

                                {form && form.form_json[0] && form.form_json[0].map(item => {
                                    return item.type === 'textinput' ?
                                        <div className="col-sm-12" key={item.name}>
                                            <label htmlFor=""> <b>{item.label}</b></label>
                                            <input type="text"
                                                className={item.className}
                                                id={item.name}
                                                aria-describedby={item.name}
                                                placeholder={Capitalize(item.name)}
                                                value={state[item.name]}
                                                onChange={handleChange}
                                            />
                                            <span className="error">{errors.errors[item.name]}</span>
                                        </div> :  item.type === 'textarea' ? <div className="col-sm-12" key={item.name}>
                                        <label htmlFor=""> <b>{item.label}</b></label>
                                        <textarea id={item.name} value={state.message} className={item.className} placeholder={Capitalize(item.name)} onChange={handleChange}></textarea>
                                            <span className="error">{errors.errors[item.name]}</span>
                                        </div> : <div className="col-sm-12" key={item.name}>
                                            <label htmlFor=""> <b>{item.label}</b></label>
                                            <select value={state.reason} onChange={handleChange} id={item.name} className={item.className}>
                                                <option value="">Select</option>
                                                {item.values && item.values.map(opt => {
                                                    return (<option key={opt.value} value={opt.value}>{opt.label}</option>);
                                                })}
                                            </select>
                                            <span className="error">{errors.errors[item.name]}</span>
                                        </div>

                                })}

                                <div className="d-flex justify-content-end">
                                    <Link to="/" className="signup-btn" onClick={handleSubmitClick}> <IntlMessages id="contact.send" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages
    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(ContactUS);