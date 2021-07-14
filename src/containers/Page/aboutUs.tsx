import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/pages';
import aboutUs from "../../image/about-Picture.png";
import CleLogoBlack from "../../image/CLE-logo-black.svg";
import SignUp from './signup';

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
        <div style={{ marginTop: '5rem' }}>
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
            {isModel && (
                <SignUp />
            )}

        </div>

    );
}

export default AboutUs;
