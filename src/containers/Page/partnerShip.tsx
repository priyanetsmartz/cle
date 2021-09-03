import { useEffect, useState } from 'react';
import { Pages } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { Link } from "react-router-dom";
import { getCookie } from "../../helpers/session";
const { openSignUp } = appAction;

function Partnership(props) {
    const language = getCookie('currentLanguage');
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    useEffect(() => {
        async function fetchMyAPI() {
            let lang = props.languages ? props.languages : language;
            let result: any = await Pages('partnership', lang);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])

    const handleClick = (e) => {
        e.preventDefault();
        const { openSignUp } = props;
        openSignUp(true);
    }
    return (
        <div className="container about-inner">
            <figure className="text-center partnership-title page-head">

                <svg xmlns="http://www.w3.org/2000/svg" width="1118" height="134" viewBox="0 0 1118 134">
                    <text id="{pagesData.title}" data-name="{pagesData.title}" transform="translate(559 98)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book"><tspan x="-557.48" y="0">{pagesData.title}</tspan></text> </svg>

            </figure>
            <div dangerouslySetInnerHTML={{ __html: pagesData.content }} />
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
            <div className="join-cle-bottom">
                <Link to="/contact-us" ><figure className="join-cle-text">
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
                </Link>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    let signupModel = '', languages = '';
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    // console.log(signupModel)
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        signupModel: signupModel,
        languages: languages

    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(Partnership);