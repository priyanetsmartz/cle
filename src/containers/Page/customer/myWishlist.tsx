import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import notification from '../../../components/notification';
import { Link } from 'react-router-dom'
import { wishListSearchSort } from '../../../redux/pages/customers';
import { formatprice } from '../../../components/utility/allutils';
import { removeWhishlist } from '../../../redux/cart/productApi';
import cartAction from "../../../redux/cart/productAction";
const { addToWishlistTask } = cartAction;
function MyWishList(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [delWishlist, setDelWishlist] = useState(0);
    const [wishList, setWishList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('price');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (props.items || !props.items) {
            //   console.log(props.items)
            getData();
        }

        return () => {
            props.addToWishlistTask(false);
        }
    })

    const getData = async () => {
        let result: any = await wishListSearchSort(custId, pageSize, sortOrder, sortBy, searchName);
        setWishList(result.data);
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

    async function handleDelWhishlist(id: number) {
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            getData()
            notification("success", "", del.data[0].message);
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            getData()
            notification("error", "", "Something went wrong!");

        }
    }

    return (
        <div className="col-sm-9">
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
                </div>
                <div className="product-listing" >
                    <div className="row g-2">
                        {wishList.length > 0 ?
                            <>
                                {wishList && wishList.map(item => {
                                    return (
                                        <div className="col-md-4" key={item.product_id}>
                                            <span onClick={() => handleDelWhishlist(item.wishlist_item_id)} className="bg-remove">{delWishlist === item.wishlist_item_id ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-times" aria-hidden="true"></i>}</span>
                                            <div className="product py-4">
                                                <div className="text-center">
                                                    <img src={item.img_src} alt={item.name} width="200" />
                                                    {/* need sku from api  */}
                                                    {/* <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.product_id, item.sku) }} className="btn btn-primary text-uppercase">{isShow === item.id ? "Adding....." : "Add to cart"}</button></div> */}
                                                    <div className="cart-button mt-3 px-2">
                                                        <Link to={'/product-details/' + item.sku} className="btn btn-primary text-uppercase">View Product</Link></div>
                                                </div>
                                                <div className="about text-center">
                                                    <h5>{item.name}</h5>
                                                    <div className="tagname" dangerouslySetInnerHTML={{ __html: item.description }} />
                                                    <div className="pricetag">${formatprice(item.price)}</div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                            : <div className="text-center" >Wishlist is empty!</div>}
                    </div>
                </div>

            </div>

        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.addToWishlistTask
    }
}

export default connect(
    mapStateToProps,
    { addToWishlistTask }
)(MyWishList);