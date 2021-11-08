import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { getPriveExclusiveProducts } from '../../../redux/cart/productApi';
import cartAction from "../../../redux/cart/productAction";
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import { siteConfig } from '../../../settings';
import IntlMessages from "../../../components/utility/intlMessages";
import { getCookie } from '../../../helpers/session';

const { addToCart, productList } = cartAction;


function PriveExclusive(props) {
    const location = useLocation()
    let image = '', thumbnail = '';
    const language = getCookie('currentLanguage');
    const [products, setProducts] = useState({
        items: []
    });

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        let catID = getCookie("_TESTCOOKIE");
        getData(catID, lang);
    }, [props.languages, location]);

    const getData = async (catID, lang) => {
        let result: any = await getPriveExclusiveProducts(catID, lang);
        if (result) {
            result.data.items.forEach(el => {
                if (el.attribute_code === 'image') {

                }
            })
            setProducts(result.data);
        }
    }

    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title"><IntlMessages id="category.priceExclusive" /></h2>
                        <div className="carousel slide DC-carousel">
                            <div className="carousel-inner" >
                                <Slider {...settings}>
                                    {products.items.map((item, i) => {
                                        return (
                                            <div className="carousel-item" key={i}>
                                                <div className="row">
                                                    <div className="col-md-6 product-dummy">
                                                        {
                                                            item.custom_attributes.map((attributes) => {
                                                                if (attributes.attribute_code === 'image') {
                                                                    image = attributes.value;
                                                                }
                                                                if (attributes.attribute_code === 'thumbnail') {
                                                                    thumbnail = attributes.value;
                                                                }
                                                            })
                                                        }
                                                        <img src={image} alt={item.name} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="product-details-new">
                                                            <img src={thumbnail} alt="" />
                                                            <h4>{item.name}</h4>
                                                            <p></p>
                                                            <div className="pro-price-btn">
                                                            {siteConfig.currency} {formatprice(item.price)}
                                                                <Link to={'/product-details/' + item.sku}>View Product</Link></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Slider>
                            </div>

                            < button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
const mapStateToProps = (state) => {
    //  console.log(state);
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList }
)(PriveExclusive);