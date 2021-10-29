import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link, useLocation, useParams } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import appAction from "../../../redux/app/actions";
import { addWhishlist, getAllProducts, getWhishlistItemsForUser, getProductByCategory, removeWhishlist } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
import Recomendations from './product-details/recomendations';
import Description from '../categories/description';
import Filter from './filter';
import { formatprice } from '../../../components/utility/allutils';
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const productUrl = `${baseUrl}/pub/media/catalog/product/cache/a09ccd23f44267233e786ebe0f84584c/`;
const { addToCart, productList, addToCartTask, addToWishlistTask } = cartAction;
const { showSignin } = appAction;


function Products(props) {
    const location = useLocation();
    const { category } = useParams();
    let imageD = '', description = '';
    let catID = getCookie("_TESTCOOKIE");
    const [isShow, setIsShow] = useState(0);
    const [isHoverImage, setIsHoverImage] = useState(0);
    const [isCategory, setIsCategory] = useState(props.match.path.split('/')[2] ? true : false);
    const [catId, setCatId] = useState(catID);// change to dynamic id
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');


    useEffect(() => {
        let catID = getCookie("_TESTCOOKIE");

        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts(catID);

        return () => {
            props.addToCartTask(false);
            props.addToWishlistTask(true);
        }
    }, [sortValue, page, pageSize, props.languages, location])

    async function getProducts(catID) {
        let lang = props.languages ? props.languages : language;
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let result: any;
        if (category) {
      
            result = await getProductByCategory(page, pageSize, catID, sortValue.sortBy, sortValue.sortByValue, props.languages);
        } else {
    
            result = await getAllProducts(lang, page, pageSize, sortValue.sortBy, sortValue.sortByValue);
        }
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
        props.productList(productResult);

    }
    const filtterData = (event) => {
        let sortBy = "created_at";
        let sortByValue = "desc";
        if (event.target.value === "1") {
            sortBy = "price";
            sortByValue = "desc";
        } else if (event.target.value === "2") {
            sortBy = "price";
            sortByValue = "asc";
        }

        setSort(event.target.value);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })

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
                getProducts(catID)
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", "Something went wrong!");
                getProducts(catID)
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
            getProducts(catID)
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", "Something went wrong!");
            getProducts(catID)
        }
    }
    const handlePageSize = (page) => {
        setPageSize(page)
    }
    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / 4) * 4;
        let fill = pagination > 5 ? 4 : pagination;
        return new Array(fill).fill(fill).map((_, idx) => start + idx + 1);
    };

    const goToNextPage = (e) => {
        let lang = props.languages ? props.languages : language;
        e.preventDefault();
        setCurrent((page) => page + 1);

    }
    function changePage(event) {
        let lang = props.languages ? props.languages : language;

        event.preventDefault()
        const pageNumber = Number(event.target.textContent);
        setCurrent(pageNumber);
    }
    const goToPreviousPage = (e) => {
        let lang = props.languages ? props.languages : language;

        e.preventDefault();
        setCurrent((page) => page - 1);

    }
    const someHandler = (id) => {
        let prod = parseInt(id)
        setIsHoverImage(prod);
    }

    const someOtherHandler = (e) => {
        setIsHoverImage(0)
    }


    return (
        <main>
            {/* <Promotion /> */}
            {/* <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="#">Products</Link></li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

            </section> */}


            <section>
                <div className="container">
                    <div className="row">
                        {/* Filter sidebar start*/}
                        <Filter />
                        {/* Filter sidebar end */}
                        <div className="col-sm-9">
                            <div className="resltspage_sec">
                                <div className="paginatn_result">
                                    <span><IntlMessages id="product.results" /></span>
                                    <ul>
                                        <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                        <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                        <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                                    </ul>
                                </div>
                                <div className="sort_by">
                                    <div className="sortbyfilter">
                                        <select className="form-select customfliter" aria-label="Default select example" defaultValue={sort} onChange={filtterData} >
                                            <option value={3} key="3" >Our picks</option>
                                            <option value={0} key="0" >Newest First</option>
                                            <option value={1} key="1" >High to low -- price </option>
                                            <option value={2} key="2" >Low to High -- price</option>

                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="product-listing" style={{ 'opacity': opacity }}>
                                <div className="row g-2">
                                    {props.items.map(item => {
                                        return (
                                            <div className="col-md-4" key={item.id}>
                                                {/* <Link to={'/product-details/' + item.sku}> */}
                                                <div className="product py-4">

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

                                                    <div className="text-center" onMouseEnter={() => someHandler(item.id)}
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
                                                        <Link to={'/product-details/' + item.sku}>
                                                            {isHoverImage === parseInt(item.id) ? <img src={item.media_gallery_entries.length > 2 ? `${productUrl}/${item.media_gallery_entries[1].file}` : imageD} className="image-fluid hover" alt={item.name} height="150" /> : <img src={imageD} className="image-fluid" alt={item.name} height="150" />
                                                            }</Link>
                                                    </div>
                                                    <div className="about text-center">
                                                        <h5>{item.name}</h5>
                                                        <div className="tagname" dangerouslySetInnerHTML={{ __html: description }} />
                                                        <div className="pricetag">${formatprice(item.price)}</div>
                                                    </div>
                                                    {/* {item.type_id === 'simple' && (
                                                        <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase">{isShow === item.id ? "Adding....." : "Add to cart"}</button>
                                                        </div>
                                                    )}
                                                    {item.type_id === 'configurable' && ( */}
                                                    <div className="cart-button mt-3 px-2">
                                                        <Link to={'/product-details/' + item.sku} className="btn btn-primary text-uppercase">View Product</Link>
                                                    </div>
                                                    {/* )} */}

                                                </div>
                                                {/* </Link> */}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="resltspage_sec footer-pagints">
                                <div className="paginatn_result">
                                    <span>Results per page</span>
                                    <ul>
                                        <li><Link to="#" className={pageSize === 12 ? "active" : ""} onClick={() => { handlePageSize(12) }} >12</Link></li>
                                        <li><Link to="#" className={pageSize === 60 ? "active" : ""} onClick={() => { handlePageSize(60) }} >60</Link></li>
                                        <li><Link to="#" className={pageSize === 120 ? "active" : ""} onClick={() => { handlePageSize(120) }}>120</Link></li>
                                    </ul>
                                </div>
                                <div className="page_by">
                                    <div className="pagination">

                                        <div className="col-md-12 pagination">
                                            {pagination > 1 && (<nav aria-label="Page navigation example">
                                                <ul className="pagination justify-content-center">
                                                    <li
                                                        className={`page-item prev ${page === 1 ? 'disabled' : ''}`}>
                                                        <Link onClick={(e) => { goToPreviousPage(e); }} to="#" className="page-link" aria-disabled="true">Previous</Link>
                                                    </li>
                                                    {getPaginationGroup().map((i, index) => (
                                                        <li className="page-item" key={i}><Link className="page-link" onClick={changePage} to="#">{i}</Link></li>
                                                    ))}
                                                    <li className={`page-item next ${page === pagination ? 'disabled' : ''}`} >
                                                        <Link className="page-link" onClick={(e) => { goToNextPage(e); }}
                                                            to="/">Next</Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            <section className="mb-5">
                <Recomendations />
            </section>

            <section className="my_profile_sect check-als mb-5">
                <div className="container">

                    <div className="row">
                        <div className="col-sm-12">
                            <h1 className="text-center mb-4"><IntlMessages id="products.exploreMore" /></h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary">New designers</button>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary">New designers</button>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-1">
                            <div className="d-grid ">
                                <button type="button" className="btn btn-secondary">New designers</button>
                            </div>
                        </div>
                    </div>



                </div>
            </section>

            {/* <section className="my-5">
                <div className="container">
                    <div className="row">
                        <div className="versace_sec">
                            <h4>CLé Versace</h4>
                            <p>Founded in 1978 in Milan, Gianni Versace S.r.l. is one of the leading international fashion design houses
                                and a symbol of Italian luxury world-wide. It designs, manufactures, distributes and retails fashion and
                                lifestyle products including haute couture, prèt-à-porter, accessories, jewellery, watches, eyewear,
                                fragrances, and home furnishings all bearing the distinctive Medusa logo. The Versace Group distributes
                                its products through a world-wide D.O.S network which includes over 200 boutiques in the principal cities
                                and over 1500 wholesalers worldwide. Donatella Versace has been Artistic Director of Versace since 1997
                                and has steered the brand into the 21st century. Today, Versace represents its heritage through its strong
                                and fearless designs, while addressing a new global audience which continues to strengthen Versace’s
                                position in contemporary culture.</p>
                        </div>
                    </div>
                </div>
            </section> */}
            <Description catId={153} />

        </main>
    )
}
const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        items: state.Cart.items,
        wishlist: state.Cart.addToWishlistTask,
        languages: languages
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList, addToCartTask, addToWishlistTask, showSignin }
)(Products);