import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "fullpage.js/vendors/scrolloverflow"; // Optional. When using scrollOverflow:true
import ReactFullpage from "@fullpage/react-fullpage";

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

    const onLeave = (origin, destination, direction) => {
        console.log("Leaving section " + origin.index);
      }
      const afterLoad = (origin, destination, direction) => {
        console.log("After load: " + destination.index);
      }


    return (
        <ReactFullpage
        scrollOverflow={true}
        onLeave={onLeave}
        afterLoad={afterLoad}
        render={({ state, fullpageApi }) => {
          return (
            <div id="fullpage-wrapper">
                <div id="home" className="section section1">
                    <HomePage />
                </div>
                {/* about us */}
                <div id="our-story" className="section">
                    <AboutUs />
                </div>
                {/* magazine */}
                <div id="magazine" className="section">
                    <Magazine />
                </div>
                {/* partnership */}
                <div id="work-with-us" className="section">
                    <Partnership />
                </div>
                {/* helpus */}
                <div id="tell-us-more" className="section">
                    <HelpUs />
                </div>
                {/* check out us */}
                <div id="checkus-out" className="section">
                    <SocailCheckout />
                </div>
            </div>
          );
        }}
      />
    );
}
export default Home;

