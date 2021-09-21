import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist,
    addToCartApi, getProductFilter
} from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import cartAction from "../../../redux/cart/productAction";
import WeChooseForYou from '../home/weChooseForYou';
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";
const { addToCart, productList } = cartAction;


function LatestProducts(props) {
    let imageD = '';
    const [pageSize, setPageSize] = useState(12);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    useEffect(() => {
        getProducts();
    }, []);

    async function getProducts() {
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory(page, pageSize, 'category', sortValue.sortBy, sortValue.sortByValue);
        setPagination(Math.ceil(result.data.total_count / pageSize));
        let productResult = result.data.items;
        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            let products = result.data.items;
            let WhishlistData = whishlist.data;
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                    ...itm
                }));

            productResult = mergeById(products, WhishlistData);

        }
        setOpacity(1);

        props.productList(productResult);
        // get product page filter
        let result1: any = await getProductFilter(9);
        // console.log(result1);
        // console.log(props.items);

    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        getProducts()

    }
    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        getProducts()
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
        <section className="exclusive-tab">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-tabs justify-content-center" id="DesignerTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <Link to="#" className="nav-link active" id="PD-tab" data-bs-toggle="tab" data-bs-target="#PD" type="button"
                                    role="tab" aria-controls="PD" aria-selected="true"><IntlMessages id="category.latestProducts" /></Link>
                            </li>
                            <li className="nav-item" role="presentation">
                                <Link to="#" className="nav-link" id="D-maylike-tab" data-bs-toggle="tab" data-bs-target="#D-maylike" type="button"
                                    role="tab" aria-controls="D-maylike" aria-selected="false"><IntlMessages id="home.weChooseForYou" /></Link>
                            </li>

                        </ul>
                        <div className="tab-content" id="DesignerTabContent">
                            <div className="tab-pane fade show active" id="PD" role="tabpanel" aria-labelledby="PD-tab">
                                <div className="row">
                                    <Slider {...settings}>
                                        {props.items.map(item => {
                                            return (
                                                <div className="col-md-4" key={item.id}>
                                                    <Link to={'/product-details/' + item.sku}>
                                                        <div className="product py-4">
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

                                                            <div className="text-center">
                                                                {
                                                                    item.custom_attributes.map((attributes) => {
                                                                        if (attributes.attribute_code === 'image') {
                                                                            imageD = attributes.value;
                                                                        }
                                                                    })
                                                                }
                                                                <img src={imageD} alt={item.name} width="200" />
                                                            </div>
                                                            <div className="about text-center">
                                                                <h5>{item.name}</h5>
                                                                <div className="tagname">{item.desc}</div>
                                                                <div className="pricetag">${formatprice(item.price)}</div>
                                                            </div>
                                                            {/* {token && ( */}
                                                            <div className="cart-button mt-3 px-2"> <button onClick={() => { handleClick(item.id, item.sku) }} className="btn btn-primary text-uppercase">Add to cart</button>
                                                                <div className="add"> <span className="product_fav"><i className="fa fa-heart-o"></i></span> <span className="product_fav"><i className="fa fa-opencart"></i></span> </div>
                                                            </div>
                                                            {/* )} */}
                                                        </div>
                                                    </Link>
                                                </div>
                                            )
                                        })}
                                    </Slider>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="D-maylike" role="tabpanel" aria-labelledby="D-maylike-tab">
                                <div className="row">
                                    <WeChooseForYou />
                                </div>
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
)(LatestProducts);