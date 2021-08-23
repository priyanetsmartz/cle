import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { addWhishlist, getProductByCategory, getWhishlistItems } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
const { addToCart, productList } = cartAction;

function Products(props) {
    const [token, setToken] = useState('');
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts();
        getWhishlist();
    }, [])

    const getWhishlist = async () => {
        let result: any = await getWhishlistItems();
        console.log(result.data)
        // props.productList(result.data);
    }

    const getProducts = async () => {
        let result: any = await getProductByCategory();
        // console.log(result.data)
        props.productList(result.data);
    }
    function handleClick(id: number) {
        props.addToCart(id);
    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);

    }

    const path = "https://4a83875b65.nxcli.net/pub/media/catalog/product";
    return (
        <div className="container" style={{ "marginTop": "200px" }}>
            <div className="row">
                {props.items.map(item => {
                    return (
                        <div className="col-md-4" key={item.id}>
                            {token && (
                                <div>
                                    <span onClick={() => { handleWhishlist(item.id) }}  >Add Whishlist</span>
                                    <span>Remove Whishlist</span>
                                </div>
                            )}
                            <div className="card-one">
                                <div className="card">
                                    <img src={item.custom_attributes ? path + '/' + item.custom_attributes[0].value : item} alt={item.name} />
                                    <span className="card-title">{item.name}</span>
                                    {token && (<Link to="#" onClick={() => { handleClick(item.id) }} className="btn-floating halfway-fab waves-effect waves-light red" ><i className="material-icons">add</i></Link>
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
        </div>
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