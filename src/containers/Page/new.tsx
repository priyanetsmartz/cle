import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import MagazineWew from './magazine-new';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { $ } from 'react-jquery-plugin'

function Home(props) {
    const location = useLocation()
    useEffect(() => {
        // if (typeof $.smartscroll !== 'undefined') {
        // $.getScript('https://code.jquery.com/jquery-3.6.0.min.js')
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lethargy/1.0.9/lethargy.min.js')
        $.getScript('https://rawgit.com/Olical/EventEmitter/master/EventEmitter.min.js')
        $.getScript('https://localhost:3000/bootstrap/jQuery-Smart-Scroll/smartscroll.js', function (data, textStatus, jqxhr) {
            console.log(data); // Data returned
            console.log(textStatus); // Success
            console.log(jqxhr.status); // 200
            console.log("Load was performed.");
            var options = {
                mode: "vp", // "vp", "set"
                autoHash: false,
                sectionScroll: false,
                initialScroll: true,
                keepHistory: false,
                sectionWrapperSelector: ".newpage",
                sectionClass: "section",
                animationSpeed: 2000,
                headerHash: "header",
                breakpoint: null,
                eventEmitter: null,
                dynamicHeight: false
            };
            $.smartscroll(options);
        });
        // }
    },[])
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

    const style = {
        // height: '100%',
        // width: '100%'
    }
    return (
        <div className="newpage">
            <div id="home" className="section" data-hash="home" style={style}>
                <HomePage />
            </div>
            {/* about us */}
            <div id="our-story" className="section" data-hash="our-story" style={style}>
                <AboutUs />
            </div>
            {/* magazine */}
            <div id="magazine" className="section" data-hash="magazine" style={style}>
                <MagazineWew />
            </div>
            {/* partnership */}
            <div id="work-with-us" className="section" data-hash="partnership" style={style}>
                <Partnership />
            </div>
            {/* helpus */}
            <div id="tell-us-more" className="section" data-hash="helpus" style={style}>
                <HelpUs />
            </div>
            {/* check out us */}
            <div id="checkus-out" className="section" data-hash="checkusout" style={style}>
                <SocailCheckout />
            </div>

        </div>

    );
}
export default Home;