import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist, addToCartApi, getProductFilter, getGuestCart } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import Promotion from "../../partials/promotion";
import Recomendations from './product-details/recomendations';
import Filter from './filter';
const { addToCart, productList, addToCartTask } = cartAction;


function Products(props) {
    let imageD = '';
    const [pageSize, setPageSize] = useState(12);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
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
    }, [sortValue, page, pageSize])

    async function getProducts() {
        setOpacity(0.3);
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
        setOpacity(1);
        props.productList(productResult);
        // get product page filter
        //let result1: any = await getProductFilter(9);
        // console.log(result1)

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
    async function handleCart(id: number, sku: string) {
        let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
        let customer_id = localStorage.getItem('cust_id');

        let cartQuoteId = ''
        if (cartQuoteIdLocal) {
            cartQuoteId = cartQuoteIdLocal
        } else {
            let result: any = await getGuestCart();
            cartQuoteId = result.data
        }
        localStorage.setItem('cartQuoteId', cartQuoteId);
     //   console.log( localStorage.getItem('cartQuoteId'))
        let cartData = {
            "cartItem": {
                "sku": sku,
                "qty": 1,
                "quote_id": localStorage.getItem('cartQuoteId')
            }
        }

        addToCartApi(cartData,cartQuoteId)
        // props.addToCart(id);
        props.addToCartTask(true);
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
                                    <span>Results per page</span>
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
                                <div className="row g-2">
                                    {props.items.map(item => {
                                        return (
                                            <div className="col-md-4" key={item.id}>
                                                {/* <Link to={'/product-details/' + item.sku}> */}
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
                                                        <div className="pricetag">${item.price}</div>
                                                    </div>
                                                    {/* {token && ( */}
                                                    <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase">Add to cart</button>
                                                        <div className="add"> <span className="product_fav"><i className="fa fa-heart-o"></i></span> <span className="product_fav"><i className="fa fa-opencart"></i></span> </div>
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
                            <h1 className="text-center mb-4">Explore more</h1>
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


            <section className="my-5">
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
            </section>




        </main>
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
    { addToCart, productList, addToCartTask }
)(Products);