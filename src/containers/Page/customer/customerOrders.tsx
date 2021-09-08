import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { getCustomerOrders, searchOrders, getCustomerOrdersByDate, sortCustomerOrders } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";


function CustomerOrders(props) {
    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [orders, setOrders] = useState({
        items: []
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getCustomerOrders();
        setOrders(result.data);
        console.log(result);
    }

    const handleSearch = async (e) => {
        const val = e.target.value;
        setOrderId(val);
        if (val === "") return getData();
        let result: any = await searchOrders(val);
        if (result) {
            orders.items = [];
            orders.items[0] = result.data;
            setOrders(orders);
            console.log(orders);
        }
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
        console.log(e.target.value);
        setSortOrder(e.target.value);
        let result: any = await sortCustomerOrders(e.target.value);
        if (result) {
            orders.items = result.data;
            console.log(orders);
            setOrders(orders);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-8 offset-md-3">
                    <div className="row" style={{ marginTop: '150px' }}>
                        <div className="col-md-3">
                            <input type="text"
                                className="form-control"
                                placeholder="Search"
                                value={orderId}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="col-md-3">
                            <select value={sortOrder} onChange={sortOrdersHandler} className="form-control">
                                <option value="">SortBy</option>
                                <option value="ASC">Price - High to low</option>
                                <option value="DESC">Price - Low to high</option>

                            </select>
                        </div>
                        <div className="col-md-3">
                            <p onClick={() => getOrdersByDate(null)}>All</p>
                            <p onClick={() => getOrdersByDate(1)}>Last Month</p>
                            <p onClick={() => getOrdersByDate(3)}>Last 3 Month</p>
                            <p onClick={() => getOrdersByDate(6)}>Last 6 Month</p>
                            <p onClick={() => getOrdersByDate(2021)}>2021</p>
                            <p onClick={() => getOrdersByDate(2020)}>2020</p>
                            <p onClick={() => getOrdersByDate(2019)}>2019</p>
                        </div>
                    </div>
                    <br />
                    <h4>My Orders and Returns</h4>
                    <p>Save payment and shipping details, view your order history, return items, and track and share favourite pieces in whislist</p>
                    <hr />
                    {orders.items.map(item => {
                        return (
                            <div className="row" key={item.entity_id}>
                                <h5>Order Number : {item.increment_id}</h5>
                                <div className="col-md-5">
                                    <b>Order Date</b>
                                    <p>{item.created_at}</p>
                                    <b>Product</b>
                                    <p>{item.items.length}</p>

                                    <b>Ship Date</b>
                                    <p>{item.created_at}</p>
                                    <b>Price</b>
                                    <p>{item.grand_total}</p>
                                </div>
                                <div className="col-md-7">
                                    <Link className="menu-logo" to={`order-details/${item.increment_id}`}>View Details</Link>
                                    <img src={item.extension_attributes.shipping_assignments[0].items[0].extension_attributes.item_image} alt="" height="100" width="100" />
                                </div>
                                <hr />
                            </div>
                        );
                    })}
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
)(CustomerOrders);