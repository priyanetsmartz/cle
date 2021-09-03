import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import { searchOrders } from '../../../redux/pages/customers';


function OrderDetails(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [orderId, setOrderId] = useState(props.match.params.orderId);
    const [order, setOrder]:any = useState({});

    useEffect(() => {
        console.log(orderId);
        getData();
    }, []);

    const getData = async () => {
        let result: any = await searchOrders(orderId);
        setOrder(result.data);
    }
    
    return (
        <>
            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-6 offset-md-3">
                    <b>Grand Total : {order.grand_total} {order.order_currency_code}</b>
                    <p>Order Date : {order.created_at}</p>
                    <p>Order Status : {order.status}</p>
                    <p>Total Items : {order.total_item_count}</p>
                    <p>Shipping Description : {order.shipping_description}</p>
                    <hr />
                    <b>Order Items</b>
                    {order && order.items && order.items.map(item => {
                        return (
                            <div className="row" key={item.product_id}>
                               <p>Mame : {item.name}</p>
                               <p>Product Type : {item.product_type}</p>
                               <p>Product Price : {item.price}</p>
                               <img src={item.extension_attributes.item_image} alt="" />
                            </div>
                        );
                    })}

                    
                </div>
            </div>
        </>
    );
}

function mapStateToProps(state) {
    return {
        state: state
    };
};
export default connect(
    mapStateToProps
)(OrderDetails);