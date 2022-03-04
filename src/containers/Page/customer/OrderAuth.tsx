import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link, useParams } from "react-router-dom";
import { orderDetailbyId } from '../../../redux/cart/productApi';
import { useHistory } from "react-router";
import notification from '../../../components/notification';
import { checkVendorLoginWishlist } from '../../../components/utility/allutils';

function OrderAuth(props) {
    const intl = useIntl();
    let history = useHistory();
    const { orderId }: any = useParams();
    const [userEmail, setUserEmail] = useState('')
    useEffect(() => {
        if (orderId) {
            getOrderDetails(orderId);
        } else {

        }

        return () => {
        }
    }, [])

    const [state, setState] = useState({
        email: ""
    })
    const [isShow, setIsShow] = useState(false);
    const [errors, setError] = useState({
        errors: {}
    });

    async function getOrderDetails(orderId) {
        let results: any = await orderDetailbyId(orderId);
        let email = results?.data ? results?.data?.customer_email : "";
        setUserEmail(email)
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            setIsShow(true);
            let user = await checkVendorLoginWishlist();
            if ((state.email === userEmail) || (user?.token_email === state.email)) {
                let url = `/thankyou?id=` + orderId;
                history.push(url);
                localStorage.setItem('orderEmail', state.email)
            } else {
                setIsShow(false);
                notification("error", "", intl.formatMessage({ id: "emailvalidation" }));                
            }
        }

    }


    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        //Email   
        if (typeof state["email"] !== "undefined") {
            if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state["email"]))) {
                formIsValid = false;
                error["email"] = intl.formatMessage({ id: "emailvalidation" });
            }
        }

        if (!state["email"]) {
            formIsValid = false;
            error["email"] = intl.formatMessage({ id: "emailrequired" });
        }

        setError({ errors: error });
        return formIsValid;
    }



    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h3><IntlMessages id="order.auth" /></h3>
                    <br />
                    <form>
                        <div className="form-group text-left">
                            <label><IntlMessages id="login.email" /></label>
                            <input type="text"
                                className="form-control"
                                id="email"
                                value={state.email}
                                onChange={handleChange}
                            />
                            <span className="error">{errors.errors["email"]}</span>
                        </div>
                        <br />
                        <Link to={"/"} className="signup-btn" onClick={handleSubmitClick} style={{ "display": !isShow ? "inline-block" : "none" }}>  <IntlMessages id="retrieve_password" /></Link>
                        <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                    </form>

                </div>
            </div>
        </div>
    );
}


export default OrderAuth;



