import React, { useLayoutEffect, useRef, useState } from 'react';
import $ from 'jquery';
import { useLocation } from "react-router-dom";
import HomePage from './home';
import Partnership from './partnerShip';
import AboutUs from './about';
import { useEffect } from "react";
import MagazineNew from './magazine-new';
import HelpUs from './helpUs';
import SocailCheckout from './SocialCheckout';
import styled from "styled-components";
import Header from '../partials/header';
import Footer from '../partials/footer-new';

function One(props) {
    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop,)
    const ourStory = useRef(null),
        home = useRef(null),
        magazine = useRef(null),
        work = useRef(null),
        tell = useRef(null),
        checkus = useRef(null);
    const [setClass, classss] = useState({
        height: "100%",
        width: "100%",
    })
    const [show, doShow] = useState(
        {
            currentIndex: 0,
            colors: ["home", "ourStory", "magazine", "work", "tell", "checkus"],
        }
    );
    const nextIndex = () => {
        const { colors, currentIndex } = show;
        // console.log('up', currentIndex);
        if (currentIndex === colors.length - 1) {
            let currentIndex = 0;
            return doShow['currentIndex'] = currentIndex;

        }
        // scrollToRef(ourStory)
        let test = doShow['currentIndex'] = currentIndex + 1;
        //   console.log(test)
    };

    const prevIndex = () => {
        const { colors, currentIndex } = show;
        //   console.log('down', currentIndex);
        if (currentIndex === 0) {
            return doShow['currentIndex'] = colors.length - 1
        }
        //   scrollToRef(tell)
        return doShow['currentIndex'] = currentIndex - 1;
    };
    let { colors, currentIndex } = show;
    // useEffect(() => {
    //     moveFocus();
    // })
    function moveFocus(e) {
        const active = document.activeElement;
        console.log(active.nextSibling)
        if (active.nextSibling) {
            active.nextSibling.focus();
        }
        // if (e.keyCode === 38 && active.previousSibling) {
        //     active.previousSibling.focus();
        // }
    }
    function moveFocusUp(e) {
        const active = document.activeElement;
        console.log(active.previousSibling)
        if (active.previousSibling) {
            active.previousSibling.focus();
        }
        // if (e.keyCode === 38 && active.previousSibling) {
        //     active.previousSibling.focus();
        // }
    }
    function handleScroll(e) {
        let element = e.target;
        console.log(element);
    }
    useLayoutEffect(() => {
        scrollToRef(home)
        const test = document.getElementById("test1");
        const scrollCallBack = window.addEventListener("scroll", () => {
            const active = document.activeElement;
            console.log(window.pageYOffset)
            // classss({
            //     height: "100%",
            //     width: "100%",
            //     transition: " transform 1000ms ease-in-out 0s",
            //     outline: "none",
            //     transform: "translate3d(0px, -100%, 0px)"
            // }
            // )
            const topPos = (element) => element.getBoundingClientRect().top;
            const getHeight = (element) => element.offsetHeight;
            const div1Pos = topPos(home.current),
                div2Pos = topPos(ourStory.current),
                div3Pos = topPos(work.current);

            const div1Height = getHeight(home.current);
            const div2Height = getHeight(ourStory.current);
            const div3Height = getHeight(work.current);
            console.log(div1Pos,'div1Height')
            console.log(div2Pos, 'div2Height')
            console.log(div3Pos, 'div3Height')
            const scrollPos = window.scrollY + window.innerHeight;
            console.log(scrollPos)
            // if (scrollPos > 100 && div1Pos < scrollPos) {
            //     scrollToRef(ourStory)
            // }
            // if (div2Pos < scrollPos) {
            //     scrollToRef(magazine) 
            // }
            // if (window.pageYOffset > 200 && window.pageYOffset< 800) {
            //     scrollToRef(ourStory)
            // } else {
            //     scrollToRef(home)
            // }

            // if (window.pageYOffset > 800 && window.pageYOffset < 1500) {
            //   //  console.log(window.pageYOffset)
            //     scrollToRef(magazine)
            // } else {
            //     scrollToRef(ourStory)
            // }

            // if (window.pageYOffset > 1500 && window.pageYOffset < 2200) {
            //     scrollToRef(work)
            // } else {
            //     scrollToRef(magazine)
            // }
            // if (window.pageYOffset > 2200 && window.pageYOffset < 4000) {
            //     scrollToRef(checkus)
            // } else {
            //     scrollToRef(work)
            // }
        });
        return () => {
            classss()
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);
    const style = {
        "height": "100vh",
        "width": "100%"
    }
    return (
        <>
            {/* <ReactScrollWheelHandler
            upHandler={prevIndex}
            downHandler={nextIndex}
            style={{
                // width: "100%",
                // height: "100vh",
                backgroundColor: colors[currentIndex],
                transition: "background-color .4s ease-out",
                outline: " none"
            }}
            ref={home}
            onKeyPress={moveFocus}
        > */}

            <div >
                <div tabIndex="0" id="home" className="section" style={style} ref={home} >
                    <HomePage />
                </div>
                {/* about us */}
                <div tabIndex="1" id="our-story" className="section" style={style} ref={ourStory} >
                    <AboutUs />
                </div>
                {/* magazine */}
                <div tabIndex="2" id="magazine" className="section" style={style} ref={magazine}>
                    <MagazineNew />
                </div>
                {/* partnership */}
                <div tabIndex="3" id="work-with-us" className="section" style={style} ref={work} >
                    <Partnership />
                </div>
                {/* helpus */}
                <div tabIndex="4" id="tell-us-more" className="section" style={style} ref={tell}>
                    <HelpUs />
                </div>
                {/* check out us */}
                <div tabIndex="5" id="checkus-out" className="section" style={style} ref={checkus}>
                    <SocailCheckout />
                </div>
            </div>
        </>
    )


}
export default One;