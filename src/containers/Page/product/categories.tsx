import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { getNewInCategories } from '../../../redux/cart/productApi';
import notification from "../../../components/notification";
const { addToCart, productList } = cartAction;

function Categories(props) {
    const [catProducts, setCatProducts] = useState([]);
    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = async () => {
        let result: any = await getNewInCategories('DESC', 7);
        console.log(result);
        setCatProducts(result.data.items);
    }


    const path = "https://4a83875b65.nxcli.net/pub/media/catalog/product";
    return (
        <div className="container" style={{ "marginTop": "200px" }}>
            <div className="row">
               <h3 className="text-center" style={{ "marginBottom": "100px" }} >Explore New In</h3>
               {catProducts.map(item => {
                    return (
                        <div className="col-md-4" key={item.id}>
                           <b>{item.name}</b>
                           <b>{item.price}</b>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { addToCart, productList }
)(Categories);