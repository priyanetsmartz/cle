import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import notification from '../../../../components/notification';
import { giftCart, giftGuestCart } from "../../../../redux/cart/productApi";

function GiftMessage(props) {
    let product_id = props.data;
    console.log(props)
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
        setIsShow(true);
        let result: any;

        e.preventDefault();
        if (handleValidation()) {
            let customer_id = localStorage.getItem('cust_id');
            const giftMEssageData = {
                "giftMessage": {
                    "gift_message_id": 0,
                    "customer_id": customer_id ? parseInt(customer_id) : 0,
                    "sender": state.from,
                    "recipient": state.for,
                    "message": state.message
                }
            }
            console.log(giftMEssageData)
            if (customer_id) {
                result = await giftCart(giftMEssageData, 27)
            } else {
                result = await giftGuestCart(giftMEssageData, 27)
            }
            console.log(result)
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
                            <label >For</label>
                            <input
                                type="text"
                                id="for"
                                className="form-control"
                                placeholder="For"
                                value={state.for}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className="col">
                            <label >From</label>
                            <input
                                type="text"
                                id="from"
                                className="form-control"
                                placeholder="From"
                                value={state.from}
                                onChange={handleChange}
                                required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Add note or wishes</label>
                            <textarea
                                className="form-control"
                                id="message"
                                value={state.message}
                                onChange={handleChange}
                                placeholder="I wish.."
                                required></textarea>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer> <Link to={"/"} className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}>Confirm</Link>
                <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>Loading.</div></Modal.Footer>
        </div>
    )
}

export default GiftMessage;