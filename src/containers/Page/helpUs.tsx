import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { GetHelpUsForm } from '../../redux/pages/allPages';

function HelpUs() {
    const [activeTab, setActiveTab] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [form, setForm] = useState({
        "title":"",
        "form_json":[]
    });

    useEffect(() => {
        async function getData() {
            let result: any = await GetHelpUsForm();
            console.log(result);
            setForm(result.data);
        }
        getData()

    }, [])

    const optionHandler = (optionIndex) => {
        // console.log(questions[activeIndex].options[optionIndex]);
        // if (questions[activeIndex + 1]) {
        //     setActiveIndex(activeIndex + 1);
        //     setActiveTab(activeTab + 1);
        // }
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
                        <div className="question-sec">
                            <h4>{form.form_json[activeIndex].question}</h4>
                            <div className="select-answer">
                                {form.form_json[activeIndex].values.map((opt, i) => {
                                    return (
                                        <button key={opt.optionId} onClick={() => { optionHandler(i); }}>{opt.label}</button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HelpUs;
