import { useState, useEffect } from 'react';
import IntlMessages from "../../../components/utility/intlMessages";
import { GetHelpUsForm, SaveAnswers } from '../../../redux/pages/allPages';
import { connect } from "react-redux";
import { setCookie, getCookie } from "../../../helpers/session";
import appAction from "../../../redux/app/actions";

const { showSignin } = appAction;

function Personal(props) {

    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [isSurvey, setIsSurvey] = useState(customerId && (customerId == getCookie('help-us')) ? true : false);

    const [onLogin, setOnLogin] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [isSurveyEnd, setIsSurveyEnd] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [loading, setloading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const [form, setForm] = useState({
        "title": "",
        "form_id": "",
        "store_id": "",
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
    const [answers, setAnswers] = useState({});
    const language = getCookie('currentLanguage');
    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await GetHelpUsForm(lang);
            setForm(result.data[0]);
        }
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages]);

    useEffect(() => {
        let tokenCheck = localStorage.getItem('id_token');
        let tokenCheckFilter = !props.helpusVal ? tokenCheck : props.helpusVal;
        if (!tokenCheckFilter) {
            setOnLogin(false);
        } else {
            setOnLogin(true);
            setCustomerId(localStorage.getItem('cust_id'));
            setIsSurvey(customerId && (customerId === getCookie('help-us')) ? true : false);
        }
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    })

    const optionHandler = async (optionIndex) => {
        if (!onLogin) return handleClick();

        const tempObj = {
            value: form.form_json[activeIndex][0].values[optionIndex].label,
            label: form.form_json[activeIndex][0].label,
            type: form.form_json[activeIndex][0].type
        }
        var formCode = props.language === 'english' ? 'home_page_survey' : 'Home_page_survery_arabic';
        answers[form.form_json[activeIndex][0].name] = tempObj
        setAnswers(answers);
        payload.answer.response_json = JSON.stringify(answers);
        payload.answer.form_id = form.form_id;
        payload.answer.store_id = form.store_id;
        payload.answer.customer_id = localStorage.getItem('cust_id');
        payload.answer.form_name = form.title;
        payload.answer.form_code = formCode;
        setPayload(payload);
        if (form.form_json[activeIndex + 1]) {
            setActiveIndex(activeIndex + 1);
            setActiveTab(activeTab + 1);
        } else {
            setloading(true);
            let result: any = await SaveAnswers(payload);
            if (result.data) {
                setIsSurveyEnd(true);
                setloading(false);
                setCookie("help-us", customerId);
            }
        }
    }

    const toggleHelpUs = () => {
        setIsHidden(!isHidden);
    }

    const handleClick = () => {
        const { showSignin } = props;
        showSignin(true);
    }

    return (
        <>
            <section className="width-100 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="personal_block">
                                <div className="personal_bg">
                                    <div className="personalwhite-bg">
                                        {!isSurvey && <div className="persnalize-select">
                                            <div className="marketing_secs">
                                                <div className="width-100%">
                                                    {form.form_json.length > 1 && (
                                                        <div className="steps-sec">
                                                            <div className="stepwizard">
                                                                <div className="stepwizard-row">
                                                                    {form && form.form_json.map((ques, i) => {
                                                                        return (
                                                                            <div className="stepwizard-step" key={i}>
                                                                                <div className={`btn btn-primary btn-circle ${(activeTab === (i + 1) ? 'active' : '')}`}><span
                                                                                    className="text">{i + 1}</span></div>
                                                                            </div>
                                                                        );
                                                                    })}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>


                                                {form && <h2>{form.title}</h2>}
                                                {isSurveyEnd && !loading && <div className="question-sec"><h2><IntlMessages id="helpus.thankyou" /></h2></div>}
                                                {!isSurveyEnd && loading && <div className="question-sec"><h2><IntlMessages id="helpus.response_saving" /></h2></div>}

                                                {(form && form.form_json.length > 0 && !loading && !isSurveyEnd) && <>
                                                    <p>{form.form_json[activeIndex][0].label}</p>
                                                    <div className="choose-shopping">
                                                        {form.form_json[activeIndex][0].values.map((opt, i) => {
                                                            return (
                                                                <button key={i} onClick={() => { optionHandler(i); }} type="button" className="btn btn-outline-primary me-2">{opt.label}</button>
                                                            );
                                                        })}
                                                    </div>
                                                </>}

                                                <div className="no-worries">
                                                    <h3><IntlMessages id="home.noWorries" /></h3>
                                                </div>
                                            </div>
                                            <div className="alert_cross">
                                                <a href="#"><img src="images/cross-blue_icn.svg" className="" alt="" /> </a>
                                            </div>
                                        </div>}

                                        {isSurvey && (
                                            <div className="col-md-8 offset-md-2 mt-5 help-us-content py-4">
                                                <h3><IntlMessages id="helpus.thankyou" /></h3>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function mapStateToProps(state) {
    let languages = '', helpusVal;
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language;
    }
    if (state && state.Auth && state.Auth.idToken) {
        helpusVal = state.Auth.idToken;
    }
    return {
        languages: languages,
        helpusVal: helpusVal
    };
};
export default connect(
    mapStateToProps,
    { showSignin }
)(Personal);
