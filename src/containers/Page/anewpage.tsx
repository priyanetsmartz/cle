import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages, GetHelpUsForm, SaveAnswers } from '../../redux/pages/allPages';
import appAction from "../../redux/app/actions";
import homeBg from "../../image/home-watch-bg.png";
import { Link, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { MagazineList } from '../../redux/pages/magazineList';
import partnershipImage from "../../image/partnership-page-pic.png";
import social1 from "../../image/checkout-social-1.png";
import social2 from "../../image/checkout-social-2.png";
import social3 from "../../image/checkout-social-3.png";
import social4 from "../../image/checkout-social-4.png";
import social5 from "../../image/checkout-social-5.png";
import social6 from "../../image/checkout-social-6.png";
import social7 from "../../image/checkout-social-7.png";
const { openSignUp } = appAction;

function Home(props) {
    let history = useHistory();
    const [pagesData, SetPagesData] = useState({ title: '', content: '' });
    const [items, setItems] = useState([]);

    const [activeTab, setActiveTab] = useState(1);
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
    useEffect(() => {
        let pageIdentifier = 'about-us';
        async function fetchMyAPI() {
            let result: any = await Pages(pageIdentifier, props.languages);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
    }, [props.match.params.id, props.languages])



    useEffect(() => {
        async function getData() {
            let result: any = await MagazineList();
            setItems(result.data);
        }
        getData()

    }, [])

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
            value: form.form_json[activeIndex][0].values[optionIndex].label,
            label: form.form_json[activeIndex][0].label,
            type: form.form_json[activeIndex][0].type
        }

        answers[form.form_json[activeIndex][0].name] = tempObj
        setAnswers(answers);
        payload.answer.response_json = JSON.stringify(answers);
        payload.answer.form_id = form.form_id;
        payload.answer.store_id = form.store_id;
        payload.answer.customer_id = '1';
        payload.answer.form_name = form.title;
        payload.answer.form_code = 'help-us';
        setPayload(payload);
        if (form.form_json[activeIndex + 1]) {
            setActiveIndex(activeIndex + 1);
            setActiveTab(activeTab + 1);
        } else {
            //last element save form
            console.log(payload);
            let result: any = await SaveAnswers(payload);
            console.log(result);
            if (result.data) {
                history.push("/help-us/thank-you");
            }
        }
    }
    const handleClick = () => {
        const { openSignUp } = props;
        openSignUp(true);
    }

    return (
        <>
            <div className="homescreen-bg">
                <img src={homeBg} alt="homepage" />
                <div className="position-absolute container top-50 start-50 translate-middle home-inner-text">
                    <figure className="time-is-now">
                        <svg xmlns="http://www.w3.org/2000/svg" width="488" height="307.5" viewBox="0 0 488 307.5">
                            <g id="Group_793" data-name="Group 793" transform="translate(-703 -190.5)">
                                <text id="Time" transform="translate(704 350.5)" fill="none" stroke="#2e2baa" strokeWidth="1"
                                    fontSize="147" fontFamily="SegoeUI-Bold, Segoe UI" fontWeight="700">
                                    <tspan x="0" y="0">TIME</tspan>
                                </text>
                                <text id="NOW_" data-name="NOW!" transform="translate(862 458)" fill="#2e2baa" fontSize="114"
                                    fontFamily="SegoeUI-Bold, Segoe UI" fontWeight="700">
                                    <tspan x="0" y="0">NOW!</tspan>
                                </text>
                                <text id="Is" transform="translate(788 412)" fill="#2e2baa" stroke="#2e2baa" strokeWidth="1" fontSize="48"
                                    fontFamily="SegoeUI, Segoe UI">
                                    <tspan x="0" y="0">IS</tspan>
                                </text>
                                <text id="New_luxury_marketplace" data-name="New luxury marketplace" transform="translate(867 493)"
                                    fill="#2e2baa" fontSize="20" fontFamily="SegoeUI, Segoe UI">
                                    <tspan x="0" y="0">New luxury marketplace</tspan>
                                </text>
                            </g>
                        </svg>
                    </figure>
                    <figure className="play-video-now">
                        <svg xmlns="http://www.w3.org/2000/svg" width="98.73" height="100.606" viewBox="0 0 98.73 100.606">
                            <g id="play" transform="translate(-620.777 -344.659)">
                                <circle id="Ellipse_2" data-name="Ellipse 2" cx="40" cy="40" r="40" transform="translate(630 355)"
                                    fill="none" />
                                <path id="Polygon_1" data-name="Polygon 1" d="M17.5,0,35,28H0Z" transform="translate(688 378) rotate(90)"
                                    fill="#2e2baa" />
                                <path id="Path_299" data-name="Path 299"
                                    d="M1.063,12.778a2.445,2.445,0,0,1,1.36-.4,2.847,2.847,0,0,1,1.464.451,2.831,2.831,0,0,1,1.067,1.084,2.453,2.453,0,0,1,.276,1.39A3.51,3.51,0,0,1,4.7,16.813L2.329,20.725l1.88,1.141-.73,1.2-6.611-4.011,3.1-5.116A3.506,3.506,0,0,1,1.063,12.778Zm2.276,3.864a5.427,5.427,0,0,0,.444-.882,1.317,1.317,0,0,0,.029-.832,1.444,1.444,0,0,0-.712-.8,1.464,1.464,0,0,0-1.042-.265,1.309,1.309,0,0,0-.729.407,5.4,5.4,0,0,0-.577.8L-1.33,18.5l2.586,1.569Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_300" data-name="Path 300" d="M9.014,14.694,2.3,9.007l.889-1.049L9.9,13.645Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_301" data-name="Path 301"
                                    d="M11.67,3.276A2.579,2.579,0,0,1,13.4,3.183a3.72,3.72,0,0,1,1.655,1.188L17.19,6.855l-1.042.9-.517-.6a16.054,16.054,0,0,1-1.149,1.962A8.688,8.688,0,0,1,13,10.739a3.932,3.932,0,0,1-2.085,1.076,1.9,1.9,0,0,1-1.66-.755,1.8,1.8,0,0,1-.3-2A6.307,6.307,0,0,1,10.735,6.81a12.564,12.564,0,0,1,2.98-1.884,1.37,1.37,0,0,0-1.6-.431,5.535,5.535,0,0,0-1.731,1.033A11.159,11.159,0,0,0,9.252,6.664,11.735,11.735,0,0,0,8.16,8.186l-1.094-.5a15.538,15.538,0,0,1,1.215-1.7,12.121,12.121,0,0,1,1.43-1.449A7.014,7.014,0,0,1,11.67,3.276Zm2.084,4.891a19.408,19.408,0,0,0,1.16-1.849l-.453-.525A14.361,14.361,0,0,0,13,6.565a10.921,10.921,0,0,0-1.445,1.063,5.11,5.11,0,0,0-1.22,1.4.885.885,0,0,0,.046,1.064.789.789,0,0,0,.9.286,4,4,0,0,0,1.262-.811A7.835,7.835,0,0,0,13.754,8.167Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_302" data-name="Path 302"
                                    d="M21.491-2.7l1.366-.71-.262,8.033a7.39,7.39,0,0,1-.168,1.514,2.89,2.89,0,0,1-.516,1.105,3.049,3.049,0,0,1-1.042.833,8.954,8.954,0,0,1-.943.428q-.435.165-1.023.346L18.35,7.788a9.048,9.048,0,0,0,1.736-.667,1.983,1.983,0,0,0,.873-.8,3.172,3.172,0,0,0,.283-1.387l.006-.275-.693.36L14.386,1l1.4-.726,5.493,3.579Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_303" data-name="Path 303"
                                    d="M35.6-.613l2.524-5.868,1.532-.165L36.734.118l-2.1.225L30.353-5.648l1.531-.164Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_304" data-name="Path 304"
                                    d="M41.238.012l.305-6.406,1.373.066L42.611.078Zm.346-7.252.072-1.538,1.373.066-.072,1.538Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_305" data-name="Path 305"
                                    d="M53.151-7.1l1.345.287L52.664,1.791,51.319,1.5,51.551.418a3.1,3.1,0,0,1-1.54.685A5.708,5.708,0,0,1,47.906,1,5.493,5.493,0,0,1,45.93.195a3.2,3.2,0,0,1-1.186-1.428,3.238,3.238,0,0,1-.128-1.961,3.258,3.258,0,0,1,.917-1.751A3.217,3.217,0,0,1,47.2-5.766a5.5,5.5,0,0,1,2.134.066,5.719,5.719,0,0,1,1.963.766,3.1,3.1,0,0,1,1.128,1.253ZM50.859-.218a1.882,1.882,0,0,0,1.126-1.408,1.883,1.883,0,0,0-.455-1.745,3.782,3.782,0,0,0-2.089-1.046,3.608,3.608,0,0,0-2.289.109,1.92,1.92,0,0,0-1.084,1.423,1.921,1.921,0,0,0,.411,1.74A3.6,3.6,0,0,0,48.526-.113,3.789,3.789,0,0,0,50.859-.218Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_306" data-name="Path 306"
                                    d="M60.047,3.858a1.836,1.836,0,0,0,1.2-.35l1.33.659a2.744,2.744,0,0,1-2.028.922,5.791,5.791,0,0,1-2.807-.7,5.642,5.642,0,0,1-2.572-2.24A2.916,2.916,0,0,1,55.2-.693a3.085,3.085,0,0,1,1.363-1.449,3.442,3.442,0,0,1,1.925-.328,6.354,6.354,0,0,1,2.2.667A5.374,5.374,0,0,1,63.2.427a3.348,3.348,0,0,1-.212,3.124L56.39.277a1.787,1.787,0,0,0,.148,1.669,4.318,4.318,0,0,0,1.746,1.37A4.463,4.463,0,0,0,60.047,3.858ZM56.968-.689l5.114,2.536A1.706,1.706,0,0,0,61.745.434a4.4,4.4,0,0,0-1.58-1.183Q58.026-1.809,56.968-.689Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_307" data-name="Path 307"
                                    d="M63.795,6.876a2.927,2.927,0,0,1,.718-2.739A2.944,2.944,0,0,1,67.1,2.981,5.566,5.566,0,0,1,70.18,4.448a5.544,5.544,0,0,1,1.941,2.8A2.95,2.95,0,0,1,71.4,9.983a2.933,2.933,0,0,1-2.583,1.155,5.57,5.57,0,0,1-3.07-1.467A5.593,5.593,0,0,1,63.795,6.876Zm4.81,2.909a1.91,1.91,0,0,0,1.659-.763,1.923,1.923,0,0,0,.492-1.769A3.838,3.838,0,0,0,69.4,5.37a3.846,3.846,0,0,0-2.085-1.043,1.918,1.918,0,0,0-1.666.771,1.906,1.906,0,0,0-.489,1.765,3.886,3.886,0,0,0,1.371,1.886A3.831,3.831,0,0,0,68.605,9.785Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_308" data-name="Path 308"
                                    d="M81.784,20.858a3.291,3.291,0,0,1-1.809,2.135l-2.8,1.551-.667-1.2,2.531-1.4A2.584,2.584,0,0,0,80.4,20.485a2.92,2.92,0,0,0-.486-2.138A4.013,4.013,0,0,0,78.065,16.5a2.51,2.51,0,0,0-2.315.2l-2.232,1.236-.667-1.2,5.61-3.108.666,1.2-1.251.693a4.011,4.011,0,0,1,1.835.769,5.511,5.511,0,0,1,1.458,1.77A4.14,4.14,0,0,1,81.784,20.858Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_309" data-name="Path 309"
                                    d="M78.509,26.538a3.273,3.273,0,0,1,4.944-1.289,5.564,5.564,0,0,1,1.677,2.967,5.542,5.542,0,0,1-.017,3.4,3.283,3.283,0,0,1-4.944,1.288A5.56,5.56,0,0,1,78.5,29.944,5.583,5.583,0,0,1,78.509,26.538Zm2.266,5.144a2.178,2.178,0,0,0,3.215-.838,3.831,3.831,0,0,0-.031-2.323,3.857,3.857,0,0,0-1.108-2.052,2.183,2.183,0,0,0-3.221.839,3.885,3.885,0,0,0,.039,2.332A3.842,3.842,0,0,0,80.775,31.682Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_310" data-name="Path 310"
                                    d="M80.753,45.246l5.369,2.7-.061,1.473-6.287-3.16.087-2.088,5.2-2.248-5-2.687.087-2.088,6.53-2.622-.062,1.462-5.577,2.254L86.409,41.1l-.073,1.748Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_311" data-name="Path 311"
                                    d="M77.97,68.554A2.437,2.437,0,0,1,76.6,68.9a3.114,3.114,0,0,1-2.476-1.621,2.436,2.436,0,0,1-.227-1.4,3.472,3.472,0,0,1,.58-1.488l2.506-3.828-1.84-1.206.771-1.177,6.47,4.237L79.1,67.428A3.508,3.508,0,0,1,77.97,68.554Zm-2.141-3.94a5.592,5.592,0,0,0-.475.865,1.332,1.332,0,0,0-.057.831,1.447,1.447,0,0,0,.684.823,1.467,1.467,0,0,0,1.033.3,1.3,1.3,0,0,0,.742-.381,5.435,5.435,0,0,0,.6-.782l2.2-3.358-2.531-1.658Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_312" data-name="Path 312" d="M70.075,66.383,76.588,72.3l-.925,1.017L69.15,67.4Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_313" data-name="Path 313"
                                    d="M67.047,77.681a2.584,2.584,0,0,1-1.729.033,3.731,3.731,0,0,1-1.613-1.244l-2.052-2.556,1.073-.861.495.618a16,16,0,0,1,1.216-1.921,8.624,8.624,0,0,1,1.537-1.573A3.931,3.931,0,0,1,68.1,69.172a1.9,1.9,0,0,1,1.633.812A1.8,1.8,0,0,1,69.961,72,6.321,6.321,0,0,1,68.1,74.181a12.579,12.579,0,0,1-3.043,1.78,1.37,1.37,0,0,0,1.582.486,5.517,5.517,0,0,0,1.765-.973,11.1,11.1,0,0,0,1.172-1.1,11.6,11.6,0,0,0,1.145-1.483l1.076.532a15.4,15.4,0,0,1-1.273,1.657,12.136,12.136,0,0,1-1.479,1.4A7.068,7.068,0,0,1,67.047,77.681Zm-1.914-4.959a18.935,18.935,0,0,0-1.223,1.806l.434.54a14.23,14.23,0,0,0,1.487-.72,10.985,10.985,0,0,0,1.48-1.013,5.077,5.077,0,0,0,1.267-1.356.884.884,0,0,0-.009-1.065.79.79,0,0,0-.888-.316,3.992,3.992,0,0,0-1.289.767A7.751,7.751,0,0,0,65.133,72.722Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_314" data-name="Path 314"
                                    d="M57.011,83.316l-1.391.663.543-8.02a7.353,7.353,0,0,1,.221-1.506,2.926,2.926,0,0,1,.554-1.087,3.063,3.063,0,0,1,1.072-.8,8.7,8.7,0,0,1,.957-.395q.441-.149,1.034-.31l.516,1.082a9.152,9.152,0,0,0-1.759.607,1.99,1.99,0,0,0-.9.769,3.214,3.214,0,0,0-.331,1.377l-.015.275.7-.335,6.025,4.233-1.421.677-5.364-3.769Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_315" data-name="Path 315"
                                    d="M42.975,80.74l-2.727,5.778-1.536.11,3.159-6.657,2.107-.153,4.071,6.137-1.536.11Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_316" data-name="Path 316"
                                    d="M36.763,87.155l-.126,1.534-1.371-.113.127-1.534Zm.6-7.236-.526,6.392L35.462,86.2l.527-6.39Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_317" data-name="Path 317"
                                    d="M25.211,86.615l-1.334-.333,2.133-8.538,1.334.333-.269,1.078a3.08,3.08,0,0,1,1.563-.63,5.7,5.7,0,0,1,2.1.173,5.5,5.5,0,0,1,1.947.878,3.093,3.093,0,0,1,1.194,3.433,3.264,3.264,0,0,1-.979,1.718,3.213,3.213,0,0,1-1.692.761,5.5,5.5,0,0,1-2.131-.141,5.713,5.713,0,0,1-1.934-.834,3.091,3.091,0,0,1-1.083-1.291Zm2.533-6.8a2.01,2.01,0,0,0-.782,3.127,3.8,3.8,0,0,0,2.051,1.12,3.613,3.613,0,0,0,2.292-.029,2.092,2.092,0,0,0,.783-3.137,3.6,3.6,0,0,0-2.009-1.1A3.786,3.786,0,0,0,27.744,79.815Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_318" data-name="Path 318"
                                    d="M18.708,75.421a1.836,1.836,0,0,0-1.21.308l-1.307-.706a2.751,2.751,0,0,1,2.059-.85,5.787,5.787,0,0,1,2.781.8A5.637,5.637,0,0,1,23.523,77.3a2.918,2.918,0,0,1-.131,2.836,3.081,3.081,0,0,1-1.413,1.4,3.436,3.436,0,0,1-1.935.261,6.378,6.378,0,0,1-2.174-.743,5.378,5.378,0,0,1-2.437-2.318,3.353,3.353,0,0,1,.32-3.115l6.485,3.5a1.788,1.788,0,0,0-.09-1.674,4.312,4.312,0,0,0-1.7-1.43A4.442,4.442,0,0,0,18.708,75.421Zm2.919,4.652L16.6,77.359a1.7,1.7,0,0,0,.287,1.424,4.409,4.409,0,0,0,1.538,1.238Q20.53,81.155,21.627,80.073Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_319" data-name="Path 319"
                                    d="M15.078,72.282A2.929,2.929,0,0,1,14.268,75a2.945,2.945,0,0,1-2.629,1.067A5.568,5.568,0,0,1,8.614,74.49,5.542,5.542,0,0,1,6.77,71.63a2.945,2.945,0,0,1,.819-2.713,2.928,2.928,0,0,1,2.62-1.065,5.558,5.558,0,0,1,3.018,1.571A5.587,5.587,0,0,1,15.078,72.282ZM10.371,69.21a1.912,1.912,0,0,0-1.684.706,1.919,1.919,0,0,0-.552,1.751A3.833,3.833,0,0,0,9.428,73.6a3.853,3.853,0,0,0,2.05,1.114A1.921,1.921,0,0,0,13.169,74a1.905,1.905,0,0,0,.549-1.747,3.885,3.885,0,0,0-1.306-1.932A3.828,3.828,0,0,0,10.371,69.21Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_320" data-name="Path 320"
                                    d="M-2.425,57.678A3.293,3.293,0,0,1-.542,55.607l2.853-1.452.624,1.225L.356,56.693A2.589,2.589,0,0,0-1.057,58.1a2.925,2.925,0,0,0,.412,2.154A4.013,4.013,0,0,0,1.14,62.158a2.512,2.512,0,0,0,2.321-.121l2.274-1.158L6.359,62.1.645,65.015.021,63.79l1.274-.649a4.012,4.012,0,0,1-1.807-.833,5.517,5.517,0,0,1-1.4-1.82A4.139,4.139,0,0,1-2.425,57.678Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_321" data-name="Path 321"
                                    d="M1.046,52.112a2.927,2.927,0,0,1-2.223,1.753,2.943,2.943,0,0,1-2.763-.638A5.57,5.57,0,0,1-5.512,50.2a5.537,5.537,0,0,1,.136-3.4,2.95,2.95,0,0,1,2.23-1.749,2.935,2.935,0,0,1,2.757.635,5.57,5.57,0,0,1,1.565,3.02A5.585,5.585,0,0,1,1.046,52.112Zm-2.085-5.22A1.908,1.908,0,0,0-2.822,46.5a1.923,1.923,0,0,0-1.459,1.115,3.836,3.836,0,0,0-.05,2.322A3.853,3.853,0,0,0-3.3,52.028a1.919,1.919,0,0,0,1.794.388A1.9,1.9,0,0,0-.048,51.3,3.889,3.889,0,0,0,0,48.971,3.826,3.826,0,0,0-1.039,46.892Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                                <path id="Path_322" data-name="Path 322"
                                    d="M-.549,33.358l-5.275-2.883L-5.712,29,.463,32.376.305,34.46l-5.277,2.069,4.9,2.855-.159,2.085-6.614,2.4.111-1.459,5.651-2.063-5.263-3.037.133-1.745Z"
                                    transform="translate(655.45 340.417) rotate(30)" fill="#2e2baa" />
                            </g>
                        </svg>

                    </figure>
                    <div className="position-absolute mx-auto sign-up-btn">
                        <Link className="" to={"#"} onClick={() => { handleClick(); }} role="button"><IntlMessages id="sign_up_now" /></Link>
                    </div>
                </div>
            </div>
            {/* about us */}
            <div className="container about-inner">
                <figure className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                        <text id="About_CLé" data-name="About CLé" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                            <tspan x="-423.555" y="0">{pagesData.title}</tspan>
                        </text>
                    </svg>
                </figure>
                <div dangerouslySetInnerHTML={{ __html: pagesData.content }} />
                {props.match.params.id === 'about-us' && (
                    <div><Link to={"#"} className="signup-btn" onClick={() => { handleClick(); }}><IntlMessages id="aboutus.sign_up_now" /></Link></div>
                )}
            </div>
            {/* magazine */}
            <div className="container magazine-inner" id="/magazine">
                <figure className="offset-md-1 ps-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="770" height="134" viewBox="0 0 770 134">
                        <text id="Magazine" transform="translate(385 98)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="110"
                            fontFamily="Monument Extended Book">
                            <tspan x="-383.515" y="0"><IntlMessages id="magazine.header" /></tspan>
                        </text> </svg>
                </figure>
                {items.length > 0 && (
                    <>
                        <div className="row my-3 mag-first-sec">
                            {items.map((item, i) => {
                                return (
                                    <div className={"col-md-5 " + (((i % 2) == 0) ? 'offset-md-1' : 'mt-5')} key={i}>
                                        <div className="blog-sec-main">
                                            <div className="mag-blog-pic"><img src={item.list_thumbnail} /></div>
                                            <h3 className="mag-blog-title mt-5 mb-3">{item.title}</h3>
                                            <p className="mag-blog-desc d-none">{item.short_content}...</p>
                                            <Link to={"/magazine/" + item.post_id} className="signup-btn"><IntlMessages id="magazine.read_more" /></Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="row mt-5">
                            <div className="col-12 text-center">
                                <Link to={"/magazine/see-all"} className="signup-btn" href=""><IntlMessages id="magazine.see_all_articles" /></Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* partnetship */}
            <div className="container magazine-inner">
                <figure className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                        <text id="About_CLé" data-name="About CLé" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                            <tspan x="-423.555" y="0">Partnetship</tspan>
                        </text>
                    </svg>
                </figure>
                <div className="row my-3 mag-first-sec">
                    <div className="col-md-1">
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="88" height="442" viewBox="0 0 88 442">
                                <g id="Component_86_1" data-name="Component 86 – 1" transform="translate(2 2)">
                                    <text id="Become" transform="translate(62 219) rotate(-90)" fill="#2E2BAA" stroke="#2E2BAA" strokeWidth="1" fontSize="72" fontFamily="Monument Extended" fontWeight="700"><tspan x="-219.24" y="0">Become</tspan></text>
                                </g>
                            </svg>
                        </figure>
                    </div>
                    <div className="col-md-11">
                        <div className="partner-main-div mt-5">
                            <h1>How to become a partner?</h1>
                            <div className="see-more-sec mt-5">
                                <div className="squares mx-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17.414" height="228.801" viewBox="0 0 17.414 228.801">
                                        <g id="Group_767" data-name="Group 767" transform="translate(-212 -336.5)">
                                            <path id="Union_1" data-name="Union 1" d="M0,22.181l7.091-7.091L0,8,8,0l8,8L8.908,15.091,16,22.181l-8,8Z" transform="translate(212.707 337.207)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                            <path id="Union_1-2" data-name="Union 1" d="M0,22.181l7.091-7.091L0,8,8,0l8,8L8.908,15.091,16,22.181l-8,8Z" transform="translate(212.707 365.873)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                            <path id="Union_1-3" data-name="Union 1" d="M0,22.181l7.091-7.091L0,8,8,0l8,8L8.908,15.091,16,22.181l-8,8Z" transform="translate(212.707 394.538)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                            <path id="Union_1-4" data-name="Union 1" d="M0,22.181l7.091-7.091L0,8,8,0l8,8L8.908,15.091,16,22.181l-8,8Z" transform="translate(212.707 423.204)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                            <path id="Union_2" data-name="Union 2" d="M0,36.181l7-7-7-7,7.091-7.091L0,8,8,0l8,8L8.909,15.091,16,22.182l-7,7,7,7-8,8Z" transform="translate(212.707 452.052)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                            <path id="Union_3" data-name="Union 3" d="M0,36.181l7-7-7-7,7.091-7.091L0,8,8,0l8,8L8.909,15.091,16,22.182l-7,7,7,7-8,8Z" transform="translate(212.707 493.232)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                            <path id="Union_4" data-name="Union 4" d="M0,22.181l7.091-7.091L0,8,8,0l8,8L8.909,15.091,16,22.181l-8,8Z" transform="translate(212.707 534.412)" fill="#fff" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1" />
                                        </g>
                                    </svg>
                                </div>
                                <div className="see-more-text">
                                    Here’s how it works!<br /><br />
                                    See more information in our Terms and Conditions.
                                </div>
                            </div>
                        </div>
                        <div className="partner-pic">
                            <img src={partnershipImage} />
                        </div>
                        <div className="join-cle-bottom">
                            <figure className="join-cle-text">
                                <svg xmlns="http://www.w3.org/2000/svg" width="180.31" height="180.802" viewBox="0 0 180.31 180.802">
                                    <g id="Group_773" data-name="Group 773" transform="translate(7.582 7.975)">
                                        <path id="Path_350" data-name="Path 350" d="M9.564,15.87a6.351,6.351,0,0,1,3.369,4.209q.453,2.48-1.579,5.9T6.934,30.191a6.337,6.337,0,0,1-5.315-.95L2.829,27.2a6.393,6.393,0,0,0,2.125.829,3.273,3.273,0,0,0,2.231-.493A7.177,7.177,0,0,0,9.54,24.9a7.211,7.211,0,0,0,1.2-3.344,3.3,3.3,0,0,0-.633-2.2,6.374,6.374,0,0,0-1.746-1.468l-3.788-2.25L1.114,21.466-.7,20.387l4.665-7.846Z" transform="translate(6.118 18.244)" fill="#2E2BAA" />
                                        <path id="Path_351" data-name="Path 351" d="M11.525,20.784A4.927,4.927,0,0,1,6.989,19.32a4.949,4.949,0,0,1-1.7-4.461A9.369,9.369,0,0,1,8.045,9.826a9.307,9.307,0,0,1,4.88-3A4.956,4.956,0,0,1,17.461,8.3a4.931,4.931,0,0,1,1.7,4.449,9.365,9.365,0,0,1-2.753,5.02A9.412,9.412,0,0,1,11.525,20.784Zm5.341-7.81a3.21,3.21,0,0,0-1.126-2.858,3.235,3.235,0,0,0-2.926-.994,6.468,6.468,0,0,0-3.293,2.107,6.494,6.494,0,0,0-1.95,3.408A3.231,3.231,0,0,0,8.712,17.51a3.212,3.212,0,0,0,2.919.986,6.535,6.535,0,0,0,3.3-2.127A6.441,6.441,0,0,0,16.866,12.974Z" transform="translate(11.401 13.081)" fill="#2E2BAA" />
                                        <path id="Path_352" data-name="Path 352" d="M11.577,5.461l-1.6-2.039,1.819-1.43,1.6,2.039Zm7.55,9.607L12.458,6.581l1.819-1.43,6.671,8.487Z" transform="translate(15.613 8.863)" fill="#2E2BAA" />
                                        <path id="Path_353" data-name="Path 353" d="M26.131-.817a5.547,5.547,0,0,1,3.624,3.012L32.41,6.882,30.4,8.023,28,3.787a4.352,4.352,0,0,0-2.469-2.271,4.925,4.925,0,0,0-3.592.854,6.755,6.755,0,0,0-3.068,3.146,4.225,4.225,0,0,0,.378,3.894l2.118,3.737-2.014,1.141L14.024,4.9l2.014-1.141L17.224,5.85a6.752,6.752,0,0,1,1.266-3.1A9.23,9.23,0,0,1,21.445.266,6.961,6.961,0,0,1,26.131-.817Z" transform="translate(19.214 6.293)" fill="#2E2BAA" />
                                        <path id="Path_354" data-name="Path 354" d="M29.041-3.286Q30.787-5.454,34.847-6.2A11.239,11.239,0,0,1,38.99-6.3,6.3,6.3,0,0,1,41.915-5a5.156,5.156,0,0,1,1.593,2.35l-2.513.465A3.093,3.093,0,0,0,39-4.038a7.456,7.456,0,0,0-3.773-.093Q29.532-3.076,30.4,1.6a4.293,4.293,0,0,0,2.131,3.278,6.889,6.889,0,0,0,4.438.365A7.283,7.283,0,0,0,40.436,3.8,3.209,3.209,0,0,0,41.645,1.33L44.176.861a5.214,5.214,0,0,1-.652,2.785,6.306,6.306,0,0,1-2.273,2.277,11.233,11.233,0,0,1-3.9,1.4q-4.061.754-6.467-.656a6.334,6.334,0,0,1-3-4.595A6.312,6.312,0,0,1,29.041-3.286Z" transform="translate(31.408 1.358)" fill="#2E2BAA" />
                                        <path id="Path_355" data-name="Path 355" d="M40.641-6.894l-.3,10.9,9.994.276-.059,2.11L37.911,6.051,38.272-6.96Z" transform="translate(40.456 0.903)" fill="#2E2BAA" />
                                        <path id="Path_356" data-name="Path 356" d="M61.853-2.079,61.386-.057,50.349-2.615,49.578.7,60.256,3.177l-.463,2L49.115,2.707l-.773,3.336L59.382,8.6l-.465,2L45.569,7.511,48.507-5.169Zm-9.72-4.056.427-1.84,7.349.183-.425,1.838Z" transform="translate(47.267)" fill="#2E2BAA" />
                                        <path id="Path_357" data-name="Path 357" d="M72.977,9.922a6.343,6.343,0,0,1-4.251,3.314q-2.483.425-5.879-1.653T58.692,7.109a6.338,6.338,0,0,1,1.018-5.3l2.022,1.236a6.427,6.427,0,0,0-.858,2.114,3.283,3.283,0,0,0,.465,2.237,7.214,7.214,0,0,0,2.609,2.388,7.21,7.21,0,0,0,3.331,1.243,3.28,3.28,0,0,0,2.2-.6A6.4,6.4,0,0,0,70.972,8.7l2.3-3.76L67.49,1.4l1.1-1.8,7.786,4.763Z" transform="translate(58.734 6.737)" fill="#2E2BAA" />
                                        <path id="Path_358" data-name="Path 358" d="M66.269,11.824a4.925,4.925,0,0,1,1.521-4.515,4.946,4.946,0,0,1,4.481-1.642,9.376,9.376,0,0,1,5,2.817,9.333,9.333,0,0,1,2.936,4.92,4.963,4.963,0,0,1-1.532,4.517,4.939,4.939,0,0,1-4.47,1.64,9.378,9.378,0,0,1-4.986-2.817A9.4,9.4,0,0,1,66.269,11.824Zm7.74,5.441a3.217,3.217,0,0,0,2.875-1.09,3.24,3.24,0,0,0,1.03-2.913,6.474,6.474,0,0,0-2.065-3.319A6.5,6.5,0,0,0,72.465,7.95a3.231,3.231,0,0,0-2.887,1.105,3.212,3.212,0,0,0-1.024,2.906,6.532,6.532,0,0,0,2.084,3.325A6.455,6.455,0,0,0,74.009,17.266Z" transform="translate(65.597 12.076)" fill="#2E2BAA" />
                                        <path id="Path_359" data-name="Path 359" d="M71.406,19.455l8.57-6.561,1.409,1.838-8.574,6.561Zm9.7-7.427,2.057-1.576,1.408,1.836-2.059,1.576Z" transform="translate(70.243 16.388)" fill="#2E2BAA" />
                                        <path id="Path_360" data-name="Path 360" d="M88.172,26.69a5.536,5.536,0,0,1-3.059,3.584l-4.719,2.6-1.117-2.027L83.545,28.5a4.375,4.375,0,0,0,2.3-2.441,4.931,4.931,0,0,0-.809-3.6,6.762,6.762,0,0,0-3.106-3.11,4.234,4.234,0,0,0-3.9.329l-3.762,2.069-1.117-2.027,9.458-5.2,1.117,2.029L81.622,17.7A6.75,6.75,0,0,1,84.705,19a9.245,9.245,0,0,1,2.445,2.987A6.96,6.96,0,0,1,88.172,26.69Z" transform="translate(71.799 19.997)" fill="#2E2BAA" />
                                        <path id="Path_361" data-name="Path 361" d="M90.075,29.661q2.145,1.774,2.841,5.845a11.258,11.258,0,0,1,.034,4.145,6.309,6.309,0,0,1-1.334,2.906,5.145,5.145,0,0,1-2.373,1.561L88.815,41.6a3.093,3.093,0,0,0,1.878-1.965,7.463,7.463,0,0,0,.144-3.773q-.98-5.71-5.67-4.908a4.291,4.291,0,0,0-3.3,2.09,6.867,6.867,0,0,0-.423,4.43,7.237,7.237,0,0,0,1.406,3.488A3.2,3.2,0,0,0,85.293,42.2l.433,2.535a5.211,5.211,0,0,1-2.777-.688,6.288,6.288,0,0,1-2.243-2.3,11.218,11.218,0,0,1-1.349-3.92q-.7-4.07.744-6.458a7.119,7.119,0,0,1,9.974-1.71Z" transform="translate(77.111 32.264)" fill="#2E2BAA" />
                                        <path id="Path_362" data-name="Path 362" d="M93.241,41.318l-10.9-.44-.4,9.991-2.108-.085.5-12.358,13,.525Z" transform="translate(77.736 41.263)" fill="#2E2BAA" />
                                        <path id="Path_363" data-name="Path 363" d="M90.625,62.466l-2.016-.493,2.7-11.007L88,50.155,85.39,60.8l-2-.489L86,49.668l-3.327-.814L79.979,59.859l-2-.489,3.259-13.306,12.641,3.095ZM94.8,52.795l1.833.45-.272,7.349-1.836-.45Z" transform="translate(76.091 48.055)" fill="#2E2BAA" />
                                        <path id="Path_364" data-name="Path 364" d="M76.162,73.4A6.353,6.353,0,0,1,72.9,69.1q-.391-2.488,1.731-5.855t4.527-4.1a6.331,6.331,0,0,1,5.286,1.086l-1.262,2.006a6.325,6.325,0,0,0-2.1-.886,3.3,3.3,0,0,0-2.243.436,7.182,7.182,0,0,0-2.422,2.577,7.225,7.225,0,0,0-1.287,3.314,3.287,3.287,0,0,0,.576,2.212,6.364,6.364,0,0,0,1.708,1.511l3.728,2.346,3.61-5.734,1.787,1.126-4.863,7.723Z" transform="translate(71.518 59.506)" fill="#2E2BAA" />
                                        <path id="Path_365" data-name="Path 365" d="M74.489,66.657a5.509,5.509,0,0,1,6.08,6.082A9.345,9.345,0,0,1,77.689,77.7a9.307,9.307,0,0,1-4.956,2.874,5.527,5.527,0,0,1-6.082-6.08,11.227,11.227,0,0,1,7.837-7.837Zm-5.537,7.672a3.662,3.662,0,0,0,3.954,3.952A8.2,8.2,0,0,0,78.284,72.9a3.673,3.673,0,0,0-3.958-3.962,6.547,6.547,0,0,0-3.353,2.042A6.444,6.444,0,0,0,68.951,74.329Z" transform="translate(65.951 66.302)" fill="#2E2BAA" />
                                        <path id="Path_366" data-name="Path 366" d="M65.254,71.721l6.452,8.653-1.855,1.383L63.4,73.1Zm7.3,9.8L74.105,83.6l-1.853,1.383L70.7,82.9Z" transform="translate(63.12 70.872)" fill="#2E2BAA" />
                                        <path id="Path_367" data-name="Path 367" d="M61.373,88.371a5.55,5.55,0,0,1-3.544-3.106l-2.535-4.752,2.042-1.092,2.292,4.3a4.346,4.346,0,0,0,2.409,2.333,4.921,4.921,0,0,0,3.612-.761A6.76,6.76,0,0,0,68.8,82.227a4.232,4.232,0,0,0-.276-3.9L66.5,74.534l2.042-1.09,5.078,9.524L71.58,84.06l-1.135-2.125A6.731,6.731,0,0,1,69.1,85a9.3,9.3,0,0,1-3.017,2.407A6.982,6.982,0,0,1,61.373,88.371Z" transform="translate(55.914 72.404)" fill="#2E2BAA" />
                                        <path id="Path_368" data-name="Path 368" d="M57.483,90.243q-1.8,2.123-5.878,2.768a11.289,11.289,0,0,1-4.147-.017,6.306,6.306,0,0,1-2.889-1.372,5.133,5.133,0,0,1-1.53-2.392l2.524-.4a3.089,3.089,0,0,0,1.942,1.9,7.44,7.44,0,0,0,3.769.191Q57,90.02,56.255,85.32a4.3,4.3,0,0,0-2.046-3.333,6.879,6.879,0,0,0-4.427-.478,7.288,7.288,0,0,0-3.507,1.36A3.212,3.212,0,0,0,45,85.3l-2.543.4a5.192,5.192,0,0,1,.725-2.768,6.265,6.265,0,0,1,2.328-2.214,11.235,11.235,0,0,1,3.937-1.3q4.081-.643,6.448.826a7.118,7.118,0,0,1,1.583,9.994Z" transform="translate(44.502 77.547)" fill="#2E2BAA" />
                                        <path id="Path_369" data-name="Path 369" d="M43.827,93.3l.588-10.89-9.983-.538.113-2.107,12.348.665-.7,13Z" transform="translate(37.362 78.023)" fill="#2E2BAA" />
                                        <path id="Path_370" data-name="Path 370" d="M24.668,90.408l.521-2.008,10.969,2.84.854-3.3L26.4,85.194l.516-1.989,10.612,2.747.858-3.316L27.417,79.795l.516-1.988L41.2,81.242l-3.263,12.6Zm9.615,4.306-.472,1.829-7.344-.374.474-1.827Z" transform="translate(28.68 76.284)" fill="#2E2BAA" />
                                        <path id="Path_371" data-name="Path 371" d="M14.635,75.785a6.343,6.343,0,0,1,4.336-3.2q2.494-.36,5.834,1.8t4.039,4.578a6.347,6.347,0,0,1-1.154,5.275L25.7,82.949a6.377,6.377,0,0,0,.913-2.09,3.29,3.29,0,0,0-.408-2.248,7.172,7.172,0,0,0-2.547-2.454,7.235,7.235,0,0,0-3.3-1.33,3.3,3.3,0,0,0-2.218.548,6.394,6.394,0,0,0-1.534,1.689l-2.4,3.7L19.9,84.445l-1.147,1.77-7.663-4.961Z" transform="translate(16.607 71.592)" fill="#2E2BAA" />
                                        <path id="Path_372" data-name="Path 372" d="M19.533,74.18a4.932,4.932,0,0,1-1.638,4.476,4.951,4.951,0,0,1-4.523,1.525,9.386,9.386,0,0,1-4.923-2.945,9.341,9.341,0,0,1-2.807-5,4.961,4.961,0,0,1,1.651-4.476A4.935,4.935,0,0,1,11.8,66.241a9.361,9.361,0,0,1,4.908,2.945A9.417,9.417,0,0,1,19.533,74.18Zm-7.6-5.64a3.209,3.209,0,0,0-2.9,1.015A3.236,3.236,0,0,0,7.929,72.44a6.471,6.471,0,0,0,1.978,3.374,6.488,6.488,0,0,0,3.331,2.078,3.23,3.23,0,0,0,2.913-1.028,3.205,3.205,0,0,0,1.1-2.877,6.531,6.531,0,0,0-2-3.38A6.455,6.455,0,0,0,11.936,68.54Z" transform="translate(11.706 65.923)" fill="#2E2BAA" />
                                        <path id="Path_373" data-name="Path 373" d="M4.363,72.032l-2.1,1.523L.906,71.682,3,70.159Zm9.888-7.175L5.518,71.195l-1.36-1.872,8.734-6.342Z" transform="translate(7.548 63.099)" fill="#2E2BAA" />
                                        <path id="Path_374" data-name="Path 374" d="M-1.524,60.794a5.548,5.548,0,0,1,3.149-3.5l4.786-2.475L7.475,56.87,3.15,59.106A4.345,4.345,0,0,0,.785,61.487,4.923,4.923,0,0,0,1.5,65.109,6.741,6.741,0,0,0,4.524,68.3a4.229,4.229,0,0,0,3.905-.227L12.245,66.1l1.062,2.056L3.719,73.11,2.655,71.054l2.139-1.105a6.753,6.753,0,0,1-3.049-1.383A9.239,9.239,0,0,1-.625,65.517,6.978,6.978,0,0,1-1.524,60.794Z" transform="translate(5.282 55.837)" fill="#2E2BAA" />
                                        <path id="Path_375" data-name="Path 375" d="M-3.851,56.852q-2.1-1.831-2.69-5.915a11.208,11.208,0,0,1,.074-4.145,6.305,6.305,0,0,1,1.408-2.87,5.156,5.156,0,0,1,2.413-1.5l.367,2.53a3.1,3.1,0,0,0-1.931,1.916,7.449,7.449,0,0,0-.24,3.767q.83,5.736,5.539,5.054a4.286,4.286,0,0,0,3.357-2,6.873,6.873,0,0,0,.54-4.419A7.266,7.266,0,0,0,3.67,45.745,3.208,3.208,0,0,0,1.256,44.44l-.37-2.547a5.212,5.212,0,0,1,2.758.759,6.264,6.264,0,0,1,2.184,2.36,11.2,11.2,0,0,1,1.245,3.954q.592,4.087-.911,6.437a6.337,6.337,0,0,1-4.708,2.813A6.309,6.309,0,0,1-3.851,56.852Z" transform="translate(0.788 44.346)" fill="#2E2BAA" />
                                        <path id="Path_376" data-name="Path 376" d="M-6.84,43.164l10.88.722.665-9.975,2.107.14L5.99,46.392-7,45.527Z" transform="translate(0.519 37.248)" fill="#2E2BAA" />
                                        <path id="Path_377" data-name="Path 377" d="M-5.761,33.641l-1.821-.5.469-7.338,1.821.5Zm4.434-9.556,2,.546L-2.311,35.562l3.285.9L3.863,25.887l1.982.54L2.958,37l3.3.9L9.248,26.974l1.982.54L7.619,40.731-4.937,37.3Z" transform="translate(0 28.51)" fill="#2E2BAA" />
                                    </g>
                                </svg>
                            </figure>
                            <div className="join-cle-logo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="67.1" height="24.705" viewBox="0 0 67.1 24.705">
                                    <path id="Path_3220" data-name="Path 3220" d="M638.983,621.174l.029-1.814-21.447,2.727v7.021h33.673c1.076,0,3.312,0,3.312,1.3s-2.236.963-3.453.963H615.485v0h-2.353V620.3h-2.215v11.066h-1.532a3.583,3.583,0,0,1-3.027-1.562,13.737,13.737,0,0,1-2.189-7.343s-4.711-1-8.508,4.125a2.02,2.02,0,0,0-.057,2.27,6.252,6.252,0,0,0,2.544,2.5,5.491,5.491,0,0,0-1.141-.047c-2.062,0-3.786.034-3.82-2.2-.055-3.617.02-5.521.02-5.521h-1.519v16.484a3.888,3.888,0,0,0,3.888,3.888h2.706c1.853,0,2.63-1.5,2.63-3.355l-.045-10.235a5.443,5.443,0,0,1-3.1-2c-.245-.414.282-.956.659-1.261a5.382,5.382,0,0,1,4.111-1.272s.11,5.807.113,9.06a9.6,9.6,0,0,0,3.311,7.788,5.535,5.535,0,0,0,3.6,1.328l.205,0,1.262-1.673,1.262,1.673h33.271c10.125,0,13.267,1.475,13.222-12.493-.075-4.58-1.294-5.158-3.068-6.008-1.6-.769-8.953-.656-9.548-.656H622.065v-1.33Z" transform="translate(-591.688 -619.36)" fill="#2E2BAA" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* helpus */}
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
                                    <li className={activeTab == (i + 1) ? 'active' : ''} key={i}><span>{i + 1}</span></li>
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
            {/* check out us */}
            <div className="container magazine-inner">
                <figure className="ps-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="850" height="134" viewBox="0 0 850 134">
                        <text id="Check_out" data-name="Check out" transform="translate(425 98)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                            <tspan x="-423.555" y="0">Check out</tspan>
                        </text>
                    </svg>
                </figure>

                <div className="social-title">
                    <h1>Our Social Media</h1>
                    <div className="social-icon-sec">
                        <ul>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="100.935" height="22" viewBox="0 0 100.935 22">
                                <g id="Group_725" data-name="Group 725" transform="translate(-517.065 -4492)">
                                    <path id="facebook"
                                        d="M16.883,7.758a9.415,9.415,0,0,1,4.8,1.3,9.6,9.6,0,0,1,2.4,14.494,9.68,9.68,0,0,1-5.361,3.2V19.929h1.863L21,17.245H18.181V15.488a1.528,1.528,0,0,1,.325-1.009,1.486,1.486,0,0,1,1.192-.453h1.7V11.674q-.037-.012-.7-.093a13.83,13.83,0,0,0-1.5-.093,3.75,3.75,0,0,0-2.694.961A3.714,3.714,0,0,0,15.5,15.206v2.039H13.35v2.684H15.5v6.829a9.447,9.447,0,0,1-5.81-3.2,9.585,9.585,0,0,1,2.4-14.494,9.418,9.418,0,0,1,4.8-1.3Z"
                                        transform="translate(509.682 4485.742)" fill="#2E2BAA" fillRule="evenodd" />
                                    <text id="Facebook-2" data-name="Facebook" transform="translate(541 4510)" fontSize="18"
                                        fontFamily="Lato-Semibold, Lato" fontWeight="600">
                                        <tspan x="0" y="0">Facebook</tspan>
                                    </text>
                                </g>
                            </svg></li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="103" height="22" viewBox="0 0 103 22">
                                <g id="Group_726" data-name="Group 726" transform="translate(-650.855 -4492)">
                                    <text id="Instagram" transform="translate(674.855 4510)" fontSize="18"
                                        fontFamily="Lato-Semibold, Lato" fontWeight="600">
                                        <tspan x="0" y="0">Instagram</tspan>
                                    </text>
                                    <g id="instagram-2" data-name="instagram" transform="translate(650.855 4493.5)">
                                        <g id="Group_34" data-name="Group 34" transform="translate(0)">
                                            <g id="Group_33" data-name="Group 33" transform="translate(0)">
                                                <path id="Path_15" data-name="Path 15"
                                                    d="M14.255,0h-9.5A4.764,4.764,0,0,0,0,4.75v9.5A4.765,4.765,0,0,0,4.755,19h9.5A4.765,4.765,0,0,0,19,14.25V4.75A4.764,4.764,0,0,0,14.255,0Zm3.167,14.25a3.17,3.17,0,0,1-3.167,3.167h-9.5A3.171,3.171,0,0,1,1.588,14.25V4.75A3.17,3.17,0,0,1,4.755,1.583h9.5A3.17,3.17,0,0,1,17.421,4.75Z"
                                                    transform="translate(-0.005)" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                        <g id="Group_36" data-name="Group 36" transform="translate(13.459 3.167)">
                                            <g id="Group_35" data-name="Group 35">
                                                <ellipse id="Ellipse_1" data-name="Ellipse 1" cx="1.187" cy="1.187" rx="1.187" ry="1.187"
                                                    fill="#2E2BAA" />
                                            </g>
                                        </g>
                                        <g id="Group_38" data-name="Group 38" transform="translate(4.75 4.75)">
                                            <g id="Group_37" data-name="Group 37">
                                                <path id="Path_16" data-name="Path 16"
                                                    d="M107.155,102.4a4.75,4.75,0,1,0,4.75,4.75A4.749,4.749,0,0,0,107.155,102.4Zm0,7.917a3.167,3.167,0,1,1,3.167-3.167A3.167,3.167,0,0,1,107.155,110.317Z"
                                                    transform="translate(-102.405 -102.4)" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg></li>
                            <li><svg xmlns="http://www.w3.org/2000/svg" width="85.393" height="22" viewBox="0 0 85.393 22">
                                <g id="Group_727" data-name="Group 727" transform="translate(-785.223 -4492)">
                                    <g id="Group_728" data-name="Group 728">
                                        <text id="Twitter" transform="translate(813.615 4510)" fontSize="18"
                                            fontFamily="Lato-Semibold, Lato" fontWeight="600">
                                            <tspan x="0" y="0">Twitter</tspan>
                                        </text>
                                        <path id="twitter-brands"
                                            d="M20.989,52.817c.015.208.015.416.015.623A13.548,13.548,0,0,1,7.362,67.082,13.549,13.549,0,0,1,0,64.93a9.919,9.919,0,0,0,1.158.059A9.6,9.6,0,0,0,7.11,62.94a4.8,4.8,0,0,1-4.483-3.325,6.047,6.047,0,0,0,.905.074,5.071,5.071,0,0,0,1.262-.163A4.8,4.8,0,0,1,.95,54.821v-.059a4.829,4.829,0,0,0,2.167.609,4.8,4.8,0,0,1-1.484-6.412,13.628,13.628,0,0,0,9.886,5.017,5.412,5.412,0,0,1-.119-1.1,4.8,4.8,0,0,1,8.3-3.28,9.439,9.439,0,0,0,3.043-1.158,4.782,4.782,0,0,1-2.108,2.642,9.612,9.612,0,0,0,2.761-.742A10.306,10.306,0,0,1,20.989,52.817Z"
                                            transform="translate(785.223 4445.418)" fill="#2E2BAA" />
                                    </g>
                                </g>
                            </svg></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="social-icon-list">
                <div className="social-icon-scroll">
                    <div className="social-pic-icon">
                        <img src={social1} />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social4} />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social2} />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social3} />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social5} />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social6} />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social7} />
                    </div>
                </div>
                <div className="social-icon-blue-bg"></div>
            </div>
        </>
    );
}
function mapStateToProps(state) {
    let signupModel = '', languages = '';
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    // console.log(state.LanguageSwitcher)
    return {
        signupModel: signupModel,
        languages: languages

    };
}
export default connect(
    mapStateToProps,
    { openSignUp }
)(Home);

