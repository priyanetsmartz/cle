import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getProductFilter, getProductsFilterRest, getProductsFilterRestCollection } from "../../../redux/cart/productApi";
import { GraphQLClient, gql } from 'graphql-request';
import { connect } from "react-redux";
import { getCookie } from "../../../helpers/session";
const axios = require("axios");
function Filters(props) {
    const [filters, setFilters] = useState([]);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        let catID = getCookie("_TESTCOOKIE");
        const localToken = localStorage.getItem('token');
        main(catID);

        return () => {
            //
        }
    }, [])

    async function main(catID) {
        let filter: any = await getProductsFilterRestCollection(catID, props.languages);
        //  let filter: any = await getProductsFilterRest(catID, props.languages);
        // console.log(filter.data.length);
        let total = 0, aggregations = [], items = [], pageInfo = [];
        if (filter && filter.data && filter.data.length > 0 && filter.data[0].data && filter.data[0].data.products) {
            aggregations = filter.data[0].data.products.aggregations;
            total = filter.data[0].data.products.total_count;
            items = filter.data[0].data.products.items;
        }

        setTotal(total)
        setFilters(aggregations)

    }
    const currentvalue = async (e) => {
        e.preventDefault();
        console.log(e.target.value)
    }
    return (
        <div className="col-sm-3">
            <div className="pro_categry_sidebar">
                <div className="width-100">
                    <div className="results_show">{total} results</div>
                </div>
                <div className="sidebar_nav">
                    <div className="flex-shrink-0 p-0 bg-white">
                        {filters && filters.length > 0 && (
                            <ul className="list-unstyled ps-0">
                                {filters.map((item, i) => {
                                    return (
                                        <li className="mb-3" key={i}>
                                            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                                data-bs-target={`#home-collapse-${i}`} aria-expanded="true">
                                                {item.label}
                                            </button>
                                            {item.options.length > 0 && (
                                                <div className="collapse show" id={`home-collapse-${i}`}>
                                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                                        {item.options.map((val, j) => {
                                                            return (
                                                                <li key={j}  value={val.value} onClick={currentvalue} >{val.label}</li>)
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
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps,
    {}
)(Filters);