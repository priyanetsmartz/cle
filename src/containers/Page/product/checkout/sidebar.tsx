import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { getCartItems, getCartTotal, getCheckOutTotals, getGuestCart, getGuestCartTotal } from '../../../../redux/cart/productApi';
function CheckoutSidebar(props) {
    const [itemsVal, SetItems] = useState({
        checkData: {}, items: {}
    });
    useEffect(() => {
        checkoutScreen();

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.posts])
    async function checkoutScreen() {
        let cartItems: any, cartTotal: any;
        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            cartItems = await getCartItems();
            // get cart total 
            cartTotal = await getCartTotal();
        } else {
            const cartQuoteToken = localStorage.getItem('cartQuoteToken');
            if (cartQuoteToken) {
                cartItems = await getGuestCart();

                cartTotal = await getGuestCartTotal();


            }
        }
        // let result: any = await getCheckOutTotals();
        let checkoutData = {}, checkItems = {}
        checkoutData['discount'] = cartTotal.data.base_discount_amount;
        checkoutData['sub_total'] = cartTotal.data.base_subtotal;
        checkoutData['shipping_charges'] = cartTotal.data.base_shipping_amount;
        checkoutData['total'] = cartTotal.data.base_grand_total;
        checkoutData['tax'] = cartTotal.data.base_tax_amount;
        checkoutData['total_items'] = cartTotal.data.items_qty;
        checkItems['items'] = cartItems.data.items;
        // SetItems(result.data);
        SetItems({ checkData: checkoutData, items: checkItems });
    }
    return (
        <div className="col-md-4">
            <div className="order-detail-sec">
                <h5>{itemsVal.checkData['total_items'] ? itemsVal.checkData['total_items'] : 0} Items</h5>
                {itemsVal.items['items'] && itemsVal.items['items'].length > 0 && (
                    <ul className="Ordered-pro-list">
                        {itemsVal.items['items'].map(item => {
                            return (<li key={item.item_id} >
                                <Link to={'/product-details/' + item.sku}><span className="order-pro_img"><img src={item.extension_attributes.item_image} alt="minicart" className="imge-fluid" /></span>
                                    <span className="order-pro_name">
                                        <span className="order-pro_pname">{item.name}</span>
                                        {/* <span className="order-pro_prodt_tag">Manager pattern bag</span> */}
                                        <br />Qty {item.qty}
                                        {/* <br />One Size */}
                                    </span>
                                </Link>
                            </li>)
                        })}

                    </ul>
                )}
                <div className="product-total-price">
                    <p>Sub Total<span className="text-end">${itemsVal.checkData['sub_total'] ? itemsVal.checkData['sub_total'] : 0}</span></p>
                    <p>Shipping<span className="text-end">${itemsVal.checkData['shipping_charges'] ? itemsVal.checkData['shipping_charges'] : 0}</span></p>
                    <p>Tax<span className="text-end">${itemsVal.checkData['tax'] ? itemsVal.checkData['tax'] : 0}</span></p>
                    <hr />
                    <div className="final-price">Total<span>${itemsVal.checkData['total'] ? itemsVal.checkData['total'] : 0}</span></div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {

    return {

    }
}
export default connect(
    mapStateToProps,
    {}
)(CheckoutSidebar);