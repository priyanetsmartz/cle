import React from "react";
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function Home(props) {
    const location = useLocation()
    useEffect(() => {
        if (location.hash) {
            let elem = document.getElementById(location.hash.slice(1))
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
    }, [location,])


    return (   
        <div className="newpage">         
            <div id="home" className="element" data-hash="home">
                <HomePage />
            </div>
            {/* about us */}
            <div id="our-story" className="element" data-hash="our-story">
                <AboutUs />
            </div>
            {/* magazine */}
            <div id="magazine" className="element" data-hash="magazine">
                <Magazine />
            </div>
            {/* partnership */}
            <div id="work-with-us" className="element" data-hash="work-with-us">
                <Partnership />
            </div>
            {/* helpus */}
            <div id="tell-us-more" className="element" data-hash="tell-us-more">
                <HelpUs />
            </div>
            {/* check out us */}
            <div id="checkus-out" className="element" data-hash="checkus-out">
                <SocailCheckout />
            </div>
            </div>
    );
}
export default Home;

