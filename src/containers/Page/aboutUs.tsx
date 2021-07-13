import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/pages';
import aboutUs from "../../image/about-Picture.png";
import CleLogoBlack from "../../image/CLE-logo-black.svg";

function AboutUs() {

    const [isModel, setISModel] = useState(false);

    useEffect(() => {
        console.log('ggg');
        async function fetchMyAPI() {
            let result = Pages("about-us");
            console.log(result);
        }
        // fetchMyAPI()
    }, [])

    const modelOpen = (e) => {
        e.preventDefault();
        setISModel(true)
    }

    const modelClose = (e) => {
        e.preventDefault();
        setISModel(false)
    }


    return (
        <div style={{marginTop:'5rem'}}>
                {/* About Us page structure  */}
                <div className="container about-inner">
                    <figure className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                            <text id="About_CLé" data-name="About CLé" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                                strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                                <tspan x="-423.555" y="0">About CLÉ</tspan>
                            </text>
                        </svg>
                    </figure>
                    <div className="row my-3">
                        <div className="col-md-5 offset-md-1">
                            <div className="blue-back-image">
                                <div className="about-inner-pic">
                                    <img src={aboutUs} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 offset-md-1">
                            <div className="about-content">
                                <h3>About CLé</h3>
                                <p>Discover the CLé fashion point of view with our edit of over 650+ established and innovative designers,
                                    from Prada, Gucci and Balenciaga to Saint Laurent, Halpern and Wales Bonner. We aim to be the most personal
                                    luxury shopping experience in the world – whether you join us online, via our app or at our pioneering
                                    retail and broadcasting destination.</p>
                                <a className="signup-btn" onClick={modelOpen}>Sign up Now</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* sign up modal */}
                {isModel && (<div className="modal fade signup-Modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <img src={CleLogoBlack} />
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={modelClose}></button>
                            </div>
                            <div className="modal-body signup_inner">
                                <h2>Sign Up</h2>
                                <p>& be the first one to know about our launch</p>
                                <div className="row g-3">
                                    <div className="col-sm-12">
                                        <input type="text" className="form-control" placeholder="Email Address*" aria-label="Email" />
                                    </div>
                                    <div className="input-group col-sm-12">
                                        <input type="text" className="form-control" placeholder="Create Password* (Min 6 Character)"
                                            aria-label="Create Password" aria-describedby="basic-addon2" />
                                        <span className="input-group-text" id="basic-addon2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22.869" height="18.296" viewBox="0 0 22.869 18.296">
                                                <path id="eye"
                                                    d="M11.436,14.29A5.126,5.126,0,0,1,6.33,9.534l-3.748-2.9A11.91,11.91,0,0,0,1.269,8.623a1.156,1.156,0,0,0,0,1.043,11.461,11.461,0,0,0,10.167,6.339,11.1,11.1,0,0,0,2.783-.374L12.365,14.2a5.151,5.151,0,0,1-.929.093ZM22.65,16.366,18.7,13.313a11.837,11.837,0,0,0,2.9-3.647,1.156,1.156,0,0,0,0-1.043A11.461,11.461,0,0,0,11.436,2.284,11.011,11.011,0,0,0,6.172,3.631L1.626.117a.572.572,0,0,0-.8.1l-.7.9a.572.572,0,0,0,.1.8L21.246,18.172a.572.572,0,0,0,.8-.1l.7-.9A.572.572,0,0,0,22.65,16.366Zm-6.565-5.074-1.4-1.086a3.386,3.386,0,0,0-4.149-4.357,1.7,1.7,0,0,1,.333,1.008,1.667,1.667,0,0,1-.055.357L8.179,5.182A5.085,5.085,0,0,1,11.436,4a5.143,5.143,0,0,1,5.146,5.146,5.024,5.024,0,0,1-.5,2.148Z"
                                                    transform="translate(-0.001 0.003)" opacity="0.33" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <a className="signup-btn">Sign up</a>
                                    </div>
                                </div>
                                <div className="or-bg">
                                    <div className="or-text">Or</div>
                                </div>
                                <div className="social-login">
                                    <a href="">
                                        <svg id="google-icon" xmlns="http://www.w3.org/2000/svg" width="18.62" height="19"
                                            viewBox="0 0 18.62 19">
                                            <path id="Path_299" data-name="Path 299"
                                                d="M139.67,108.7a8.141,8.141,0,0,0-.2-1.942H130.55v3.526h5.236a4.643,4.643,0,0,1-1.942,3.082l-.018.118,2.82,2.185.2.02a9.289,9.289,0,0,0,2.829-6.988"
                                                transform="translate(-121.05 -98.992)" fill="#4285F4" />
                                            <path id="Path_300" data-name="Path 300"
                                                d="M22.412,163.991a9.055,9.055,0,0,0,6.291-2.3l-3-2.322a5.623,5.623,0,0,1-3.293.95,5.719,5.719,0,0,1-5.4-3.948l-.111.009-2.932,2.269-.038.107a9.493,9.493,0,0,0,8.487,5.236"
                                                transform="translate(-12.912 -144.991)" fill="#34A853" />
                                            <path id="Path_301" data-name="Path 301"
                                                d="M4.1,77.5a5.848,5.848,0,0,1-.317-1.879,6.146,6.146,0,0,1,.306-1.879l-.005-.126L1.11,71.312l-.1.046a9.48,9.48,0,0,0,0,8.529L4.1,77.5"
                                                transform="translate(0 -66.123)" fill="#FBBC05" />
                                            <path id="Path_302" data-name="Path 302"
                                                d="M22.412,3.673a5.265,5.265,0,0,1,3.673,1.414L28.766,2.47A9.127,9.127,0,0,0,22.412,0a9.493,9.493,0,0,0-8.487,5.236L17,7.621a5.743,5.743,0,0,1,5.415-3.948"
                                                transform="translate(-12.912)" fill="#EB4335" />
                                        </svg>
                                        Continue with Google</a>
                                    <a href="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15.966" height="19" viewBox="0 0 15.966 19">
                                            <path id="apple-brands"
                                                d="M17.349,42.04a3.96,3.96,0,0,1,2.121-3.6,4.558,4.558,0,0,0-3.593-1.892c-1.506-.119-3.152.878-3.754.878-.636,0-2.1-.836-3.241-.836C6.515,36.632,4,38.482,4,42.244a10.572,10.572,0,0,0,.611,3.444c.543,1.557,2.5,5.374,4.547,5.311,1.069-.025,1.824-.759,3.215-.759,1.349,0,2.049.759,3.241.759,2.062-.03,3.835-3.5,4.352-5.061a4.2,4.2,0,0,1-2.617-3.9Zm-2.4-6.965A4,4,0,0,0,15.966,32a4.5,4.5,0,0,0-2.88,1.48A4.058,4.058,0,0,0,12,36.53,3.563,3.563,0,0,0,14.948,35.075Z"
                                                transform="translate(-4 -32)" />
                                        </svg>
                                        Continue with Apple</a>
                                    <a href="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
                                            <path id="facebook"
                                                d="M16.883,7.758a9.415,9.415,0,0,1,4.8,1.3,9.6,9.6,0,0,1,2.4,14.494,9.68,9.68,0,0,1-5.361,3.2V19.929h1.863L21,17.245H18.181V15.488a1.528,1.528,0,0,1,.325-1.009,1.486,1.486,0,0,1,1.192-.453h1.7V11.674q-.037-.012-.7-.093a13.83,13.83,0,0,0-1.5-.093,3.75,3.75,0,0,0-2.694.961A3.714,3.714,0,0,0,15.5,15.206v2.039H13.35v2.684H15.5v6.829a9.447,9.447,0,0,1-5.81-3.2,9.585,9.585,0,0,1,2.4-14.494,9.418,9.418,0,0,1,4.8-1.3Z"
                                                transform="translate(-7.383 -7.758)" fill="#3B5998" fillRule="evenodd" />
                                        </svg>
                                        Continue with Facebook</a>
                                </div>
                                <p className="signup-policy-links">By registering you agree with our <a href="">Terms & Conditions</a> and <a
                                    href="">Privacy Policy</a>.</p>
                            </div>
                            <div className="modal-footer signup_footer">
                                <a href="" className="sign-in-M">Member Sign In</a><a href="" className="B-partner">Become Partner</a>
                            </div>
                        </div>
                    </div>
                </div>)}

                {/* model menu */}
                {/* <div className="menu-section" style={{ display: 'none' }}>
                    <div className="container">
                        <div className="mt-5">
                            <div className="hamburger-close float-end">
                                <a href="" className="open-menu">
                                    <svg id="Close" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                        <rect id="Rectangle_498" data-name="Rectangle 498" width="52.217" height="4.351"
                                            transform="translate(3.077 0) rotate(45)" fill="#2e2baa" />
                                        <rect id="Rectangle_499" data-name="Rectangle 499" width="52.217" height="4.351"
                                            transform="translate(40 3.077) rotate(135)" fill="#2e2baa" />
                                    </svg>
                                </a>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <div className="row">
                            <div className="col-md-5 offset-md-1">
                                <ul className="left-menu-content">
                                    <li><a href="" className="main-menu">About CLé</a></li>
                                    <li><a href="" className="main-menu">Magazine</a></li>
                                    <li><a href="" className="main-menu">Partnership</a></li>
                                    <li><a href="" className="menu-btn">Sign in</a></li>
                                    <li>New here? <a href="" className="create-account">Create Account</a></li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <ul className="right-menu-content">
                                    <li><a href="" className="main-menu">Help Us</a></li>
                                    <li><a href="" className="main-menu">Check Us Out</a></li>
                                    <li><a href="" className="main-menu">Contact</a></li>
                                    <li>
                                        <div>Find Us</div>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21.42" height="21.419" viewBox="0 0 21.42 21.419">
                                                <path id="facebook"
                                                    d="M18.093,7.758A10.614,10.614,0,0,1,23.5,9.229,10.818,10.818,0,0,1,26.2,25.568a10.912,10.912,0,0,1-6.043,3.609v-7.7h2.1l.475-3.025h-3.18V16.472a1.722,1.722,0,0,1,.366-1.138,1.675,1.675,0,0,1,1.344-.511h1.921v-2.65q-.041-.013-.784-.105a15.591,15.591,0,0,0-1.692-.105,4.228,4.228,0,0,0-3.038,1.083,4.187,4.187,0,0,0-1.141,3.108v2.3H14.11v3.025h2.42v7.7a10.65,10.65,0,0,1-6.549-3.609,10.805,10.805,0,0,1,2.706-16.34,10.617,10.617,0,0,1,5.406-1.471Z"
                                                    transform="translate(-7.383 -7.758)" fill="#2E2BAA" fillRule="evenodd" />
                                            </svg>
                                            <svg id="instagram" xmlns="http://www.w3.org/2000/svg" width="21.419" height="21.419"
                                                viewBox="0 0 21.419 21.419">
                                                <g id="Group_34" data-name="Group 34">
                                                    <g id="Group_33" data-name="Group 33" transform="translate(0)">
                                                        <path id="Path_15" data-name="Path 15"
                                                            d="M16.069,0H5.36A5.371,5.371,0,0,0,0,5.355v10.71A5.371,5.371,0,0,0,5.36,21.419h10.71a5.371,5.371,0,0,0,5.355-5.355V5.355A5.371,5.371,0,0,0,16.069,0Zm3.57,16.065a3.574,3.574,0,0,1-3.57,3.57H5.36a3.574,3.574,0,0,1-3.57-3.57V5.355a3.574,3.574,0,0,1,3.57-3.57h10.71a3.573,3.573,0,0,1,3.57,3.57v10.71Z"
                                                            transform="translate(-0.005)" fill="#2E2BAA" />
                                                    </g>
                                                </g>
                                                <g id="Group_36" data-name="Group 36" transform="translate(15.173 3.57)">
                                                    <g id="Group_35" data-name="Group 35">
                                                        <ellipse id="Ellipse_1" data-name="Ellipse 1" cx="1.339" cy="1.339" rx="1.339" ry="1.339"
                                                            fill="#2E2BAA" />
                                                    </g>
                                                </g>
                                                <g id="Group_38" data-name="Group 38" transform="translate(5.355 5.355)">
                                                    <g id="Group_37" data-name="Group 37">
                                                        <path id="Path_16" data-name="Path 16"
                                                            d="M107.76,102.4a5.355,5.355,0,1,0,5.355,5.355A5.354,5.354,0,0,0,107.76,102.4Zm0,8.925a3.57,3.57,0,1,1,3.57-3.57A3.57,3.57,0,0,1,107.76,111.325Z"
                                                            transform="translate(-102.405 -102.4)" fill="#2E2BAA" />
                                                    </g>
                                                </g>
                                            </svg>
                                            <svg id="_x31_0.Linkedin" xmlns="http://www.w3.org/2000/svg" width="21.472" height="21.472"
                                                viewBox="0 0 21.472 21.472">
                                                <path id="Path_17" data-name="Path 17"
                                                    d="M52.176,49.981V42.117c0-3.865-.832-6.817-5.341-6.817a4.66,4.66,0,0,0-4.214,2.308h-.054V35.649H38.3V49.981h4.455V42.869c0-1.879.349-3.677,2.657-3.677,2.281,0,2.308,2.12,2.308,3.784v6.978h4.455Z"
                                                    transform="translate(-30.704 -28.51)" fill="#2E2BAA" />
                                                <path id="Path_18" data-name="Path 18" d="M11.3,36.6h4.455V50.932H11.3Z"
                                                    transform="translate(-10.951 -29.461)" fill="#2E2BAA" />
                                                <path id="Path_19" data-name="Path 19"
                                                    d="M12.577,10a2.59,2.59,0,1,0,2.577,2.577A2.577,2.577,0,0,0,12.577,10Z"
                                                    transform="translate(-10 -10)" fill="#2E2BAA" />
                                            </svg>
                                        </div>
                                    </li>
                                    <li className="lang-sec"><a href="">En</a>
                                        <a href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="19" viewBox="0 0 31 19">
                                                <g id="Component_82_1" data-name="Component 82 – 1" transform="translate(0 2)">
                                                    <text id="عربى" transform="translate(0 13)" fontSize="14" fontFamily="SegoeUI-Bold, Segoe UI"
                                                        fontWeight="700" opacity="0.497">
                                                        <tspan x="0" y="0">عربى</tspan>
                                                    </text>
                                                </g>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}
        </div>

    );
}

export default AboutUs;
