import React from 'react';
import $ from 'jquery';
export default class Slimscroll extends React.Component {
    render() {
       function h() {
            $.getScript('https://localhost:3000/bootstrap/jQuery-Smart-Scroll/smartscroll.min.js', function (data, textStatus) {
                $.smartscroll({
                    mode: "vp", // "vp", "set"
                    autoHash: true,
                    sectionScroll: false,
                    initialScroll: false,
                    keepHistory: false,
                    sectionWrapperSelector: "newpage",
                    sectionClass: "section",
                    animationSpeed: 3000,
                    // headerHash: "header",
                    breakpoint: null,
                    eventEmitter: null,
                    dynamicHeight: false
              
                  });
            });
        }
        return (
            <div>
                {/* {this.h()} */}
            </div>
        )

    }
}