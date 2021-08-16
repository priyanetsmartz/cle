import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import { useEffect } from "react";
import MagazineNew from './magazine-new';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';

import { FullPage, Slide } from 'react-full-page';


function One(props) {
    const [show, doShow] = useState('inactive');
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
    }, [location])
    function test(e) {
        if (e.from === 0 && e.to === 1) {
            const home = document.getElementById("home");
            const story = document.getElementById("our-story");
            home.classList.add("no-active");
            home.classList.remove("active");
            story.classList.add("active");
        }
        if (e.from === 1 && e.to === 2) {
            const magazine = document.getElementById("magazine");
            const story = document.getElementById("our-story");
            const home = document.getElementById("home");
            story.classList.remove("active");
            story.classList.add("no-active");
            home.classList.remove("no-active");
            magazine.classList.add("active");
        }
        if (e.from === 2 && e.to === 3) {
            const story = document.getElementById("our-story");
            const magazine = document.getElementById("magazine");
            const work = document.getElementById("work-with-us");
            story.classList.remove("no-active");
            magazine.classList.add("no-active");
            magazine.classList.remove("active");
            work.classList.add("active");
        }
        if (e.from === 3 && e.to === 4) {
            const magazine = document.getElementById("magazine");
            const tell = document.getElementById("tell-us-more");
            const work = document.getElementById("work-with-us");

            work.classList.add("no-active");
            work.classList.remove("active");
            tell.classList.add("active");
            magazine.classList.remove("no-active");
        }
        if (e.from === 4 && e.to === 5) {
            const work = document.getElementById("work-with-us");
            const tell = document.getElementById("tell-us-more");
            const check = document.getElementById("checkus-out");

            tell.classList.add("no-active");
            tell.classList.remove("active");
            work.classList.remove("no-active");
            check.classList.add("active");
        }

        if (e.from === 5 && e.to === 4) {
            const tell = document.getElementById("tell-us-more");
            const check = document.getElementById("checkus-out");
            check.classList.remove("active");
            tell.classList.remove("no-active");
            tell.classList.add("active");
        }

        if (e.from === 4 && e.to === 3) {
            const tell = document.getElementById("tell-us-more");
            const work = document.getElementById("work-with-us");

            work.classList.remove("no-active");
            work.classList.add("active");
            tell.classList.remove("active");
            // magazine.classList.remove("no-active");
        }

        if (e.from === 3 && e.to === 2) {
            const story = document.getElementById("our-story");
            const magazine = document.getElementById("magazine");
            const work = document.getElementById("work-with-us");

            // story.classList.add("active");
            // magazine.classList.remove("no-active");
            magazine.classList.add("active");
            work.classList.remove("active");
        }

        if (e.from === 2 && e.to === 1) {
            const magazine = document.getElementById("magazine");
            const story = document.getElementById("our-story");
            const home = document.getElementById("home");

            story.classList.add("active");
            magazine.classList.remove("active");
        }
        if (e.from === 1 && e.to === 0) {
            const home = document.getElementById("home");
            const story = document.getElementById("our-story");

            home.classList.add("active");
            story.classList.remove("active");
        }
    }
    return (
        <div className="sectiosn" >
            <FullPage afterChange={test} duration={800}   >
                <Slide id="home" className={show} >
                    <HomePage />
                </Slide>
                <Slide id="our-story" className="section" controlsProps>
                    <AboutUs />
                </Slide>
                {/* magazine */}
                <Slide id="magazine" className="section">
                    <MagazineNew />
                </Slide>
                {/* partnership */}
                <Slide id="work-with-us" className="section">
                    <Partnership />
                </Slide>
                {/* helpus */}
                <Slide id="tell-us-more" className="section">
                    <HelpUs />
                </Slide>
                {/* check out us */}
                <Slide id="checkus-out" className="section">
                    <SocailCheckout />
                </Slide>
                {/* <Slide id="footer" className="section">
                    <Footer />
                </Slide> */}
            </FullPage>
        </div>
    )


}
export default One;