import appAction from "../../redux/app/actions";
import { connect } from 'react-redux';
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const { openSignUp } = appAction;

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
        <>
            <div id="home" className="element">
                <HomePage />
            </div>
            {/* about us */}
            <div id="our-story" className="element">
                <AboutUs />
            </div>
            {/* magazine */}
            <div id="magazine" className="element">
                <Magazine />
            </div>
            {/* partnership */}
            <div id="work-with-us" className="element">
                <Partnership />
            </div>
            {/* helpus */}
            <div id="tell-us-more" className="element">
                <HelpUs />
            </div>
            {/* check out us */}
            <div id="checkus-out" className="element">
                <SocailCheckout />
            </div>
        </>
    );
}
function mapStateToProps(state) {
    let signupModel = '', languages = '';
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    // console.log(state.LanguageSwitcher)
    return {
        signupModel: signupModel,
        languages: languages

    };
}
export default connect(
    mapStateToProps,
    { openSignUp }
)(Home);

