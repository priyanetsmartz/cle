import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { connect } from 'react-redux';
import notification from '../../../../components/notification';
import cartAction from "../../../../redux/cart/productAction";
import { addToCartApi, addToCartApiGuest, createGuestToken, getGuestCart, giftCart, giftGuestCart } from "../../../../redux/cart/productApi";
import IntlMessages from "../../../../components/utility/intlMessages";
import { useIntl } from 'react-intl';
import Login from '../../../../redux/auth/Login';
import { getCookie } from "../../../../helpers/session";
const loginApi = new Login();
const { openGiftBoxes, addToCartTask } = cartAction;

function GiftMessage(props) {
    const intl = useIntl();
    let history = useHistory();
    useEffect(() => {
        // console.log(props)
        return () => {
            setIsShow(false);

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
            let cartQuoteId = '';
            let lang = getCookie('currentLanguage');
            let customer_id = props.token.cust_id;
            let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
            if (cartQuoteIdLocal || customer_id) {
                let customerCart: any = await loginApi.genCartQuoteID(customer_id)
                cartQuoteId = cartQuoteIdLocal
                if (customerCart.data !== parseInt(cartQuoteIdLocal)) {
                    cartQuoteId = customerCart.data;
                }
            } else {
                // create customer token
                let guestToken: any = await createGuestToken();
                localStorage.setItem('cartQuoteToken', guestToken.data);
                let result: any = await getGuestCart(lang);
                cartQuoteId = result?.data?.id;
            }
            localStorage.setItem('cartQuoteId', cartQuoteId);
            if (props.items.id) {
                cartData = {
                    "cartItem": {
                        "sku": props.items.sku,
                        "qty": 1,
                        "quote_id": cartQuoteId
                    }
                }

                let results: any;
                if (customer_id) {
                    results = await addToCartApi(cartData)
                } else {
                    results = await addToCartApiGuest(cartData)
                }
                if (results?.data?.item_id) {
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

            if (result?.data === true) {

                setIsShow(false);
                setState({
                    for: "",
                    from: "",
                    message: ""
                })
                props.openGiftBoxes(0);
                props.addToCartTask(true);
                notification("success", "", intl.formatMessage({ id: "addedgift" }));
                history.push('/my-cart');
                window.location.href = '/my-cart';
            } else {
                props.openGiftBoxes(0);
                setIsShow(false);
                notification("error", "", result?.data?.message);
            }
        } else {
            setIsShow(false);
            notification("warning", "", intl.formatMessage({ id: "validgiftingvalues" }));
        }
    }
    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!state["for"]) {
            formIsValid = false;
            error["for"] = intl.formatMessage({ id: "receivedreq" })
        }

        //email
        if (!state["from"]) {
            formIsValid = false;
            error["from"] = intl.formatMessage({ id: "senderreq" })
        }

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = intl.formatMessage({ id: "giftmessage" })
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
                                placeholder="John"
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
                                placeholder="Ann"
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
        product: state.Cart.items,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { openGiftBoxes, addToCartTask }
)(GiftMessage);