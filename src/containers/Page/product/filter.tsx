import { useState, useEffect } from 'react';
import { getProductsFilterRestCollection, getProductsFilterRestCollectionProducts, getWhishlistItemsForUser } from "../../../redux/cart/productApi";
import cartAction from "../../../redux/cart/productAction";
import { connect } from "react-redux";
import { getCookie } from "../../../helpers/session";
const { productList, loaderProducts } = cartAction;
function Filters(props) {
    let catID = props.catid;
    const [filters, setFilters] = useState([]);
    const [total, setTotal] = useState(0);
    const [catState, setCatState] = useState(catID);
    const [currentFilter, setCurrentFilter] = useState('')
    useEffect(() => {

        const localToken = props.token.token;
        main(catID);

        return () => {
            //
        }
    }, [props.languages, props.filterval, props.pageeSize, props.catid])

    async function main(catID) {

        let catt = catState ? catState : catID;

        let filter: any = await getProductsFilterRestCollection(catt, props.languages, props.filterval, props.pageeSize);
        let customer_id = props.token.cust_id;
        let total = 0, aggregations = [], items = [];

        if (filter && filter.data && filter.data.length > 0 && filter.data[0].data && filter.data[0].data.products) {
            aggregations = filter.data[0].data.products.aggregations;
            total = filter.data[0].data.products.total_count;
            items = filter.data[0].data.products.items;
            let productResult = filter.data[0].data.products.items;
            if (customer_id) {
                let whishlist: any = await getWhishlistItemsForUser();
                let products = items;
                let WhishlistData = whishlist.data;
                if (WhishlistData && WhishlistData.length > 0) {
                    const mergeById = (a1, a2) =>
                        a1.map(itm => ({
                            ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                            ...itm
                        }));

                    productResult = mergeById(products, WhishlistData);
                }
            }
            props.loaderProducts(false);
            props.productList(productResult);
        }
        setTotal(total)
        setFilters(aggregations)


    }
    const currentvalue = async (e) => {
        e.preventDefault();
        let customer_id = props.token.cust_id;
        let catID = getCookie("_TESTCOOKIE");
        let attribute_code = e.target.getAttribute("data-remove");
        let value = (e.target.value)
        let catt = e.target.value ? e.target.value : catID;
        if (attribute_code === 'category_id') {
            setCatState(e.target.value)
        } else {
            setCatState(catID)
        }

        setCurrentFilter(e.target.value)
        props.loaderProducts(true);
        let filter: any = await getProductsFilterRestCollectionProducts(catt, props.languages, attribute_code, value, props.filterval, props.pageeSize);
        let total = 0, items = [];
        if (filter && filter.data && filter.data.length > 0 && filter.data[0].data && filter.data[0].data.products) {
            total = filter.data[0].data.products.total_count;
            items = filter.data[0].data.products.items;
            let productResult = filter.data[0].data.products.items;
            if (customer_id) {
                let whishlist: any = await getWhishlistItemsForUser();
                let products = items;
                let WhishlistData = whishlist.data;
                if (WhishlistData && WhishlistData.length > 0) {
                    const mergeById = (a1, a2) =>
                        a1.map(itm => ({
                            ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                            ...itm
                        }));

                    productResult = mergeById(products, WhishlistData);
                }


            }

            props.productList(productResult);
        }
        props.loaderProducts(false);
        setTotal(total)

    }
    return (
        <div className="col-sm-3">
            <div className="pro_categry_sidebar">
                <div className="width-100">
                    <div className="results_show">{total ? `${total} results` : ""}</div>
                </div>
                <div className="sidebar_nav">
                    <div className="flex-shrink-0 p-0 bg-white">
                        {filters && filters.length > 0 && (
                            <ul className="list-unstyled ps-0">
                                {filters.map((item, i) => {
                                    return (
                                        <li className="mb-3" key={i}>
                                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                                data-bs-target={`#home-collapse-${i}`} aria-expanded="false">
                                                {item.label}
                                            </button>
                                            {item.options.length > 0 && (
                                                <div className="collapse" id={`home-collapse-${i}`}>
                                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                                        {item.options.map((val, j) => {
                                                            return (
                                                                <li key={j} data-remove={item.attribute_code} className={currentFilter == val.value ? 'active' : ''} value={val.value} onClick={currentvalue} >{val.label}</li>)
                                                        })}
                                                    </ul>
                                                </div>
                                            )}

                                        </li>
                                    )
                                })}

                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {

    let languages = '', filtering = {}, pageeSize = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    if (state && state.Cart) {
        filtering = state.Cart.filters;
        pageeSize = state.Cart.pageeSize;
    }
    return {
        languages: languages,
        filterval: filtering,
        pageeSize: pageeSize,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { productList, loaderProducts }
)(Filters);