import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import notification from "../../../components/notification";
import cartAction from "../../../redux/cart/productAction";
import { getWeChooseForYou } from '../../../redux/pages/customers';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist, addToCartApi,
    getProductFilter, getGuestCart, addToCartApiGuest, createGuestToken
} from '../../../redux/cart/productApi';
import Slider from "react-slick";


const { addToCart, productList } = cartAction;

function WeChooseForYou(props) {
    const [token, setToken] = useState('');
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
        // console.log(result);
        if (result) {
            setProducts(result.data[0].relevantProducts);
        }
    }


    function handleClick(id: number, sku: string) {
        let cartData = {
            "cartItem": {
                "sku": sku,
                "qty": 1,
                "quote_id": localStorage.getItem('cartQuoteId')
            }
        }
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            addToCartApi(cartData)
        }
        props.addToCart(id);
        notification("success", "", "Item added to cart");
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
                            <h1>We choose for you</h1>
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
                                            <div className="productcalr" key={i}>
                                                {token && (
                                                    <span className="off bg-favorite">
                                                        {!item.wishlist_item_id && (
                                                            <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>
                                                        )}
                                                        {item.wishlist_item_id && (
                                                            <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>
                                                        )}
                                                    </span>
                                                )
                                                }
                                                <div className="product_img">
                                                    <img src={item.img} className="image-fluid" />
                                                </div>
                                                <div className="product_name mt-2">{item.name} </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div>
                                                <div className="product_price"> {item.price}</div>
                                                <div className="pro-price-btn">
                                                    {item.price}<a onClick={() => { handleClick(item.id, item.sku) }}>Add to Cart</a>
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
    mapStateToProps,
    { addToCart, productList }
)(WeChooseForYou);