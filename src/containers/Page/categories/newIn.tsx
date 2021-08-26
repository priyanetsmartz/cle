import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { getNewInCategories, getCategoryPage } from '../../../redux/cart/productApi';
import { Pages1 } from '../../../redux/pages/allPages';
import notification from "../../../components/notification";
const { addToCart, productList } = cartAction;

function NewIn(props) {
    const [catProducts, setCatProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [catId, setCatId] = useState(9);
    useEffect(() => {
        // getProducts();
        // getCategories();
    }, [])

    const getProducts = async () => {
        let result: any = await getNewInCategories('DESC', 10);
        console.log(result);
        setCatProducts(result.data.items);
    }

    const getCategories = async () => {
        let result: any = await getCategoryPage(catId);
        console.log(result);
        setCategories(result.data);
    }


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
)(NewIn);