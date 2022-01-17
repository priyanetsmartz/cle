import { useEffect, useState } from 'react';
import { getCookie } from '../../../helpers/session';
import { getProductIntegration } from '../../../redux/pages/vendorLogin';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
function ProductIntegration(props) {
    const language = getCookie('currentLanguage');
    const [formdd, setFormDd] = useState([])
    const [form, setForm] = useState({
        "title": "",
        "form_id": "",
        "store_id": "",
        "form_title": "",
        "form_json": []
    });

    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await getProductIntegration(lang);
            let formData = [];
            if (result.data[0] && result.data[0].form_json && result.data[0].form_json.length > 0) {
                result.data[0].form_json[0].map((ques, i) => {
                    formData.push(ques);
                })
            }
            setFormDd(formData)
            setForm(result.data[0]);
        }
        getData()
        return () => {

        }
    }, [props.languages]);
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">

                    <div className="integration-head">
                        <h1>{form.title}</h1>
                        <p>{form.form_title}</p>
                    </div>

                    <section className="chooose-methods">
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12">
                                <h3>{formdd && formdd.length > 0 ? formdd[0].label : ""}</h3>
                                <p>{formdd && formdd.length > 1 ? formdd[1].label : ""}</p>
                                <div className="opt-tabs">
                                    <div className="radio-toolbar">
                                        {formdd && formdd.length > 1 && formdd[1].values.map((quest, i) => {
                                            return (
                                                <> <input type="radio" id="radioApple" name="radioFruit" value={quest.value} checked />
                                                    <label htmlFor="radioApple">{quest.label}</label>
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            {/* })} */}
                            <div className="col-xs-12 col-md-12 col-lg-12">
                                <h3>{formdd && formdd.length > 2 ? formdd[2].label : ""}</h3>

                                <div className="opt-tabs">
                                    <div className="radio-toolbar">
                                    {formdd && formdd.length > 2 && formdd[2].values.map((quest, i) => {
                                            return (
                                                <> <input type="radio" id="radioApple" name="radioFruit" value={quest.value} checked />
                                                    <label htmlFor="radioApple">{quest.label}</label>
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12 col-lg-12">
                                <h3>{formdd && formdd.length > 3 ? formdd[3].label : ""}</h3>
                                <p>{formdd && formdd.length > 4 ? formdd[4].label : ""}</p>

                                <div className="bulk-upload">
                                    <Link to="#">
                                        <div className="download">
                                            <i className="fas fa-file-download"></i>
                                            <span>{formdd && formdd.length > 5 ? formdd[5].label : ""}</span>
                                        </div>
                                    </Link>
                                    <Link to="#">
                                        <div className="upload">
                                            <i className="fas fa-file-upload"></i>
                                            <span>Upload CSV file</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </section>


                    <section className="faq-form">
                        <div className="row">
                            <div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
                                <h3>IT Request</h3>
                                <p>Do you have any questions? You can get in touch through this form.</p>

                                <form className="pt-3">
                                    <div className="mb-2">
                                        <select className="form-select" aria-label="Default select example">
                                            <option selected>Choose the topic</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Company name</label>
                                        <input type="text" className="form-control" placeholder="Ann" />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Email address</label>
                                        <input type="email" className="form-control" placeholder="ann.smith@gmail.com" />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Message</label>
                                        <textarea className="form-control" placeholder="Type a message..."></textarea>
                                    </div>
                                    <div className="pt-3 text-end">
                                        <button type="submit" className="btn btn-secondary">Send</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </section>

                    <section className="Check-help-center">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="help-content">
                                    <h3>Check Help Center</h3>
                                    <p>Find the answer you need in our FAQs section.</p>
                                    <Link to="#">Check out</Link>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages

    };
}

export default connect(
    mapStateToProps
)(ProductIntegration);