import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { formatprice } from '../../../components/utility/allutils';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist
} from '../../../redux/cart/productApi';
import { useParams } from "react-router-dom";
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
import { useLocation } from 'react-router-dom';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList } = cartAction;

function NewIn(props) {
    const location = useLocation()
    let imageD = '', description = '';
    let catID = getCookie("_TESTCOOKIE");
    const { category, subcat } = useParams();
    const [pageSize, setPageSize] = useState(12);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts(catID);

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [sortValue, page, pageSize, location])

    async function getProducts(catID) {
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory(page, pageSize, catID, sortValue.sortBy, sortValue.sortByValue);
        //  console.log(Math.ceil(result.data.total_count / 9))
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
        //console.log(productResult)
        props.productList(productResult);
        // get product page filter
        //let result1: any = await getProductFilter(9);
        // console.log(result1)

    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        getProducts(catID)

    }
    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        getProducts(catID)
    }

    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }


    return (
        <div className=" container" style={{ 'opacity': opacity }}>
            <h1 className="mb-4"><IntlMessages id="category.explore"></IntlMessages></h1>
            <div className="row product-listing g-2">

                {props.items.slice(0, 7).map(item => {
                    return (
                        <div className="col-md-3" key={item.id}>
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
                                        <div className="product_img" onMouseEnter={() => someHandler(item.id)}
                                            onMouseLeave={() => someOtherHandler(item.id)}>

                                            {
                                                item.custom_attributes.map((attributes) => {
                                                    if (attributes.attribute_code === 'image') {
                                                        imageD = attributes.value;
                                                    }
                                                    if (attributes.attribute_code === 'short_description') {
                                                        description = attributes.value;
                                                    }
                                                })
                                            }
                                            {
                                                isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD} className="image-fluid hover" alt={item.name} height="150" /> : <img src={imageD} className="image-fluid" alt={item.name} height="150" />
                                            }
                                        </div >
                                    </div>
                                    <div className="about text-center">
                                        <h5>{item.name}</h5>
                                        <div className="tagname" dangerouslySetInnerHTML={{ __html: description }} />
                                        <div className="pricetag">${formatprice(item.price)}</div>
                                    </div>
                                    {/* {token && ( */}
                                    <div className="cart-button mt-3 px-2">
                                        <Link to={'/product-details/' + item.sku} className="btn btn-primary text-uppercase">
                                            View Product</Link>
                                        <div className="add">
                                            <span className="product_fav">
                                                <i className="fa fa-heart-o"></i></span>
                                            <span className="product_fav"><i className="fa fa-opencart"></i></span>
                                        </div>
                                    </div>
                                    {/* )} */}
                                </div>
                            </Link>
                        </div>
                    )
                })}
                <div className="col-md-3">
                    <div className="view-all-btn">
                        {
                            subcat !== undefined ? <Link to={`/products/${category}/${subcat}/all`} > <IntlMessages id="category.viewAll" /></Link> : <Link to={`/products/${category}/all`} > <IntlMessages id="category.viewAll" /></Link>
                        }

                    </div>
                </div>
            </div>
        </div >
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
)(NewIn);
