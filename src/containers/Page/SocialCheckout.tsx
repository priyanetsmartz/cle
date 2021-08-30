import social1 from "../../image/checkout-social-1.png";
import social2 from "../../image/checkout-social-2.png";
import social3 from "../../image/checkout-social-3.png";
import social4 from "../../image/checkout-social-4.png";
import social5 from "../../image/checkout-social-5.png";
import social6 from "../../image/checkout-social-6.png";
import social7 from "../../image/checkout-social-7.png";
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { siteConfig } from '../../settings/';
import IntlMessages from "../../components/utility/intlMessages";
import { connect } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function SocailCheckout(props) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 2000
    };
    // const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    useEffect(() => {
        // async function fetchMyAPI() {
        //     let result: any = await Pages('check-out', props.languages);
        //     var jsonData = result.data.items[0];
        //     // console.log(jsonData);
        //     SetPagesData(jsonData);
        // }
        // fetchMyAPI()
    }, [props.languages])
    return (
        <>
            <div className="container magazine-inner">
                <figure className="ps-4 page-head">
                    <svg xmlns="http://www.w3.org/2000/svg" width="850" height="134" viewBox="0 0 850 134">
                        <text id="Check_out" data-name={<IntlMessages id="checkusout.title" />} transform="translate(425 98)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                            <tspan x="-423.555" y="0"><IntlMessages id="checkusout.title" /></tspan>
                        </text>
                    </svg>
                </figure>

                <div className="social-title">
                    {/* <h1><IntlMessages id="checkusout.subtitle" /></h1> */}
                    <h1><IntlMessages id="checkusout.subtitle" /></h1>
                    <div className="social-icon-sec">
                        <ul>
                            <Link to={{ pathname: siteConfig.facebookLink }} target="_blank" >
                                <li><svg xmlns="http://www.w3.org/2000/svg" width="105" height="22" viewBox="0 0 105 22">
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
                            </Link>
                            <Link to={{ pathname: siteConfig.instagram }} target="_blank" >
                                <li><svg xmlns="http://www.w3.org/2000/svg" width="110" height="22" viewBox="0 0 110 22">
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
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="social-icon-list">
                <Slider className={'social-icon-scroll'} {...settings}>
                    <div className="social-pic-icon">
                        <img src={social1} alt="social1" />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social4} alt="social1" />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social2} alt="social1" />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social3} alt="social1" />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social5} alt="social1" />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social6} alt="social1" />
                    </div>
                    <div className="social-pic-icon">
                        <img src={social7} alt="social1" />
                    </div>
                </Slider>
                <div className="social-icon-blue-bg"></div>
            </div>
        </>
    );
}

function mapStateToProps(state) {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages
    };
};
export default connect(
    mapStateToProps,
    {}
)(SocailCheckout);

