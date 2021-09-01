import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import MagazineNew from './magazine-new';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactFullpage from '@fullpage/react-fullpage';
import Footer from '../partials/footer-new';
import { BrowserView, MobileView } from 'react-device-detect';

function Home(props) {
    const location = useLocation()
    useEffect(() => {
        
        if (location.hash) {
            //   console.log(location.hash)
            let elem = document.getElementById(location.hash.slice(1) + '1')
            //  let elemClass =  document.getElementsByClassName(location.hash.slice(1))
            console.log(elem)
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        }
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    })
    const onLeave = (origin, destination, direction) => {
        //  console.log("onLeave event", { origin, destination, direction });
        if (origin.index === 0 && destination.index === 1) {
            const home = document.getElementsByClassName("home");
            home[0].classList.add("no-active");
            home[0].classList.remove("active");
        }
        if (origin.index === 1 && destination.index === 2) {
            const story = document.getElementsByClassName("our-story");
            const home = document.getElementsByClassName("home");
            story[0].classList.remove("active");
            story[0].classList.add("no-active");
            home[0].classList.remove("no-active");

        }
        if (origin.index === 2 && destination.index === 3) {
            const story = document.getElementsByClassName("our-story");
            const magazine = document.getElementsByClassName("magazine");
            story[0].classList.remove("no-active");
            magazine[0].classList.add("no-active");
            magazine[0].classList.remove("active");

        }
        if (origin.index === 3 && destination.index === 4) {
            const magazine = document.getElementsByClassName("magazine");
            const work = document.getElementsByClassName("work-with-us");

            work[0].classList.add("no-active");
            work[0].classList.remove("active");
            magazine[0].classList.remove("no-active");
        }
        if (origin.index === 4 && destination.index === 5) {
            const work = document.getElementsByClassName("work-with-us");
            const tell = document.getElementsByClassName("tell-us-more");

            tell[0].classList.add("no-active");
            tell[0].classList.remove("active");
            work[0].classList.remove("no-active");
        }

        if (origin.index === 5 && destination.index === 4) {
            const tell = document.getElementsByClassName("tell-us-more");
            const check = document.getElementsByClassName("checkus-out");
            check[0].classList.remove("active");
            tell[0].classList.remove("no-active");
        }

        if (origin.index === 4 && destination.index === 3) {
            const tell = document.getElementsByClassName("tell-us-more");
            const work = document.getElementsByClassName("work-with-us");

            work[0].classList.remove("no-active");
            tell[0].classList.remove("active");
        }

        if (origin.index === 3 && destination.index === 2) {
            const magazine = document.getElementsByClassName("magazine");
            const work = document.getElementsByClassName("work-with-us");


            magazine[0].classList.remove("no-active");
            work[0].classList.remove("active");
        }

        if (origin.index === 2 && destination.index === 1) {
            const magazine = document.getElementsByClassName("magazine");
            const story = document.getElementsByClassName("our-story");

            story[0].classList.remove("no-active");
            magazine[0].classList.remove("active");
        }
        if (origin.index === 1 && destination.index === 0) {
            const home = document.getElementsByClassName("home");
            const story = document.getElementsByClassName("our-story");


            home[0].classList.remove("no-active");
            story[0].classList.remove("active");
        }
    };

    const afterLoad = (origin, destination, direction) => {
        if (origin.index === 0 && destination.index === 1) {
            const story = document.getElementsByClassName("our-story");

            story[0].classList.add("active");
        }
        if (origin.index === 1 && destination.index === 2) {
            const magazine = document.getElementsByClassName("magazine");

            magazine[0].classList.add("active");
        }
        if (origin.index === 2 && destination.index === 3) {
            const work = document.getElementsByClassName("work-with-us");
            work[0].classList.add("active");
        }
        if (origin.index === 3 && destination.index === 4) {
            const tell = document.getElementsByClassName("tell-us-more");

            tell[0].classList.add("active");
        }
        if (origin.index === 4 && destination.index === 5) {
            const check = document.getElementsByClassName("checkus-out");


            check[0].classList.add("active");
        }

        if (origin.index === 5 && destination.index === 4) {
            const tell = document.getElementsByClassName("tell-us-more");

            tell[0].classList.add("active");
        }

        if (origin.index === 4 && destination.index === 3) {
            const work = document.getElementsByClassName("work-with-us");

            work[0].classList.add("active");
        }

        if (origin.index === 3 && destination.index === 2) {
            const magazine = document.getElementsByClassName("magazine");
            magazine[0].classList.add("active");
        }

        if (origin.index === 2 && destination.index === 1) {
            const story = document.getElementsByClassName("our-story");

            story[0].classList.add("active");
        }
        if (origin.index === 1 && destination.index === 0) {
            const home = document.getElementsByClassName("home");

            home[0].classList.add("active");
        }
    };
    const anchors = ["home", "our-story", "magazine", "work-with-us", "tell-us-more", "checkus-out", "footer"];
    return (
        <>
            <BrowserView>
                <ReactFullpage
                    //fullpage options
                    // anchors={anchors}
                    scrollingSpeed={500} /* Options here */
                    onLeave={onLeave}
                    afterLoad={afterLoad}

                    className="sectiosn"
                    sectionClassName='section'
                    scrollBar="true"
                    render={({ state, fullpageApi }) => {
                        return (
                            <div className="sectiosn" >
                                <div id="home1" className="section home">
                                    <HomePage />
                                </div>
                                {/* about us */}
                                <div id="our-story1" className="section our-story" >
                                    <AboutUs />
                                </div>
                                {/* magazine */}
                                <div id="magazine1" className="section magazine" >
                                    <MagazineNew />
                                </div>
                                {/* partnership */}
                                <div id="work-with-us1" className="section work-with-us" >
                                    <Partnership />
                                </div>
                                {/* helpus */}
                                <div id="tell-us-more1" className="section tell-us-more" >
                                    <HelpUs />
                                </div>
                                {/* check out us */}
                                <div id="checkus-out1" className="section checkus-out" >
                                    <SocailCheckout />
                                </div>
                                <div className="section footer">
                                    <Footer />
                                </div>
                            </div>
                        )
                    }}
                />
            </BrowserView>
            <MobileView>
                <div className="sectiosn" >
                    <div id="home1" className="section home">
                        <HomePage />
                    </div>
                    {/* about us */}
                    <div id="our-story1" className="section our-story" >
                        <AboutUs />
                    </div>
                    {/* magazine */}
                    <div id="magazine1" className="section magazine" >
                        <MagazineNew />
                    </div>
                    {/* partnership */}
                    <div id="work-with-us1" className="section work-with-us" >
                        <Partnership />
                    </div>
                    {/* helpus */}
                    <div id="tell-us-more1" className="section tell-us-more" >
                        <HelpUs />
                    </div>
                    {/* check out us */}
                    <div id="checkus-out1" className="section checkus-out" >
                        <SocailCheckout />
                    </div>
                    <div className="section footer">
                        <Footer />
                    </div>
                </div>
            </MobileView>
        </>
    );
}
export default Home;

