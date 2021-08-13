import React from "react";
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import $ from 'jquery';
import smartscroll from 'smartscroll';
// window.jQuery = $;
function Home(props) {
    const location = useLocation()
    useEffect(() => {
        $.getScript('https://code.jquery.com/jquery-3.1.1.min.js')
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lethargy/1.0.9/lethargy.js')
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/EventEmitter/5.2.8/EventEmitter.js')
        $.getScript('https://cdn.jsdelivr.net/npm/smartscroll@2.5.6/smartscroll.min.js', function (data, textStatus) {
            $.smartscroll({
                mode: "set", // "vp", "set"
                autoHash: false,
                sectionScroll: true,
                initialScroll: true,
                keepHistory: false,
                sectionWrapperSelector: ".newpage",
                sectionClass: "section",
                animationSpeed: 2500,
                headerHash: "header",
                breakpoint: null,
                eventEmitter: null,
                dynamicHeight: true

            });
        });
    })
    useEffect(() => {
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
        <div className="newpage">
            <div id="home" className="section" data-hash="home">
                <HomePage />
            </div>
            {/* about us */}
            <div id="our-story" className="section" data-hash="our-story">
                <AboutUs />
            </div>
            {/* magazine */}
            <div id="magazine" className="section" data-hash="magazine">
                <Magazine />
            </div>
            {/* partnership */}
            <div id="work-with-us" className="section" data-hash="partnership">
                <Partnership />
            </div>
            {/* helpus */}
            <div id="tell-us-more" className="section" data-hash="helpus">
                <HelpUs />
            </div>
            {/* check out us */}
            <div id="checkus-out" className="section" data-hash="checkusout">
                <SocailCheckout />
            </div>
        </div>

    );
}
export default Home;

