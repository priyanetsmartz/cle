import React, { useLayoutEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { useLocation } from "react-router-dom";
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import Magazine from './magazine';
import { useEffect } from "react";
import MagazineNew from './magazine-new';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import styled from "styled-components";
import { FullPage, Slide } from 'react-full-page';
import Header from '../partials/header';
import Footer from '../partials/footer-new';

function One(props) {
    const [show, doShow] = useState('inactive');
    const location = useLocation();
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

    const Div = styled.div`
  height: 100% !important;
  width: 100% !important;
`;
    const ourRef = useRef(null),
        anotherRef = useRef(null),
        refThree = useRef(null);
    // useEffect(() => {
    //     const scrollPos = window.scrollY + window.innerHeight;
    //     const topPos = (element) => element.getBoundingClientRect().bottom;
    //     const getHeight = (element) => element.offsetHeight;
    //     const div1Pos = topPos(ourRef.current),
    //         div2Pos = topPos(anotherRef.current),
    //         div3Pos = topPos(refThree.current);

    //     const div1Height = getHeight(ourRef.current);
    //     const div2Height = getHeight(anotherRef.current);
    //     const div3Height = getHeight(refThree.current);

    //     console.log(div1Pos, div2Pos, div3Pos)
    //     console.log(div1Height, div2Height, div3Height)

    //     const onScroll = (event) => {
    //         if (scrollPos < div1Height) {
    //             doShow('active')
    //         } else {
    //             doShow('in')
    //         }
    //     };

    //     window.addEventListener("scroll", onScroll);
    //     return () => window.removeEventListener("scroll", onScroll);
    // });
    let CustomControls = {
        "position": "relative",
        "animation": "Movehead ease 0.5s",
        " animation-iteration-count": 1,
        "animation-fill-mode": "forwards",
    }
    function  beforeChangefxn() {
        console.log('here');
    }
    return (
        <>
            <FullPage controlsProps={{beforeChange : beforeChangefxn}} >
              
                <Slide id="home" className="section">
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
        </>
    )


}
export default One;