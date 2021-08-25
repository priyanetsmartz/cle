import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist, addToCartApi } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
const { addToCart, productList } = cartAction;

function Products(props) {
    const [token, setToken] = useState('');
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts();
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

    const getProducts = async () => {
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory();
        let productResult = result.data.items;
        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            let products = result.data.items;
            let WhishlistData = whishlist.data;
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                    ...itm
                }));

            productResult = mergeById(products, WhishlistData);
        }
        props.productList(productResult);
    }

    function handleClick(id: number, sku: string) {
        let cartData = {
            "cartItem": {
                "sku": sku,
                "qty": 1,
                "quote_id": localStorage.getItem('cartQuoteId')
            }
        }
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            addToCartApi(cartData)
        }
        props.addToCart(id);
        notification("success", "", "Item added to cart");
    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        getProducts()

    }
    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        getProducts()
    }


    return (
        <div className="container" style={{ "marginTop": "200px" }}>
            <div className="row">
                {props.items.map(item => {
                    return (
                        <div className="col-md-4" key={item.id}>
                            {token && (
                                <div>
                                    {!item.wishlist_item_id && (
                                        <span onClick={() => { handleWhishlist(item.id) }}  >Add Whishlist</span>
                                    )}
                                    {item.wishlist_item_id && (
                                        <span onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }}>Remove Whishlist</span>
                                    )}
                                </div>
                            )
                            }
                            <div className="card-one">
                                <div className="card">
                                    <img src={item.custom_attributes ? item.custom_attributes[0].value : item} alt={item.name} />
                                    <span className="card-title">{item.name}</span>
                                    {!token && (<Link to="#" onClick={() => { handleClick(item.id, item.sku) }} className="btn-floating halfway-fab waves-effect waves-light red" ><i className="material-icons">add</i></Link>
                                    )}
                                </div>

                                <div className="card-content">
                                    <p>{item.desc}</p>
                                    {(item.extension_attributes && item.extension_attributes.configurable_product_options && item.extension_attributes.configurable_product_options.length > 0) && (
                                        <div>{item.extension_attributes.configurable_product_options.map(varient => {
                                            return (
                                                <div key={varient.id}>
                                                    {varient.label}
                                                    {(varient.values.length > 0 && (
                                                        <div>
                                                            {
                                                                varient.values.map(val => {
                                                                    return (<p key={val.value_index}>{val.value_index}</p>)
                                                                })
                                                            }
                                                        </div>
                                                    ))}
                                                </div>

                                            )
                                        })}</div>

                                    )}
                                    <p><b>Price: {item.price}</b></p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
const mapStateToProps = (state) => {
    console.log(state);
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList }
)(Products);