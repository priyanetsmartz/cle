import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import kbg8zolf from "../../../../image/kbg8zolf.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function Recommendations(props) {
    useEffect(() => {
    }, [])
    const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 2000
    };
    return (
        <div className="container">
            <div className="col-sm-12">
                <div className="recommendations-section text-center ">
                    <h1>Recommendations</h1>
                    <div className="recommed-slider" >
                        <Slider className="regular slider" {...settings}>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" alt="product_image" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(Recommendations);