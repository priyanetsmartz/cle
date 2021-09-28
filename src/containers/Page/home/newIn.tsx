import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import { Link } from "react-router-dom";


function NewIn(props) {
    useEffect(() => {
    }, [])

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    return (
        <section className="width-100 mb-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-title">
                            <h1>New in</h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-slider">
                            <div className="regular slider">
                                <Slider {...settings}>
                                    {props && props.newInProducts && props.newInProducts.map(item => {
                                        return (
                                            <Link className="productcalr" key={item.id} to={'/product-details/' + item.name}>
                                                <div className="product_img">
                                                    <img src={item.img} alt="productimage" className="image-fluid" height="150"/>
                                                </div>
                                                <div className="product_name"> {item.name} </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }} />
                                                {/* <div className="product_vrity">{item.short_description}</div> */}
                                                <div className="product_price">$ {formatprice(item.price)}</div>
                                            </Link>
                                        )
                                    })}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(NewIn);