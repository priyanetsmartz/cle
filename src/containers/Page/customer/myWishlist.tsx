import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { removeItemFromWishList, wishListSearchSort } from '../../../redux/pages/customers';
import { formatprice } from '../../../components/utility/allutils';

function MyWishList(props) {
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
        console.log(e.target.value)
        getData();
    }

    const sortHandler = (e) => {
        setSortOrder(e.target.value);
        getData();
    }

    const itemREmoveHandler = async (productId) => {
        let result: any = await removeItemFromWishList(custId, productId);
        console.log(result);
        if (result) {
            notification("success", "", result.data[0].message);
            getData();
        }
    }


    return (
        <div className="col-sm-9">
            <main>
                <section>
                    <div className="row" >
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
                                                <p>Product Price : {formatprice(item.price)}</p>
                                                <button onClick={() => itemREmoveHandler(item.product_id)}>Remove</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>

    );
}

function mapStateToProps(state) {
    return {
        state: state
    };
};
export default connect(
    mapStateToProps
)(MyWishList);