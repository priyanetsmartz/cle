import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import notification from '../../../../components/notification';
import cartAction from "../../../../redux/cart/productAction";
import { addToCartApi, addToCartApiGuest, giftCart, giftGuestCart } from "../../../../redux/cart/productApi";
import IntlMessages from "../../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
const { openGiftBoxes } = cartAction;
function GiftMessage(props) {
    const intl = useIntl();
    useEffect(() => {
       // console.log(props)
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

    const [state, setState] = useState({
        for: "",
        from: "",
        message: ""
    })
    const [errors, setError] = useState({
        errors: {}
    });
    const [isShow, setIsShow] = useState(false);

    const handleSubmitClick = async (e) => {
        let result: any;

        e.preventDefault();
        if (handleValidation()) {
            setIsShow(true);
            let cartData = {};
            let cartQuoteId = localStorage.getItem('cartQuoteId');
            let customer_id = localStorage.getItem('cust_id');
            //  console.log(props)
            if (props.items.id) {
                if (props.items.type_id === 'configurable') {
                    // if (!slectedAttribute.options["option_id"]) {
                    //     notification("error", "", "Please select Size");
                    //     return false;
                    // }
                    cartData = {
                        // "cart_item": {
                        //     "quote_id": cartQuoteId,
                        //     "product_type": "configurable",
                        //     "sku": props.product.sku,
                        //     "qty": 1,
                        //     "product_option": {
                        //         "extension_attributes": {
                        //             "configurable_item_options": [
                        //                 {
                        //                     "option_id": slectedAttribute.options["option_id"],
                        //                     "option_value": slectedAttribute.options["option_value"]
                        //                 }
                        //             ]
                        //         }
                        //     }
                        // }
                    }
                } else {
                    cartData = {
                        "cartItem": {
                            "sku": props.items.sku,
                            "qty": 1,
                            "quote_id": cartQuoteId
                        }
                    }
                }



                let results: any;
                if (customer_id) {
                    results = await addToCartApi(cartData)
                } else {
                    results = await addToCartApiGuest(cartData)
                }
                if (results.data.item_id) {
                    const giftMEssageData = {
                        "giftMessage": {
                            "gift_message_id": 0,
                            "customer_id": customer_id ? parseInt(customer_id) : 0,
                            "sender": state.from,
                            "recipient": state.for,
                            "message": state.message
                        }
                    }


                    if (customer_id) {
                        result = await giftCart(giftMEssageData, results.data.item_id)
                    } else {
                        result = await giftGuestCart(giftMEssageData, results.data.item_id)
                    }
                }
            } else {
                if (props.items) {
                    const giftMEssageData = {
                        "giftMessage": {
                            "gift_message_id": 0,
                            "customer_id": customer_id ? parseInt(customer_id) : 0,
                            "sender": state.from,
                            "recipient": state.for,
                            "message": state.message
                        }
                    }


                    if (customer_id) {
                        result = await giftCart(giftMEssageData, props.items)
                    } else {
                        result = await giftGuestCart(giftMEssageData, props.items)
                    }
                }
            }

            if (result.data === true) {

                setIsShow(false);
                setState({
                    for: "",
                    from: "",
                    message: ""
                })
                props.openGiftBoxes(0);
                notification("success", "", "Item added as a gift!");
            }
        } else {
            setIsShow(false);
            notification("warning", "", "Please enter valid email and password");
        }
    }
    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!state["for"]) {
            formIsValid = false;
            error["for"] = "For is required";
        }

        //email
        if (!state["from"]) {
            formIsValid = false;
            error["from"] = 'From is required';
        }

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = 'Message is required';
        }
        setError({ errors: error });
        setIsShow(false);
        return formIsValid;
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    return (
        <div>

            <Modal.Body className="arabic-rtl-direction">
                <form>
                    <div className="row">
                        <div className="col">
                            <label > <IntlMessages id="gift.for" /></label>
                            <input
                                type="text"
                                id="for"
                                className="form-control"
                                placeholder={intl.formatMessage({ id: "gift.for" })}
                                value={state.for}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="col">
                            <label ><IntlMessages id="gift.from" /></label>
                            <input
                                type="text"
                                id="from"
                                className="form-control"
                                placeholder={intl.formatMessage({ id: "gift.from" })}
                                value={state.from}
                                onChange={handleChange}
                                required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label><IntlMessages id="gift.wish-note" /></label>
                            <textarea
                                className="form-control"
                                id="message"
                                value={state.message}
                                onChange={handleChange}
                                placeholder={intl.formatMessage({ id: "gift.wish" })}
                                required></textarea>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer> <Link to={"/"} className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}><IntlMessages id="gift.confirm" /></Link>
                <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>Loading.</div></Modal.Footer>
        </div>
    )
}

const mapStateToProps = (state) => {
    //  console.log(state)
    return {
        items: state.Cart.openGiftBox,
        product: state.Cart.items
    }
}

export default connect(
    mapStateToProps,
    { openGiftBoxes }
)(GiftMessage);