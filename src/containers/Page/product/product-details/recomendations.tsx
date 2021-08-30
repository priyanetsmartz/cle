import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import kbg8zolf from "../../../../image/kbg8zolf.png";


function Recommendations(props) {
    useEffect(() => {
    }, [])

    return (
        <div className="container">
            <div className="col-sm-12">
                <div className="recommendations-section text-center ">
                    <h1>Recommendations</h1>
                    <div className="recommed-slider">
                        <div className="regular slider">
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                            <div className="productcalr">
                                <div className="product_img"><img src={kbg8zolf} className="image-fluid" /> </div>
                                <div className="product_name"> Bottega Veneta </div>
                                <div className="product_price"> $2,803</div>
                            </div>
                        </div>
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