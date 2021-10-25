import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getProductFilter } from "../../../redux/cart/productApi";
import { GraphQLClient, gql } from 'graphql-request';
const axios = require("axios");
function Filters(props) {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        main().catch((error) => console.error(error))

        return () => {
            //
        }
    }, [])

    async function main() {

        // const client = new GraphQLClient('https://4a83875b65.nxcli.net/graphql')
        // client.setHeaders({  "Content-Type": "application/json" })

        const query = gql`{products(filter: { category_id: { eq: "52" } }, pageSize: 10) {aggregations{attribute_code count label options{count label value } } total_count page_info { page_size current_page } items {id name sku short_description { html } image { url }price_range { minimum_price { regular_price { value currency }final_price { value currency }fixed_product_taxes { label amount {value currency }}} maximum_price { discount { amount_off percent_off } fixed_product_taxes { label amount { value currency} } } } } } }`;

        // const data = await client.request(query);
        // setFilters(data.products)
        // console.log(data.products)
        axios.request({
            method: 'post',
            url: 'https://4a83875b65.nxcli.net/graphql',
            data: query,
            headers: {  "Content-Type": "application/json" }
        })
            .then(async response => {
                console.log(response)
            })
            .catch(function (err) {
                console.log(err.response);
            });
    }

    return (
        <div className="col-sm-3">
            <div className="pro_categry_sidebar">
                <div className="width-100">
                    <div className="results_show">1,206 results</div>
                </div>
                <div className="sidebar_nav">
                    <div className="flex-shrink-0 p-0 bg-white">

                        <ul className="list-unstyled ps-0">
                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#home-collapse" aria-expanded="true">
                                    Category
                                </button>
                                <div className="collapse show" id="home-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#dashboard-collapse" aria-expanded="false">
                                    Designers
                                </button>
                                <div className="collapse" id="dashboard-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#orders-collapse" aria-expanded="false">
                                    Color
                                </button>
                                <div className="collapse" id="orders-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#account-collapse" aria-expanded="false">
                                    Watches size
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#account-collapse" aria-expanded="false">
                                    Jewelry size
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#account-collapse" aria-expanded="false">
                                    Accessories size
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#account-collapse" aria-expanded="false">
                                    Clothes size
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>

                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#account-collapse" aria-expanded="false">
                                    Prices
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li className="mb-3">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#account-collapse" aria-expanded="false">
                                    Release years
                                </button>
                                <div className="collapse" id="account-collapse">
                                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                        <li><Link to="#" className="link-dark rounded">All</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Watches</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Jewelry</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Bags</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Accessories</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Clothes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Lingerie</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Shoes</Link></li>
                                        <li><Link to="#" className="link-dark rounded">Sport</Link></li>
                                    </ul>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filters;