import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import { getCookie } from '../../helpers/session';
import { siteConfig } from '../../settings/index';
import IntlMessages from "../../components/utility/intlMessages";
import notification from "../../components/notification";
import Filter from '../Page/product/filter';
import { searchFields, addWhishlist, getWhishlistItemsForUser, removeWhishlist } from '../../redux/cart/productApi';
import { capitalize } from '../../components/utility/allutils';
import appAction from "../../redux/app/actions";
const { showSignin } = appAction;

function SearchResults(props) {
    let pageSizeNumber = siteConfig.pageSize;
    const { searchText, cat } = useParams();
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizeNumber);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);

    let imageD = '', description = '';
    const language = getCookie('currentLanguage');
    const [autoSuggestions, SetAutoSuggestions] = useState([]);

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        getData(searchText)
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [searchText, sortValue, page, pageSize, props.languages, cat])

    const getData = async (e) => {
        //console.log(searchText)
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let lang = props.languages ? props.languages : language;
        let results: any;
        // console.log(cat)
        if (searchText === 'all' && cat) {
            results = await searchFields(searchText, cat, pageSizeNumber, lang, sortValue.sortBy, sortValue.sortByValue);
        } else if (searchText === 'all' && cat === 'all') {
            results = await searchFields(searchText, 0, pageSizeNumber, lang, sortValue.sortBy, sortValue.sortByValue);
        } else {
            results = await searchFields(searchText, cat, pageSizeNumber, lang, sortValue.sortBy, sortValue.sortByValue);
        }

        setPagination(Math.ceil(results.data.total_count / pageSize));
        let productResult = results.data.items;
        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            let products = results.data.items;
            let WhishlistData = whishlist.data;
          //  console.log(products);
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                    ...itm
                }));
            if (products) {
                productResult = mergeById(products, WhishlistData);
            }

            // console.log(productResult)

        }
        setOpacity(1);
        SetAutoSuggestions(productResult);
    }

    const filtterData = (event) => {
        let lang = props.languages ? props.languages : language;
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
                getData(searchText)
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", "Something went wrong!");
                getData(searchText)
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
            getData(searchText)
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", "Something went wrong!");
            getData(searchText)
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

    return (
        <div className="container">
            <div className="row">
                {/* Filter sidebar start*/}
                <Filter />
                {/* Filter sidebar end */}
                <div className="col-sm-9">
                    <div className="search_keyword"><h1>"{capitalize(searchText)}"</h1></div>
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
                                    <option value={0} key="0" >Newest First</option>
                                    <option value={1} key="1" >High to low -- price </option>
                                    <option value={2} key="2" >Low to High -- price</option>
                                    <option value={3} key="3" >Our picks</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="product-listing" style={{ 'opacity': opacity }}>
                        {(autoSuggestions && autoSuggestions.length) ? (
                            <div className="row g-2">
                                {autoSuggestions.map(item => {
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

                                                <div className="text-center">
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
                                                    <Link to={'/product-details/' + item.sku}><img src={imageD} alt={item.name} width="200" /></Link>
                                                </div>
                                                <div className="about text-center">
                                                    <h5>{item.name}</h5>
                                                    <div className="tagname" dangerouslySetInnerHTML={{ __html: description }} />
                                                    <div className="pricetag">${item.price}</div>
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
                        ) : "Nothing found!"}
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

    )
}


const mapStateToProps = (state) => {
    //console.log(state)
    return {
        languages: state.LanguageSwitcher.language,
    }
}
export default connect(
    mapStateToProps,
    { showSignin }
)(SearchResults);