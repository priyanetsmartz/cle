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