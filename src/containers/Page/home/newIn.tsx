import { useState } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";


function NewIn(props) {
    const [isHoverImage, setIsHoverImage] = useState(0);
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }

    return (
        <section className="width-100 mb-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-title">
                            <h1><Link to='/products/new-in' ><IntlMessages id="home.newIn" /></Link></h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-slider product-listing">
                            <div className="regular slider">
                                <Slider {...settings}>
                                    {props && props.newInProducts && props.newInProducts.map(item => {
                                        return (
                                            <div className="productcalr product" key={item.id} >
                                                <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                    onMouseLeave={() => someOtherHandler(item.id)}>
                                                    {
                                                        isHoverImage === parseInt(item.id) ? <img src={item.hover_image} className="image-fluid hover" alt={item.name} height="150" /> : <img src={item.img} className="image-fluid" alt={item.name} height="150" />
                                                    }
                                                </div>
                                                <div className="product_name"> {item.name} </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }} />
                                                {/* <div className="product_vrity">{item.short_description}</div> */}
                                                <div className="product_price">$ {formatprice(item.price)}</div>
                                                <div className="cart-button mt-3 px-2">
                                                    <Link to={'/product-details/' + item.sku} className="btn btn-primary text-uppercase">View Product</Link>
                                                </div>
                                            </div>
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