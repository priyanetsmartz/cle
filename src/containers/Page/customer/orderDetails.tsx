import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import { getOrderDetails } from '../../../redux/pages/customers';


function OrderDetails(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState({});

    useEffect(() => {
        console.log(props.match.params.orderId);
        // getData();
    }, []);

    const getData = async () => {
        let result: any = await getOrderDetails(orderId);
        setOrder(result.data);
    }
    
    return (
        <>
            <div className="row">

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