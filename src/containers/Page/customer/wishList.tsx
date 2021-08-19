import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import { getWishList } from '../../../redux/pages/customers';


function WishList(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [wishList, setWishList] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getWishList(custId);
        setWishList(result.data);
    }
    
    return (
        <>
            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-6 offset-md-3">
                {wishList && wishList.map(item => {
                        return (
                            <div className="row" key={item.product_id}>
                               <img src={item.img_src} alt={item.name} style={{ height: '100px' , width:'100px'}}/>
                               <p>Name : {item.name}</p>
                               <p>Product Price : {item.price}</p>
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
)(WishList);