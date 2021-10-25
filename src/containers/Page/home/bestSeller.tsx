import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import cartAction from "../../../redux/cart/productAction";
import appAction from "../../../redux/app/actions";
import { formatprice } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";
import { menu } from '../../../redux/pages/allPages';
import { getHomePageProducts } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import notification from "../../../components/notification";
import { addWhishlist, getWhishlistItemsForUser, removeWhishlist } from '../../../redux/cart/productApi';
const { addToWishlistTask } = cartAction;
const { showSignin } = appAction;
function BestSeller(props) {
    const [token, setToken] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [bestseller, setBestseller] = useState([]);
    const [opacity, setOpacity] = useState(1);
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [catId, setCatId] = useState(52); //set default category here

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoPlay: true,
        arrows: true,

    };

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getData(catId);

        getCategories()
    }, [props.languages]);

    const getData = async (catId) => {
        let result: any = await getHomePageProducts(props.languages, 12, catId);
        let customer_id = localStorage.getItem('cust_id');
        if (result) {
            let productResult = result.data[0].bestSellers;
            if (customer_id) {
                let whishlist: any = await getWhishlistItemsForUser();
                let products = result.data[0].bestSellers;
                let WhishlistData = whishlist.data;
                //  console.log(WhishlistData)
                const mergeById = (a1, a2) =>
                    a1.map(itm => ({
                        ...a2.find((item) => (parseInt(item.id) === parseInt(itm.id)) && item),
                        ...itm
                    }));

                productResult = mergeById(products, WhishlistData);
                console.log(typeof (productResult))
            } else {
                productResult = result.data[0].bestSellers;

            }
            //  console.log(productResult)
            setBestseller(productResult);
            setOpacity(1);
        }
    }

    //get categories for the filter dropdown
    const getCategories = async () => {
        let result: any = await menu(props.languages);
        //console.log(result);
        let catList = [];
        if (result && result.data[0] && result.data[0].parent.child[0].child) {
            result.data[0].parent.child[0].child.forEach(el => {
                catList.push(el);
            })
        }
        setCategoriesList(catList);
    }

    const changeCategory = (e) => {
        setCatId(e.target.value);
        getData(e.target.value);
        setOpacity(0.3);
    }

    async function handleWhishlist(id: number) {
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);
            //     console.log(result);
            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", 'Your product has been successfully added to your wishlist');
                getData(catId);
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", "Something went wrong!");
                getData(catId);
            }
        } else {
            props.showSignin(true);
        }
    }


    async function handleDelWhishlist(id: number) {
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("success", "", del.data[0].message);
            getData(catId);
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", "Something went wrong!");
            getData(catId);
        }
    }
    const someHandler = (id) => {
        let prod = parseInt(id)
        // console.log(prod, typeof (prod))
        setIsHoverImage(prod)
        // console.log(typeof(isHoverImage));
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }

    return (
        <section className="width-100 my-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="resltspage_sec bestseller-sec">
                            <div className="paginatn_result">
                                <div className="new-in-title">
                                    <h1><IntlMessages id="home.bestseller" /></h1>
                                </div>

                            </div>
                            <div className="sort_by">
                                <div className="sortbyfilter">
                                    <h3><IntlMessages id="home.show" /></h3>
                                    <select className="form-select customfliter" value={catId} aria-label="Default select example" onChange={changeCategory}>
                                        {categoriesList.map((cat, i) => {
                                            return (<option value={cat.id} key={i}>{cat.name} </option>)
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {bestseller.length > 0 && (
                    <div className="row" style={{ 'opacity': opacity }}>
                        <div className="col-sm-12">
                            <div className="new-in-slider product-listing">
                                <div className="regular slider">
                                    <Slider {...settings}>
                                        {bestseller && bestseller.map(item => {
                                            return (
                                                <div className="productcalr product" key={item.id}>
                                                    <span className="off bg-favorite">
                                                        {!item.wishlist_item_id && (
                                                            <div>{isWishlist === item.id ? <i className="fas fa-circle-notch fa-spin"></i> : <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>}
                                                            </div>
                                                        )}

                                                        {item.wishlist_item_id && (
                                                            <div>{delWishlist === parseInt(item.wishlist_item_id) ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>}
                                                            </div>
                                                        )}
                                                    </span>
                                                    <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                        onMouseLeave={() => someOtherHandler(item.id)}>
                                                        {
                                                            isHoverImage === parseInt(item.id) ? <img src={item.hover_image} className="image-fluid hover" alt={item.name} height="150" /> : <img src={item.img} className="image-fluid" alt={item.name} height="150" />
                                                        }
                                                    </div>
                                                    <div className="product_name"> {item.name} </div>
                                                    <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div>
                                                    <div className="product_price"> ${formatprice(item.price)}</div>
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
                )}
            </div>
        </section>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language
    }
}

export default connect(
    mapStateToProps,
    { addToWishlistTask, showSignin }
)(BestSeller);