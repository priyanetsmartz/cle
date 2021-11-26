import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link, useLocation } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { formatprice } from '../../../components/utility/allutils';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist, addToCartApi,
    getProductFilter, getGuestCart, addToCartApiGuest, createGuestToken
} from '../../../redux/cart/productApi';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { Pages1 } from '../../../redux/pages/allPages';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import { siteConfig } from '../../../settings';
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList } = cartAction;

function PromotedProducts(props) {
    let imageD = '', description = '';
    const location = useLocation()
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [opacity, setOpacity] = useState(1);

    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });

    const language = getCookie('currentLanguage');
    const baseUrl = process.env.REACT_APP_API_URL;
    //check with magento team
    const [catId, setCatId] = useState(153)// for promoted products
    const [category, setCategory] = useState({
        name: '',
        custom_attributes: [],
        custom: {
            image: '',
            desc: ''
        }
    })
    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        const localToken =props.token.token;
        setToken(localToken)
        getProducts();
        setCategory(props.cateData);

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages, location, props.cateData])



    async function getProducts() {
        setOpacity(0.3);
        let customer_id = props.token.cust_id;
        let result: any = await getProductByCategory(1, 2, catId, sortValue.sortBy, sortValue.sortByValue, props.languages);
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
            if (WhishlistData) {
                productResult = mergeById(products, WhishlistData);
            } else {
                productResult = products
            }


        }
        setOpacity(1);
        //console.log(productResult)
        props.productList(productResult);
        // get product page filter
        //let result1: any = await getProductFilter(9);
        // console.log(result1)

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

    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }

    return (
        <section className="new-in-brand-sec">
            <div className="container">
                <div className="col-sm-12">
                    <div className="magazine_article ">
                        <h1 className="mb-4">{category.name}</h1>
                        {/* <p className="new-in-brand-desc">They love to study fashion trends, sketch designs, select materials,
                            and have a part in all the production aspects of their designs.</p> */}
                        <div dangerouslySetInnerHTML={{ __html: category.custom.desc }} />
                        <div className="row">

                            <div className="col-sm-5">
                                <div className="new-in-brandMainPic">
                                    <img src={category.custom.image} alt="" className="img-fluid" />
                                    <Link to="/products/promoted" className="BrandMainPic-btn">
                                        <IntlMessages id="category.viewAll" /></Link>
                                </div>
                            </div>

                            <div className="col-sm-7">
                                <div className="brand-pro-list row product-listing">
                                    {props.items.slice(0, 2).map(item => {
                                        return (
                                            <div className="col-md-6" key={item.id}>

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

                                                    <div className="text-center" onMouseEnter={() => someHandler(item.id)}
                                                        onMouseLeave={() => someOtherHandler(item.id)}>
                                                        {
                                                            item.custom_attributes.map((attributes) => {
                                                                if (attributes.attribute_code === 'image') {
                                                                    imageD = attributes.value;
                                                                }
                                                                if (attributes.attribute_code === 'description') {
                                                                    description = attributes.value.substr(0, 50);
                                                                }
                                                            })
                                                        }
                                                        {
                                                            isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD} className="image-fluid hover" alt={item.name} height="200" /> : <img src={imageD} className="image-fluid" alt={item.name} height="200" />
                                                        }
                                                    </div>
                                                    <div className="about text-center">
                                                        <h5>{item.name}</h5>
                                                        <div className="tagname" dangerouslySetInnerHTML={{ __html: description }} />...
                                                        <div className="pricetag">{siteConfig.currency} {formatprice(item.price)}</div>
                                                    </div>
                                                    {/* {token && ( */}
                                                    <div className="cart-button mt-3 px-2">
                                                        <Link to={'/product-details/' + item.sku} className="btn btn-primary text-uppercase">View Product</Link>
                                                        <div className="add"> <span className="product_fav"><i className="fa fa-heart-o"></i></span> <span className="product_fav"><i className="fa fa-opencart"></i></span> </div>
                                                    </div>
                                                    {/* )} */}
                                                </div>
                                            </div>
                                        )
                                    })}
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
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList }
)(PromotedProducts);