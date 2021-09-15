import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getPriveExclusiveProducts } from '../../../redux/cart/productApi';
import { addToCartApi } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import cartAction from "../../../redux/cart/productAction";
const { addToCart, productList } = cartAction;


function PriveExclusive(props) {
    const [catId, setCatId] = useState(52);
    const [activeSlide, setActiveSlide] = useState(0);
    const [products, setProducts] = useState({
        items: []
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getPriveExclusiveProducts(catId);
        console.log(result.data.items);
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


    const nextSlide = () => {
        if (products.items[activeSlide + 1]) {
            setActiveSlide(activeSlide + 1);
        } else {
            setActiveSlide(0);
        }
    }

    const preSlide = () => {
        if (products.items[activeSlide - 1]) {
            setActiveSlide(activeSlide - 1);
        } else {
            setActiveSlide(products.items.length - 1);
        }
    }


    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title">Privé Exclusives</h2>
                        <button onClick={preSlide}>Pre</button>
                        <button onClick={nextSlide}>Next</button>
                        <div className="carousel slide DC-carousel">
                            <div className="carousel-inner" >
                                {products.items.map((item, i) => {
                                    return (
                                        <div className={`carousel-item ${i == activeSlide ? 'active' : ''}`} key={i}>
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