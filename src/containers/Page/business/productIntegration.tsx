import { useEffect, useState } from 'react';
import { getCookie } from '../../../helpers/session';
import { getProductIntegration, getProductIntegrationSample } from '../../../redux/pages/vendorLogin';
import { SaveAnswers } from '../../../redux/pages/allPages';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import notification from '../../../components/notification';
import { useIntl } from 'react-intl';
import ContactBannerFooter from '../customer/contact-banner';

function ProductIntegration(props) {
    const intl = useIntl();
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    const language = getCookie('currentLanguage');
    const [showEcom, setShowEcom] = useState(false);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [formData, setFormData] = useState({})
    const [setEcom, setSetEcom] = useState('');
    const [setFinal, setSetFinal] = useState('');
    const [downloadSample, setDownloadSample] = useState('');
    const [formdd, setFormDd] = useState([])
    const [form, setForm] = useState({
        "title": "",
        "form_id": "",
        "store_id": "",
        "form_title": "",
        "form_json": []
    });
    const [payload, setPayload] = useState({
        "answer": {
            "answer_id": null,
            "form_id": null,
            "store_id": null,
            "created_at": "",
            "ip": "122.173.115.173",
            "response_json": {},
            "customer_id": null,
            "admin_response_email": "",
            "response_message": "",
            "recipient_email": "",
            "customer_name": "",
            "admin_response_status": "0",
            "referer_url": "",
            "form_name": null,
            "form_code": null
        }
    });
    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let sample: any = await getProductIntegrationSample(lang);
            setDownloadSample(sample.data)
            let result: any = await getProductIntegration(lang);
            let formData = [];
            if (result.data[0] && result.data[0].form_json && result.data[0].form_json.length > 0) {
                result.data[0].form_json[0].map((ques, i) => {
                    formData.push(ques);
                })
            }

            setFormDd(formData)
            setForm(result?.data?.[0]);
        }
        getData()
        return () => {

        }
    }, [props.languages]);

    const handleOnChange = async (e) => {
        e.preventDefault();
        let attribute_code = e.target.getAttribute("data-attribute");
        console.log(e.target.value)
        setSetEcom(e.target.value)
        if (e.target.value === "option-2") {
            setShowEcom(true)
            setShowBulkUpload(false)
        } else if (e.target.value === "option-3") {
            setShowBulkUpload(true)
            setShowEcom(false)
        } else {
            setShowEcom(false)
            setShowBulkUpload(false)
        }



        const tempObj = {
            value: e.target.value,
            label: attribute_code,
            type: 'radio'
        }
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: tempObj
        }));
    }
    const handleOnChangeEcom = async (e) => {
        let attribute_code = e.target.getAttribute("data-attribute");
        setSetFinal(e.target.value);
        const tempObj = {
            value: e.target.value,
            label: attribute_code,
            type: 'radio'
        }
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: tempObj
        }));
    }

    const optionHandler = async (e) => {
        //  console.log(Object.keys(formData))
        if (Object.keys(formData).length <= 0)
            return notification("error", "", intl.formatMessage({ id: "selectproductintegration" }));
        if (Object.values(formData)[0]['value'] === 'option-2' && Object.keys(formData).length < 2)
            return notification("error", "", intl.formatMessage({ id: "selectproductEcom" }));
        if (Object.values(formData)[0]['value'] === 'option-3' && Object.keys(formData).length < 2)
            return notification("error", "", intl.formatMessage({ id: "uploadcsv" }));
        payload.answer.response_json = JSON.stringify(formData);
        payload.answer.form_id = form.form_id;
        payload.answer.store_id = form.store_id;
        // payload.answer.customer_id = localToken.vendor_id;
        payload.answer.form_name = form.title;
        payload.answer.form_code = 'product_integration';

        let result: any = await SaveAnswers(payload);
        //console.log(result);
        if (result.data && result.data.answer_id) {
            notification("success", "", intl.formatMessage({ id: "productintegration" }));
        } else {
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }
    }

    async function onFileChange(e) {

        let allowedExtensions = ['.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

        let filetype = e?.target?.files[0]?.type;
        if (allowedExtensions.indexOf(filetype) === -1) {
            notification("error", "", intl.formatMessage({ id: "onlycsvallowed" }));
            return false;
        }
        let attribute_code = e.target.getAttribute("data-attribute");

        const file = e.target.files[0];
        const base64 = await getBase64(file);


        const tempObj = {
            value: base64,
            label: attribute_code,
            type: 'file'
        }
        const nameObj = {
            value: e?.target?.files[0]?.name,
            label: attribute_code,
            type: 'file'
        }


        setPayload(prevState => ({
            ...prevState,
            'filedata': tempObj
        }));
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: nameObj
        }));
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
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">

                    <div className="integration-head">
                        <h1>{form.title}</h1>
                        <p>{form?.form_title?.replace(/[`~!@#$%^&*()_|+\-=;:'",<>\{\}\[\]\\\/]/gi, '')}</p>
                    </div>

                    <section className="chooose-methods">
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12">
                                <h3>{formdd && formdd.length > 0 ? formdd[0].label : ""}</h3>
                                <p>{formdd && formdd.length > 1 ? formdd[1].label : ""}</p>
                                <div className="opt-tabs">
                                    <ul className="radio-toolbar">
                                        {formdd && formdd.length > 1 && formdd[1].values.map((quest, i) => {
                                            return (
                                                <> <li><input type="radio" id={`radioApple` + i} name={formdd && formdd.length > 1 ? formdd[1].name : ""} value={quest.value} onChange={handleOnChange} data-attribute={quest.label} className={setEcom === quest.value ? "active" : ""} />
                                                    <label htmlFor="radioApple">{quest.label}</label></li>
                                                </>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            {/* })} */}
                            {showEcom && (
                                <div className="col-xs-12 col-md-12 col-lg-12 mt-4">
                                    <h3>{formdd && formdd.length > 2 ? formdd[2].label : ""}</h3>
                                    <div className="opt-tabs">
                                        <ul className="radio-toolbar">
                                            {formdd && formdd.length > 2 && formdd[2].values.map((quest, i) => {
                                                return (
                                                    <> <li><input type="radio" id={`step2` + i} name={formdd && formdd.length > 2 ? formdd[2].name : ""} value={quest.value} onChange={handleOnChangeEcom} data-attribute={quest.label} className={setFinal === quest.value ? "active" : ""} />
                                                        <label htmlFor="radioApple">{quest.label}</label></li>
                                                    </>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {showBulkUpload && (
                                <div className="col-xs-12 col-md-12 col-lg-12 mt-4">
                                    <h3>{formdd && formdd.length > 3 ? formdd[3].label : ""}</h3>
                                    <p>{formdd && formdd.length > 4 ? formdd[4].label : ""}</p>

                                    <div className="bulk-upload">

                                        <a href={downloadSample} target="_blank" rel="noopener noreferrer" download>
                                            <div className="download">
                                                <i className="fas fa-file-download"></i>
                                                <span>Download Sample</span>
                                            </div>
                                        </a>
                                        <div className="upload">
                                            <i className="fas fa-file-upload"></i>
                                            <input type={formdd && formdd.length > 5 ? formdd[5].type : ""} name={formdd && formdd.length > 5 ? formdd[5].name : ""} onChange={onFileChange} data-attribute={formdd && formdd.length > 5 ? formdd[5].label : ""} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                            <span>{formdd && formdd.length > 5 ? formdd[5].label : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button type="submit" className="btn btn-secondary" onClick={optionHandler}>Send</button>
                        </div>
                    </section>


                    <section className="faq-form">
                        <div className="row">
                            <div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
                                <iframe title="contact form" src="https://forms.zohopublic.com/cleportal692/form/ContactusTeaser/formperma/ChqWeIlStcsFpEqH1XolNHheBwaVh9Huwq8bZ6pXOIQ" width="99%" height="800px"></iframe>

                            </div>
                        </div>
                    </section>

                    <ContactBannerFooter />

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