import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import Modal from "react-bootstrap/Modal";
import { getWishList, wishListSearchSort } from '../../../redux/pages/customers';


function WishList(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [wishList, setWishList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('price');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        getData();
    }, []);


    const getData = async () => {
        let result: any = await wishListSearchSort(custId, pageSize, sortOrder, sortBy, searchName);
        if (result) {
            setWishList(result.data);
        }
    }

    const searchHandler = (e) => {
        setSearchName(e.target.value);
        getData();
    }

    const sortHandler = (e) => {
        setSortOrder(e.target.value);
        getData();
    }


    return (
        <>
            <div className="row" style={{ marginTop: '150px' }}>
                <div className="col-md-6 offset-md-3">
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchName}
                                onChange={searchHandler}
                            />
                        </div>
                        <div className="col-md-6">
                        <select value={sortOrder} onChange={sortHandler} className="form-control">
                                <option value="">SortBy</option>
                                <option value="asc">Price - High to low</option>
                                <option value="desc">Price - Low to high</option>

                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                                {wishList && wishList.map(item => {
                                    return (
                                        <div className="row" key={item.product_id}>
                                            <img src={item.img_src} alt={item.name} style={{ height: '100px', width: '100px' }} />
                                            <p>Name : {item.name}</p>
                                            <p>Product Price : {item.price}</p>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
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