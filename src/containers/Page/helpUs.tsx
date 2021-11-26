import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { GetHelpUsForm, SaveAnswers } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import { setCookie, getCookie } from "../../helpers/session";
import appAction from "../../redux/app/actions";

const { showSignin } = appAction;

function HelpUs(props) {

    const [customerId, setCustomerId] = useState(props.token.cust_id);
    const [isSurvey, setIsSurvey] = useState(customerId && (customerId === getCookie('help-us')) ? true : false);

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
            let result: any = await GetHelpUsForm(lang,'');
            setForm(result.data[0]);
        }
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages]);

    useEffect(() => {
       
        let tokenCheck = props.token.id_token;
        let tokenCheckFilter = !props.helpusVal ? tokenCheck : props.helpusVal;
        if (!tokenCheckFilter) {
            setOnLogin(false);
        } else {
            setOnLogin(true);
            setCustomerId(props.token.cust_id);
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

        answers[form.form_json[activeIndex][0].name] = tempObj
        setAnswers(answers);
        payload.answer.response_json = JSON.stringify(answers);
        payload.answer.form_id = form.form_id;
        payload.answer.store_id = form.store_id;
        payload.answer.customer_id = props.token.cust_id;
        payload.answer.form_name = form.title;
        payload.answer.form_code = 'help-us';
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
            <div className="help-us-body">
                <div className="container help-us-inner">
                    <figure className="text-center page-head">

                        <svg xmlns="http://www.w3.org/2000/svg" width="848" height="117" viewBox="0 0 848 117">
                            <text id="Help_us" data-name={<IntlMessages id="help_us.title" />} transform="translate(424 85)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="96" fontFamily="Monument Extended Book"><tspan x="-422.016" y="0"><IntlMessages id="help_us.title" /></tspan></text> </svg>

                    </figure>
                    <div className="row">

                        {!isSurvey && (
                            <div className="col-md-8 offset-md-2 mt-5 help-us-content py-4">
                                <div className="show-hide">

                                </div>
                                {!isHidden && <div>
                                    <ul className="counter-list arabic-rtl-direction">
                                        {form && form.form_json.map((ques, i) => {
                                            return (
                                                <li className={activeTab === (i + 1) ? 'active' : ''} key={i}><span>{i + 1}</span></li>
                                            );
                                        })}

                                    </ul>
                                    {form && <h3>{form.title}</h3>}
                                    {isSurveyEnd && !loading && <div className="question-sec"><h2><IntlMessages id="helpus.thankyou" /></h2></div>}
                                    {!isSurveyEnd && loading && <div className="question-sec"><h2><IntlMessages id="helpus.response_saving" /></h2></div>}
                                    {(form && form.form_json.length > 0 && !loading && !isSurveyEnd) && <div className="question-sec">
                                        <h4>{form.form_json[activeIndex][0].label}</h4>
                                        <div className="select-answer">
                                            {form.form_json[activeIndex][0].values.map((opt, i) => {
                                                return (
                                                    <button key={i} onClick={() => { optionHandler(i); }}>{opt.label}</button>
                                                );
                                            })}
                                        </div>
                                    </div>}
                                </div>}
                            </div>
                        )}
                        {isSurvey && (
                            <div className="col-md-8 offset-md-2 mt-5 help-us-content py-4">
                                <h3><IntlMessages id="helpus.thankyou" /></h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        helpusVal: helpusVal,
        token: state.session.user
    };
};
export default connect(
    mapStateToProps,
    { showSignin }
)(HelpUs);
