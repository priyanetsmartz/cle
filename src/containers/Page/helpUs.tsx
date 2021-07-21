import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { GetHelpUsForm, SaveAnswers } from '../../redux/pages/allPages';
import  { Redirect } from 'react-router-dom'
import { useHistory } from "react-router-dom";

function HelpUs() {
    let history = useHistory();
    const [activeTab, setActiveTab] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [form, setForm] = useState({
        "title":"",
        "form_id":"",
        "store_id":"",
        "form_json":[]
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

    useEffect(() => {
        async function getData() {
            let result: any = await GetHelpUsForm();
            console.log(result);
            setForm(result.data[0]);
        }
        getData()
    }, []);

    const optionHandler = async (optionIndex) => {

        const tempObj = {
            value:form.form_json[activeIndex][0].values[optionIndex].label,
            label:form.form_json[activeIndex][0].label,
            type:form.form_json[activeIndex][0].type
        }

        answers[form.form_json[activeIndex][0].name] = tempObj
        setAnswers(answers);
        payload.answer.response_json =JSON.stringify(answers);
        payload.answer.form_id = form.form_id;
        payload.answer.store_id = form.store_id;
        payload.answer.customer_id = '1';
        payload.answer.form_name = form.title;
        payload.answer.form_code = 'help-us';
        setPayload(payload);
        if (form.form_json[activeIndex+1]) {
            setActiveIndex(activeIndex + 1);
            setActiveTab(activeTab + 1);
        }else{
            //last element save form
            console.log(payload);
            let result: any = await SaveAnswers(payload);
            console.log(result);
            if(result.data) {
                history.push("/help-us/thank-you");
            }
        }
    }

    return (
        <>
            <div className="container help-us-inner">
                <figure className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="606" height="134" viewBox="0 0 606 134">
                        <text id="Help_us" data-name="Help us" transform="translate(303 98)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                            <tspan x="-301.4" y="0">Help us</tspan>
                        </text>
                    </svg>
                </figure>
                <div className="row">
                    <div className="col-md-8 offset-md-2 mt-5 help-us-content py-4">
                        <ul className="counter-list">
                            {form.form_json.map((ques, i) => {
                                return (
                                    <li className={activeTab == (i+1) ? 'active' : ''} key={i}><span>{i+1}</span></li>
                                );
                            })}
                            
                        </ul>
                        <h3>{form.title}</h3>
                        {(form.form_json.length > 0) && <div className="question-sec">
                            <h4>{form.form_json[activeIndex][0].label}</h4>
                            <div className="select-answer">
                                {form.form_json[activeIndex][0].values.map((opt, i) => {
                                    return (
                                        <button key={i} onClick={() => { optionHandler(i); }}>{opt.label}</button>
                                    );
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HelpUs;
