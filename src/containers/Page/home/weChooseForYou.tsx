import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import notification from "../../../components/notification";
import cartAction from "../../../redux/cart/productAction";
import { getWeChooseForYou } from '../../../redux/pages/customers';
import { Link } from 'react-router-dom'
import { addWhishlist, removeWhishlist } from '../../../redux/cart/productApi';
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";

const { addToCart, productList } = cartAction;

function WeChooseForYou(props) {
    const [token, setToken] = useState('');
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [products, setProducts] = useState([]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getWeChooseForYou(props.languages, customerId);
        if (result) {
            setProducts(result.data[0].relevantProducts);
        }
    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        // getProducts()

    }

    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        // getProducts()
    }

    return (
        <section className="width-100 my-5 choose-foryou-sec">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-title">
                            <h1><IntlMessages id="home.weChooseForYou" /></h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-slider">
                            <div className="regular slider">
                                <Slider {...settings}>
                                    {products.map((item, i) => {
                                        return (
                                            <Link className="productcalr" key={i} to={'/product-details/' + item.name}>
                                                <div className="product_img">
                                                    <img src={item.img} alt="productimage" className="image-fluid" />
                                                </div>
                                                <div className="product_name mt-2">  <Link to={'/product-details/' + item.sku}>{item.name} </Link></div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div>
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
    mapStateToProps,
    { addToCart, productList }
)(WeChooseForYou);