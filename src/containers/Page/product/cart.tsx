import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cartAction from "../../../redux/cart/cartAction";

const { removeItem, addQuantity, subtractQuantity } = cartAction;

function CartItem(props) {

    function handleRemove(id) {
        this.props.removeItem(id);
    }
    //to add the quantity
    function handleAddQuantity(id) {
        this.props.addQuantity(id);
    }
    //to substruct from the quantity
    function handleSubtractQuantity(id) {
        this.props.subtractQuantity(id);
    }
    return (
        props.items.length ?
            (
                props.items.map(item => {
                    return (

                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img">
                                <img src={item.img} alt={item.img} />
                            </div>
                            <div className="item-desc">
                                <span className="title">{item.title}</span>
                                <p>{item.desc}</p>
                                <p><b>Price: {item.price}$</b></p>
                                <p>
                                    <b>Quantity: {item.quantity}</b>
                                </p>
                                <div className="add-remove">
                                    <Link to="/cart"><i className="material-icons" onClick={() => { handleAddQuantity(item.id) }}>arrow_drop_up</i></Link>
                                    <Link to="/cart"><i className="material-icons" onClick={() => { handleSubtractQuantity(item.id) }}>arrow_drop_down</i></Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(CartItem)