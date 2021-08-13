import React from 'react';
import $ from 'jquery';
export default class Slimscroll extends React.Component {
    render() {
       function h() {
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js', function (data, textStatus) {
                $("body").slimScroll({
                    size: '8px',
                    width: "100%",
                    height: '100%',
                    color: "#ff4800",
                    allowPageScroll: true,
                    alwaysVisible: true
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