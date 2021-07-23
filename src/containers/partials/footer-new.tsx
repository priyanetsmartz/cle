import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import blackLogo from "../../image/CLE-logo-black.svg";
import { Link } from "react-router-dom";
import { siteConfig } from '../../settings/';
import { useState } from 'react';
import SignUp from '../Page/signup';
import SignIn from '../Page/signin';
import IntlMessages from "../../components/utility/intlMessages";

function FooterExtra(props) {
    const [menuLoaded, setMenuLoaded] = useState(false);
    const handleMenuOpen = (e) => {
        e.preventDefault();
        setMenuLoaded(true)
    }
    return (
        <>
            <SignIn showLogin={props.showLogin} />
            <SignUp signupModel={props.signupModel} />
            <footer className="cle-footer container">
                <div className="row my-4">
                    <div className="col-md-2">
                        <ul className="footer-links">
                            <li className="fl-title"><IntlMessages id="footer.about" /></li>
                            <li><Link to="/"><IntlMessages id="footer.profile" /></Link></li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                        <ul className="footer-links">
                            <li className="fl-title"><IntlMessages id="footer.sell" /></li>
                            <li><Link to={"/partnetship"}><IntlMessages id="footer.Partnership" /></Link></li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                        <ul className="footer-links">
                            <li className="fl-title"><IntlMessages id="footer.useful" /></li>
                            <li><Link to="/"><IntlMessages id="footer.help" /></Link></li>
                            <li><Link to="/"><IntlMessages id="footer.customer" /></Link></li>
                            <li><Link to={"/magazine"}><IntlMessages id="footer.magazine" /></Link></li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                        <ul className="footer-links">
                            <li className="fl-title"><IntlMessages id="footer.discover" /></li>
                            <li><Link to="/"><IntlMessages id="footer.story" /></Link></li>
                            <li><Link to="/"><IntlMessages id="footer.joinus" /></Link></li>
                        </ul>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-3">
                        <ul className="footer-address">
                            <li><img src={blackLogo} /></li>
                            <li><IntlMessages id="footer.address" /><br />
                            <IntlMessages id="footer.address2" /><br />
                                (+966) 920 002 470</li>
                            <li>
                                <Link to={{ pathname: siteConfig.facebookLink }} target="_blank" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21.42" height="21.419" viewBox="0 0 21.42 21.419">
                                        <path id="facebook" d="M18.093,7.758A10.614,10.614,0,0,1,23.5,9.229,10.818,10.818,0,0,1,26.2,25.568a10.912,10.912,0,0,1-6.043,3.609v-7.7h2.1l.475-3.025h-3.18V16.472a1.722,1.722,0,0,1,.366-1.138,1.675,1.675,0,0,1,1.344-.511h1.921v-2.65q-.041-.013-.784-.105a15.591,15.591,0,0,0-1.692-.105,4.228,4.228,0,0,0-3.038,1.083,4.187,4.187,0,0,0-1.141,3.108v2.3H14.11v3.025h2.42v7.7a10.65,10.65,0,0,1-6.549-3.609,10.805,10.805,0,0,1,2.706-16.34,10.617,10.617,0,0,1,5.406-1.471Z" transform="translate(-7.383 -7.758)" fill="#2E2BAA" fillRule="evenodd" />
                                    </svg>
                                </Link>
                                <Link to={{ pathname: siteConfig.instagram }} target="_blank" >
                                    <svg id="instagram" xmlns="http://www.w3.org/2000/svg" width="21.419" height="21.419" viewBox="0 0 21.419 21.419">
                                        <g id="Group_34" data-name="Group 34">
                                            <g id="Group_33" data-name="Group 33" transform="translate(0)">
                                                <path id="Path_15" data-name="Path 15" d="M16.069,0H5.36A5.371,5.371,0,0,0,0,5.355v10.71A5.371,5.371,0,0,0,5.36,21.419h10.71a5.371,5.371,0,0,0,5.355-5.355V5.355A5.371,5.371,0,0,0,16.069,0Zm3.57,16.065a3.574,3.574,0,0,1-3.57,3.57H5.36a3.574,3.574,0,0,1-3.57-3.57V5.355a3.574,3.574,0,0,1,3.57-3.57h10.71a3.573,3.573,0,0,1,3.57,3.57v10.71Z" transform="translate(-0.005)" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                        <g id="Group_36" data-name="Group 36" transform="translate(15.173 3.57)">
                                            <g id="Group_35" data-name="Group 35">
                                                <ellipse id="Ellipse_1" data-name="Ellipse 1" cx="1.339" cy="1.339" rx="1.339" ry="1.339" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                        <g id="Group_38" data-name="Group 38" transform="translate(5.355 5.355)">
                                            <g id="Group_37" data-name="Group 37">
                                                <path id="Path_16" data-name="Path 16" d="M107.76,102.4a5.355,5.355,0,1,0,5.355,5.355A5.354,5.354,0,0,0,107.76,102.4Zm0,8.925a3.57,3.57,0,1,1,3.57-3.57A3.57,3.57,0,0,1,107.76,111.325Z" transform="translate(-102.405 -102.4)" fill="#2E2BAA" />
                                            </g>
                                        </g>
                                    </svg>
                                </Link>
                                <Link to={{ pathname: siteConfig.linkedin }} target="_blank" >
                                    <svg id="_x31_0.Linkedin" xmlns="http://www.w3.org/2000/svg" width="21.472" height="21.472" viewBox="0 0 21.472 21.472">
                                        <path id="Path_17" data-name="Path 17" d="M52.176,49.981V42.117c0-3.865-.832-6.817-5.341-6.817a4.66,4.66,0,0,0-4.214,2.308h-.054V35.649H38.3V49.981h4.455V42.869c0-1.879.349-3.677,2.657-3.677,2.281,0,2.308,2.12,2.308,3.784v6.978h4.455Z" transform="translate(-30.704 -28.51)" fill="#2E2BAA" />
                                        <path id="Path_18" data-name="Path 18" d="M11.3,36.6h4.455V50.932H11.3Z" transform="translate(-10.951 -29.461)" fill="#2E2BAA" />
                                        <path id="Path_19" data-name="Path 19" d="M12.577,10a2.59,2.59,0,1,0,2.577,2.577A2.577,2.577,0,0,0,12.577,10Z" transform="translate(-10 -10)" fill="#2E2BAA" />
                                    </svg>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-12 footer-last-links mb-3">
                        <Link to="/terms-and-conditions"><IntlMessages id="signup.terms_conditions" /></Link>&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/privacy-policy-cookie-restriction-mode"><IntlMessages id="signup.privacy_policy" /></Link>
                    </div>
                </div>
            </footer>
        </>
    );
}

function mapStateToProps(state) {
    let showLogin = '', signupModel = '';
    if (state && state.App) {
        showLogin = state.App.showLogin;
        signupModel = state.App.showSignUp
    }    
    return {
        showLogin: showLogin,
        signupModel: signupModel
    }
};
export default connect(
    mapStateToProps,
    {}
)(FooterExtra);
