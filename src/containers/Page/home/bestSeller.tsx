import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import cartAction from "../../../redux/cart/productAction";
import appAction from "../../../redux/app/actions";
import { formatprice, getHomePageProductsFxn, handleCartFxn } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import notification from "../../../components/notification";
import { siteConfig } from '../../../settings';
import { addWhishlist, getCategoryList, removeWhishlist } from '../../../redux/cart/productApi';
import { useIntl } from 'react-intl';
const { addToWishlistTask, addToCartTask } = cartAction;
const { showSignin } = appAction;
function BestSeller(props) {
    const [token, setToken] = useState('');
    const [isShow, setIsShow] = useState(0);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [bestseller, setBestseller] = useState([]);
    const [opacity, setOpacity] = useState(1);
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [catId, setCatId] = useState(props.categoryD);
    const intl = useIntl();
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoPlay: true,
        arrows: true,
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
    useEffect(() => {
        const localToken = props.token.token;
        setToken(localToken)
        setBestseller(props.bestSeller)
        getCategories()
        return () => {
            setBestseller([]);
        }
    }, [props.bestSeller, props.currentCAT, props.languages])

    const getData = async (catId) => {
        let result: any = await getHomePageProductsFxn(props.languages, catId);
        //console.log(result['bestSeller']) 
        setBestseller(result['bestSeller']);
    }

    //get categories for the filter dropdown
    const getCategories = async () => {
        let results: any = await getCategoryList(props.languages, props.categoryD);
        if (results && results.data && results.data.items) {
            setCategoriesList(results.data.items)
        }

    }

    const changeCategory = (e) => {
        setCatId(e.target.value);
        getData(e.target.value !== 'All' ? e.target.value : 178);
        setOpacity(0.3);
    }

    async function handleWhishlist(id: number) {
        console.log(catId)
        const token = props.token.token;
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);
            //     console.log(result);
            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", intl.formatMessage({ id: "addedToWhishlist" }));
                getData(catId);
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
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
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
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

    async function handleCart(id: number, sku: string) {
        setIsShow(id);
        let cartResults: any = await handleCartFxn(id, sku);
        if (cartResults.item_id) {
            props.addToCartTask(true);
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(0);
        } else {
            if (cartResults.message) {
                notification("error", "", cartResults.message);
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
            setIsShow(0);
        }
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
                                        <option>{intl.formatMessage({ id: "selectcat" })}</option>
                                        {categoriesList.map((cat, i) => {
                                            return (<option value={cat.id} key={i}>{cat.name} </option>)
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {bestseller && bestseller.length > 0 ? (
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
                                                    <Link to={'/product-details/' + item.sku}>
                                                        <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                                            onMouseLeave={() => someOtherHandler(item.id)}>
                                                            {
                                                                isHoverImage === parseInt(item.id) ? <img src={item.hover_image} className="image-fluid hover" alt={item.name} height="150" /> : <img src={item.img} className="image-fluid" alt={item.name} height="150" />
                                                            }
                                                        </div>
                                                    </Link>
                                                    <div className="product_name"><Link to={'/search/' + item.brand}>{item.brand}</Link></div>
                                                    <div className="product_vrity"> <Link to={'/product-details/' + item.sku}> {item.name}</Link> </div>
                                                    <div className="product_price">{siteConfig.currency}{formatprice(item.price)} </div>
                                                    <div className="cart-button mt-3 px-2">
                                                        {isShow === item.id ? <Link to="#" className="btn btn-primary text-uppercase"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></Link> :
                                                            <Link to="#" onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase"><IntlMessages id="product.addToCart" /></Link>}

                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : <IntlMessages id="NotFound" />}
            </div>
        </section>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        items: state.Cart.items,
        token: state.session.user,
        currentCAT: state.Cart.catname,
        categoryD: state.Cart.catIdd,
        languages: languages,
    }
}

export default connect(
    mapStateToProps,
    { addToWishlistTask, showSignin, addToCartTask }
)(BestSeller);