import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getPriveExclusiveProducts } from '../../../redux/cart/productApi';
import { addToCartApi } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import cartAction from "../../../redux/cart/productAction";
import Slider from "react-slick";
const { addToCart, productList } = cartAction;


function PriveExclusive(props) {
    const [catId, setCatId] = useState(52);
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
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getPriveExclusiveProducts(catId);
        // console.log(result.data.items);
        if (result) {
            setProducts(result.data);
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



    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title">Privé Exclusives</h2>
                        <div className="carousel slide DC-carousel">
                            <div className="carousel-inner" >
                                <Slider {...settings}>
                                    {products.items.map((item, i) => {
                                        return (
                                            <div className="carousel-item" key={i}>
                                                <div className="row">
                                                    <div className="col-md-6 product-dummy"><img src={item.custom_attributes[1]?.value} alt="" /></div>
                                                    <div className="col-md-6">
                                                        <div className="product-details-new">
                                                            <img src="images/elvibswh.png" alt="" />
                                                            <h4>{item.name}</h4>
                                                            <p></p>
                                                            <div className="pro-price-btn">{item.price}<a onClick={() => { handleClick(item.id, item.sku) }}>Add to Cart</a></div>
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