import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist, addToCartApi } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import CommonFunctions from "../../../commonFunctions/CommonFunctions";
import { getCookie } from '../../../helpers/session';
import { Pages, Pages1 } from '../../../redux/pages/allPages';
import axios from 'axios';
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const { addToCart, productList } = cartAction;


function Products(props) {
    let pageSize = 9;
    const [pagination, setPagination] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts();

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [sortValue, page])

    async function getProducts() {

        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory(page, pageSize, 'category', sortValue.sortBy, sortValue.sortByValue);
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
        let result1: any = Pages1('about-us');
        console.log(result1)
        props.productList(productResult);

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
        <div className="container" style={{ "marginTop": "200px" }}>
            <div className="col-auto">
                <select className="form-select" defaultValue={sort} onChange={filtterData} >
                    <option value={0} key="0" >Newest First</option>
                    <option value={1} key="1" >High to low -- price </option>
                    <option value={2} key="2" >Low to High -- price</option>
                    <option value={3} key="3" >Our picks</option>
                </select>
            </div>
            <div className="row">
                {props.items.map(item => {
                    return (
                        <div className="col-md-4" key={item.id}>
                            {token && (
                                <div>
                                    {!item.wishlist_item_id && (
                                        <span onClick={() => { handleWhishlist(item.id) }}  >Add Whishlist</span>
                                    )}
                                    {item.wishlist_item_id && (
                                        <span onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }}>Remove Whishlist</span>
                                    )}
                                </div>
                            )
                            }
                            <div className="card-one">
                                <div className="card">
                                    <img src={item.custom_attributes ? item.custom_attributes[0].value : item} alt={item.name} />
                                    <span className="card-title">{item.name}</span>
                                    {!token && (<Link to="#" onClick={() => { handleClick(item.id, item.sku) }} className="btn-floating halfway-fab waves-effect waves-light red" ><i className="material-icons">add</i></Link>
                                    )}
                                </div>

                                <div className="card-content">
                                    <p>{item.desc}</p>
                                    {(item.extension_attributes && item.extension_attributes.configurable_product_options && item.extension_attributes.configurable_product_options.length > 0) && (
                                        <div>{item.extension_attributes.configurable_product_options.map(varient => {
                                            return (
                                                <div key={varient.id}>
                                                    {varient.label}
                                                    {(varient.values.length > 0 && (
                                                        <div>
                                                            {
                                                                varient.values.map(val => {
                                                                    return (<p key={val.value_index}>{val.value_index}</p>)
                                                                })
                                                            }
                                                        </div>
                                                    ))}
                                                </div>

                                            )
                                        })}</div>

                                    )}
                                    <p><b>Price: {item.price}</b></p>
                                </div>
                            </div>
                        </div>
                    )
                })}
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
        </div >
    )
}
const mapStateToProps = (state) => {
    console.log(state);
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList }
)(Products);