import React from "react";
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import MagazineWew from './magazine-new';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// import smartscroll from '../../../node_modules/smartscroll';

function Home(props) {
    const location = useLocation()
    useEffect(() => {
        let el = document.getElementById('home').nextElementSibling;
        console.log('Siblings of div-01:', el);
        if (location.hash) {
            let elem = document.getElementById(location.hash.slice(1))
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
    }, [location])
    return (
        // <div className="newpage">
        <>
            <div id="home" className="section" data-hash="section1">
                <HomePage />
            </div>
            {/* about us */}
            <div id="our-story" className="section" data-hash="section2">
                <AboutUs />
            </div>
            {/* magazine */}
            <div id="magazine" className="section" data-hash="section3">
                {/* <Magazine /> */}
                <MagazineWew />
            </div>
            {/* partnership */}
            <div id="work-with-us" className="section" data-hash="section4">
                <Partnership />
            </div>
            {/* helpus */}
            <div id="tell-us-more" className="section" data-hash="section5">
                <HelpUs />
            </div>
            {/* check out us */}
            <div id="checkus-out" className="section" data-hash="section6">
                <SocailCheckout />
            </div>
        </>

    );
}
export default Home;

