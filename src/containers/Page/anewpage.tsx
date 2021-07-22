import appAction from "../../redux/app/actions";
import { connect } from 'react-redux';
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
const { openSignUp } = appAction;

function Home(props) {



    return (
        <>
            <Element name="home" className="element">
                <HomePage />
            </Element>
            {/* about us */}
            <Element name="about-us" className="element">
                <AboutUs />
            </Element>
            {/* magazine */}
            <Element name="magazine" className="element">
                <Magazine />
            </Element>
            {/* partnership */}
            <Element name="partnership" className="element">
                <Partnership />
            </Element>
            {/* helpus */}
            <Element name="helpus" className="element">
                <HelpUs />
            </Element>
            {/* check out us */}
            <Element name="checkus-out" className="element">
                <SocailCheckout />
            </Element>
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

