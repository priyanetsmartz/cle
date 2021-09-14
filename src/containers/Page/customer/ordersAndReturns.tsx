import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { getCustomerOrders, searchOrders, getCustomerOrdersByDate, sortCustomerOrders } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";


function OrdersAndReturns(props) {
    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getData();

    }, []);

    const getData = async () => {
        let result: any = await getCustomerOrders();
        setOrders(result.data.items);
    }

    const handleSearch = async (e) => {
        const val = e.target.value;
        setOrderId(val);
        if (val === "") return getData();
        let result: any = await searchOrders(val);
        if (result) {
            setOrders([result.data]);
        }
    }

    const dateFilter = (e) => {
        const {value} = e.target;
        console.log(value);
    }

    const priceFilter = (e) => {
        const {value} = e.target;
        console.log(value);
    }


    const getOrdersByDate = async (filter) => {
        let filterDate;
        let currentDate = moment(new Date());
        if (!filter) {
            getData();
        } else if (filter === 1 || filter === 3 || filter === 6) {
            filterDate = moment(currentDate).subtract(filter, 'M').toJSON();
        } else {
            filterDate = moment(`${filter}-01-01`).toJSON();
        }
        setOrderDate(filterDate);
        let result: any = await getCustomerOrdersByDate(filterDate);
        if (result) {
            console.log(result.data);
            setOrders(result.data);
        }
    }

    const sortOrdersHandler = async (e) => {
        setSortOrder(e.target.value);
        let result: any = await sortCustomerOrders(e.target.value);
        if (result) {
            console.log(result.data);
            setOrders(result.data.items);
        }
    }

    return (
        <>
            <div className="col-sm-9">
                <div className="my_orders_returns_sec">
                    <div className="width-100">
                        <h1>My Orders and Returns</h1>
                        <h2>Save payment and shipping details, view your order history, return items, and track
                            and share favourite pieces in wishlist.</h2>
                    </div>
                    <div className="range_slider">
                        <div className="range_inner">
                            <div className="row">
                                <div className="col-sm-4 mb-4">
                                    <div className="form-group">
                                        <span className="form-label">Date:</span>
                                        <select className="form-select" aria-label="Default select example" onChange={dateFilter}>
                                            <option value="">All</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <div className="form-group">
                                        <span className="form-label">Price:</span>
                                        <select className="form-select" aria-label="Default select example" onChange={priceFilter}>
                                            <option value="">$3,550 - $150,550</option>
                                            <option value="1">$1,550 - $150,550</option>
                                            <option value="2">$3,050 - $150,550</option>
                                            <option value="3">$2,550 - $150,550</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <span className="form-label">&nbsp;</span>
                                        <div className="search_results">
                                            <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                                            <input type="search" placeholder="Search..." value={orderId}
                                                onChange={handleSearch} className="form-control me-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order_tab_sec">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
                                    type="button" role="tab" aria-controls="home" aria-selected="true">Orders</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                                    type="button" role="tab" aria-controls="profile" aria-selected="false">Returns</button>
                            </li>

                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                                <div className="row">
                                    <div className="col-sm-12 mt-4">
                                        <div className="resltspage_sec">
                                            <div className="paginatn_result">
                                                <span>Results per page</span>
                                                <ul>
                                                    <li><Link to="#" className="active">12</Link></li>
                                                    <li><Link to="#">60</Link></li>
                                                    <li><Link to="#">120</Link></li>
                                                </ul>
                                            </div>
                                            <div className="sort_by">
                                                <div className="sortbyfilter">

                                                    <select value={sortOrder} onChange={sortOrdersHandler} className="form-select customfliter" aria-label="Default select example">
                                                        <option value="">SortBy</option>
                                                        <option value="ASC">Price - High to low</option>
                                                        <option value="DESC">Price - Low to high</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {orders && orders.map(item => {
                                    return (
                                        <>
                                            <div className="row" key={item.increment_id}>
                                                <div className="col-sm-12">
                                                    <div className="sortbyeyearly_show">
                                                        <h3>May 2021</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row my-3" key={`${item.increment_id}1`}>
                                                <div className="col-sm-12">
                                                    <div className="row mb-3">
                                                        <div className="col-sm-6">
                                                            <h3 className="order_numbr">Order number: {item.increment_id}</h3>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="viewall_btn">
                                                                <Link to={`/order-details/${item.increment_id}`} className="">View all</Link>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="d-md-flex">
                                                    <div className="col-sm-6">
                                                        <div className="order-viewsec">
                                                            <div className="order-details">
                                                                <div className="order-date">
                                                                    <label className="form-label">Order date</label>
                                                                    <div className="labl_text">{item.created_at}</div>
                                                                </div>

                                                                <div className="products">
                                                                    <label className="form-label"> Products</label>
                                                                    <div className="labl_text"> {item.items.length}</div>
                                                                </div>
                                                            </div>

                                                            <div className="order-details">
                                                                <div className="order-date">
                                                                    <label className="form-label">Shipped date</label>
                                                                    <div className="labl_text">Mon, 31 May 2021</div>
                                                                </div>

                                                                <div className="products">
                                                                    <label className="form-label"> Price</label>
                                                                    <div className="labl_text"> {item.grand_total}</div>
                                                                </div>
                                                            </div>

                                                            <div className="order-shipped">
                                                                <label className="form-label">We have shipped your order</label>
                                                            </div>


                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="prodcut_catg">
                                                            <div className="product_photo">
                                                                <img src={item.items[0]?.extension_attributes.item_image} className="img-fluid" alt="" />
                                                            </div>
                                                            <div className="product_photo">
                                                                <img src={item.items[1]?.extension_attributes.item_image} className="img-fluid" alt="" />
                                                            </div>
                                                            <div className="more_product">
                                                                <Link to="#">
                                                                    <img src={item.items[2]?.extension_attributes.item_image} className="img-fluid" alt="" />
                                                                    <div className="overlay_img"></div>
                                                                    <span className="more_pro">{item.items.length}</span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div className="blank_bdr"></div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}

                                <div className="resltspage_sec footer-pagints">
                                    <div className="paginatn_result">
                                        <span>Results per page</span>
                                        <ul>
                                            <li><Link to="#" className="active">12</Link></li>
                                            <li><Link to="#">60</Link></li>
                                            <li><Link to="#">120</Link></li>
                                        </ul>
                                    </div>
                                    <div className="page_by">
                                        <div className="pagination">

                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination">
                                                    <li className="page-item">
                                                        <Link className="page-link" to="#" aria-label="Previous">
                                                        </Link><Link to="#"><img src="images/arrow-left.svg" className="img-fluid" alt="" /></Link>

                                                    </li>
                                                    <li className="page-item"><Link className="page-link" to="#">Page</Link></li>
                                                    <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                                    <li className="page-item"><Link className="page-link" to="#">of</Link></li>
                                                    <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                                    <li className="page-item">
                                                        <Link className="page-link" to="#" aria-label="Next">
                                                        </Link><Link to="#"><img src="images/arrow-right.svg" className="img-fluid" alt="" /></Link>

                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">bgfbgfg</div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}



function mapStateToProps(state) {
    return {
        state: state
    };
};
export default connect(
    mapStateToProps
)(OrdersAndReturns);