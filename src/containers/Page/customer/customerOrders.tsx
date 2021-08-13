import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { getCustomerOrders, searchOrders, getCustomerOrdersByDate } from '../../../redux/pages/customers';


function CustomerOrders(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [orderId, setOrderId] = useState('');
    const [orderDate, setOrderDate] = useState(''); 
    const [orders, setOrders] = useState({
        items:[]
    });

    useEffect(() => {
        async function getData() {
            let result: any = await getCustomerOrders(custId);
            setOrders(result.data);
        }
        getData();
    }, []);

    const handleChange = async (e) => {
        const val = e.target.value;
        setOrderId(val);
        if(val == "") return;
        let result: any = await searchOrders(val);
        if(result){
            orders.items = [];
            orders.items[0] = result.data;
            console.log(orders);
            setOrders(orders);
        }
    }

    const getOrdersByDate = async () => {
        let result: any = await getCustomerOrdersByDate(custId, orderDate);
        if(result){
            orders.items = result.data;
            console.log(orders);
            setOrders(orders);
        }
    }

    return (
        <>
        <div className="row">
            <div className="col-md-8 offset-md-3">
                <div style={{ marginTop: '150px' }}>
                    <input type="text"
                        className="form-control"
                        placeholder="Search"
                        value={orderId}
                        onChange={handleChange}
                    />
                </div>
                    <br /><br />
                <h4>My Orders and Returns</h4>
                <p>Save payment and shipping details, view your order histiry, return items, and track and share favourite pieces in whislist</p>
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
                                <p>{item.items.length}</p>
                            </div>
                            <div className="col-md-7">
                                
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