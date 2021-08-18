import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";

const { addToCart } = cartAction;

function Products(props) {
function handleClick(id:number){
    props.addToCart(id);
}
    return (
        props.items.map(item => {
            return (<div className="card" key={item.id}>
                <div className="card-image">
                    <img src={item.img} alt={item.title} />
                    <span className="card-title">{item.title}</span>
                    <Link to="#"  onClick={()=>{handleClick(item.id)}} className="btn-floating halfway-fab waves-effect waves-light red" ><i className="material-icons">add</i></Link>
                </div>

                <div className="card-content">
                    <p>{item.desc}</p>
                    <p><b>Price: {item.price}$</b></p>
                </div>
            </div>
            )

        })
    )
}
const mapStateToProps = (state) => {
    console.log(state);
    return {
        items: state.Cart.items
    }
}

const mapDispatchToProps= (dispatch)=>{
    
    return{
        addToCart: (id)=>{dispatch(addToCart(id))}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Products)