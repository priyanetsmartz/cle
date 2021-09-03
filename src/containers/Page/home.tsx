import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/allPages';
import appAction from "../../redux/app/actions";
// import homeBg from "../../image/home-watch-bg.png";
import homeVideo from "../../image/Website1440px.mp4"
import homeVideomobile from "../../image/Website(mobile)800px.mp4"
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import Modal from "react-bootstrap/Modal";
const { openSignUp } = appAction;

function Home(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    const [onLogin, setOnLogin] = useState(false);
    const [isModalshow, setIsModalShow] = useState(false);
    useEffect(() => {
        let pageIdentifier = 'home';
        async function fetchMyAPI() {
            let result: any = await Pages(pageIdentifier, props.languages);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
    }, [props.languages])

    const handleClick = (e) => {
        e.preventDefault()
        const { openSignUp } = props;
        openSignUp(true);
    }
    useEffect(() => {
        let tokenCheck = localStorage.getItem('id_token');
        let tokenCheckFilter = !props.helpusVal ? tokenCheck : props.helpusVal;
        if (!tokenCheckFilter) {
            setOnLogin(false);
        } else {
            setOnLogin(true);
        }

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    })

    const toggleModeal = () => {
        setIsModalShow(!isModalshow);
    };

    return (
        <div className="homescreen-bg">

            <video autoPlay loop className="home-video-desktop" muted playsInline>
                <source src={homeVideo} type="video/mp4" />
                Your browser does not support HTML video.
            </video>
            <video className="home-video-mobile" autoPlay loop muted playsInline>
                <source src={homeVideomobile} type="video/mp4" />
                Your browser does not support HTML video.
            </video>
            <div className="position-absolute container top-50 start-50 translate-middle home-inner-text">
                <figure className="time-is-now">
                    <svg xmlns="http://www.w3.org/2000/svg" width="616" height="317.5" viewBox="0 0 616 317.5">
                        <g id="Group_805" data-name="Group 805" transform="translate(-703 -220.5)">
                            <text id="YOUR" transform="translate(704 350.5)" fill="none" stroke="#fff" strokeWidth="1" fontSize="147" fontFamily="Monument Extended" fontWeight="700"><IntlMessages id="home.time" /></text>
                            <text id="NEXT" transform="translate(862 446)" fill="#fff" fontSize="114" fontFamily="Monument Extended" fontWeight="700"><tspan x="0" y="0"><IntlMessages id="home.now" /></tspan></text>
                            <text id="GENERATION" transform="translate(734 494)" fill="#fff" stroke="#fff" strokeWidth="1" fontSize="48" fontFamily="Monument Extended"><tspan x="0" y="0"><IntlMessages id="home.is" /></tspan></text>
                            <text id="New_luxury_marketplace" data-name="New luxury marketplace" transform="translate(867 532)" fill="#fff" fontSize="20" fontFamily="Monument Extended"><tspan x="0" y="0"><IntlMessages id="home.slogan" /></tspan></text>
                        </g>
                    </svg>

                </figure>
                <figure className="play-video-now" onClick={toggleModeal}>
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
                {!onLogin && <div className="position-absolute mx-auto sign-up-btn">
                    <Link className="" to="/" onClick={(e) => { handleClick(e); }} role="button"><IntlMessages id="sign_up_now" /></Link>
                </div>}
            </div>
        </div>
    );
}
function mapStateToProps(state) {
    let signupModel = '', languages = '', helpusVal;
    //console.log(state.Auth);
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    if (state && state.Auth && state.Auth.idToken) {
        helpusVal = state.Auth.idToken;
    }
    // console.log(state.LanguageSwitcher)
    return {
        signupModel: signupModel,
        languages: languages,
        helpusVal: helpusVal

    };
}
export default connect(
    mapStateToProps,
    { openSignUp }
)(Home);

