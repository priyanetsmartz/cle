import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../redux/cart/productAction";
// import { getCookie } from "../../../helpers/session";
const { removeItem, addQuantity, subtractQuantity } = cartAction;

function CartItemPage(props) {
    const [cartItemsVal, setCartItems] = useState([{ id: '', img: '', name: '', price: 0, quantity: 0, desc: '' }]);
    const [cartTotal, setCartTotal] = useState(0);
    useEffect(() => {
        const data = localStorage.getItem('cartItems')
        const total = localStorage.getItem('cartTotal');
        let cartData = data ? JSON.parse(data) : [];
        setCartItems(cartData)
        setCartTotal(parseInt(total));
    }, [cartItemsVal, cartTotal])

    function handleRemove(id) {
        // props.removeItem(id);
        let itemToRemove = cartItemsVal.find(item => id === item.id)
        let new_items = cartItemsVal.filter(item => id !== item.id);
        //calculating the total
        let newTotal = cartTotal - (itemToRemove.price * itemToRemove.quantity)
        localStorage.setItem('cartItems', JSON.stringify(new_items));
        localStorage.setItem('cartTotal', JSON.stringify(newTotal));
        setCartItems(new_items);
        setCartTotal(newTotal);

    }
    //to add the quantity
    function handleAddQuantity(id) {
        //props.addQuantity(id);
        let addedItem = cartItemsVal.find(item => item.id === id)
        addedItem.quantity += 1;
        var foundIndex = cartItemsVal.findIndex(x => x.id === id);
        cartItemsVal[foundIndex] = addedItem;
        //let cartVal = [...cartItemsVal, addedItem];

        let newTotal = cartTotal + addedItem.price;
        setCartTotal(newTotal);
        localStorage.setItem('cartItems', JSON.stringify(cartItemsVal));
        localStorage.setItem('cartTotal', JSON.stringify(newTotal));
    }
    //to substruct from the quantity
    function handleSubtractQuantity(id) {
        // props.subtractQuantity(id);
        let addedItem = cartItemsVal.find(item => item.id === id)
        //if the qt == 0 then it should be removed
        if (addedItem.quantity === 1) {
            let new_items = cartItemsVal.filter(item => item.id !== id)
            let newTotal = cartTotal - addedItem.price;
            setCartItems(new_items);
            setCartTotal(newTotal);
            localStorage.setItem('cartItems', JSON.stringify(new_items));
            localStorage.setItem('cartTotal', JSON.stringify(newTotal));
        } else {
            addedItem.quantity -= 1
            var foundIndex = cartItemsVal.findIndex(x => x.id === id);
            cartItemsVal[foundIndex] = addedItem;
            let newTotal = cartTotal - addedItem.price
            setCartTotal(newTotal);
            localStorage.setItem('cartItems', JSON.stringify(cartItemsVal));
            localStorage.setItem('cartTotal', JSON.stringify(newTotal));
        }
    }

    return (
        <div className="container" style={{ "marginTop": "200px" }}>
            <div className="row">
                {cartItemsVal.length ?
                    (
                        // <p></p>
                        cartItemsVal.map(item => {
                            return (

                                <li className="col-md-4" key={item.id}>
                                    <div className="item-img">
                                        <img src={item.img} alt={item.img} />
                                    </div>
                                    <div className="item-desc">
                                        <span className="title">{item.name}</span>
                                        <p>{item.desc}</p>
                                        <p><b>Price: {item.price}$</b></p>
                                        <p>
                                            <b>Quantity: {item.quantity}</b>
                                        </p>
                                        <div className="add-remove">
                                            <Link to="#"><i className="material-icons" onClick={() => { handleAddQuantity(item.id) }}>arrow_drop_up</i></Link>
                                            <Link to="#"><i className="material-icons" onClick={() => { handleSubtractQuantity(item.id) }}>arrow_drop_down</i></Link>
                                        </div>
                                        <button className="waves-effect waves-light btn pink remove" onClick={() => { handleRemove(item.id) }}>Remove</button>
                                    </div>
                                </li>
                            )
                        })
                    ) :

                    (
                        <p>Nothing.</p>
                    )
                }
                {cartTotal}
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    console.log(state)
    return {
        items: state.Cart.addedItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        removeItem: (id) => { dispatch(removeItem(id)) },
        addQuantity: (id) => { dispatch(addQuantity(id)) },
        subtractQuantity: (id) => { dispatch(subtractQuantity(id)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItemPage)