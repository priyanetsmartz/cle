import { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatprice } from '../../../../components/utility/allutils';
import { Link } from "react-router-dom";
import IntlMessages from "../../../../components/utility/intlMessages";
import { getProductDetails } from '../../../../redux/cart/productApi';
import { connect } from 'react-redux';
import cartAction from "../../../../redux/cart/productAction";
const { addToCartTask } = cartAction;
const Recommendations = (props) => {
    const [recomendedProducts, setRecomendedProducts] = useState([]);
    const [slidetoshow, setSlidetoshow] = useState(4);
    // console.log(recomendedProducts)
    useEffect(() => {

        if (props.recomended.length > 0) {
            getAttributes(props.recomended);
        }

        return () => {
            // mounted = false
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.recomended])

    async function getAttributes(recomendedProducts) {
        let allProducts: any;
        // console.log(recomendedProducts)
        if (recomendedProducts && recomendedProducts.length > 0 && recomendedProducts[0].link_type) {
            var filteredItems = await recomendedProducts.filter(function (item) {
                return item.link_type === 'related';
            });

            allProducts = await getgidtMessageCall(filteredItems)
        } else {

            allProducts = recomendedProducts;
        }
        let prods = allProducts.length > 8 ? allProducts.slice(0, 8) : allProducts;
        setSlidetoshow(prods.length)
        setRecomendedProducts(prods)
    }
    async function getgidtMessageCall(items) {
        // console.log(items)
        const promises = [];
        items.forEach(async (i) => {
            promises.push(new Promise((resolve, reject) => {
                const res: any = someAPICall(i);
                resolve(res);
            }));
        })
        const result = await Promise.all(promises);
        return result;
    }

    async function someAPICall(product) {
        let giftCall: any = await getProductDetails(product.linked_product_sku);
        // console.log(giftCall.data)
        return giftCall.data;
        // return giftCall.data;
    }
    const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: slidetoshow,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 2000
    };
    return (
        <div className="container">
            <div className="col-sm-12">
                {(recomendedProducts && recomendedProducts.length) ? (
                    <div className="recommendations-section text-center ">
                        <h1> <IntlMessages id="product.recommendations" /></h1>
                        <div className="recommed-slider" >
                            <Slider className="regular slider" {...settings}>
                                {recomendedProducts.map((product, i) => {
                                    let imageD = '';

                                    return (
                                        <Link key={i} to={'/product-details/' + product.sku}>
                                            <div className="productcalr" >
                                                {
                                                    product.custom_attributes.map((attributes) => {
                                                        if (attributes.attribute_code === 'image') {
                                                            imageD = attributes.value;
                                                        }
                                                    })
                                                }
                                                <div className="product_img" style={{
                                                    "width": "180px", "height": "192px"
                                                }} ><img src={product.img ? product.img : imageD} className="image-fluid" style={{ "width": "100%" }} alt={product.name} /> </div>
                                                <div className="product_name"> {product.name} </div>
                                                <div className="product_price"> ${formatprice(product.price)}</div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </Slider>
                        </div>
                    </div>) : ""}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log(state)
    let recomended = [];
    if (state && state.Cart.recomended.length > 0) {
        recomended = state.Cart.recomended;
    }
    return {
        recomended: recomended
    }
}
export default connect(
    mapStateToProps,
    {}
)(Recommendations);