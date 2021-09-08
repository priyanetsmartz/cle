import { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatprice } from '../../../../components/utility/allutils';
import { Link } from "react-router-dom";
const Recommendations = (props) => {
    const [recomendedProducts, setRecomendedProducts] = useState([]);
    // console.log(recomendedProducts)
    useEffect(() => {
        setRecomendedProducts(props.recomendationsData)
        //    console.log(typeof (recomendedProducts))
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.recomendationsData])
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
                {(recomendedProducts && recomendedProducts.length) && (

                    <div className="recommendations-section text-center ">
                        <h1>Recommendations</h1>
                        <div className="recommed-slider" >
                            <Slider className="regular slider" {...settings}>

                                {recomendedProducts.slice(0, 8).map((product) => {
                                    return (
                                        <Link key={product.id} to={'/product-details/' + product.sku}><div className="productcalr" >
                                            <div className="product_img" ><img src={product.img} className="image-fluid" alt={product.name} /> </div>
                                            <div className="product_name"> {product.name} </div>
                                            <div className="product_price"> ${formatprice(product.price)}</div>
                                        </div>
                                        </Link>
                                    )
                                })}
                            </Slider>
                        </div>
                    </div>)}
            </div>
        </div>
    )
}

export default Recommendations