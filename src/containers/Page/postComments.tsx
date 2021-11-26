import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
import IntlMessages from "../../components/utility/intlMessages";
import notification from '../../components/notification';
import { AddComment } from '../../redux/pages/magazineList';
import { GetComments } from '../../redux/pages/magazineList';
import { useIntl } from 'react-intl';
import moment from 'moment';
const { postComment } = authAction;

function PostComment(props) {
    const [isShow, setIsShow] = useState(false);
    const intl = useIntl();
    const [state, setState] = useState({
        name: props.token.token_name,
        email: props.token.token_email,
        post_id: props.postId,
        message: "",
        store_id: props.auth.LanguageSwitcher.language === 'english' ? 3 : 2,
        customer_id: props.token.cust_id,
        reply_to: null
    })
    const [comments, setComments] = useState([]);
    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {
        getComments()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, []);

    const getComments = async () => {
        let result: any = await GetComments(props.postId);
        setComments(result.data)
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
            let result: any = await AddComment(state);
            if (result) {
                getComments()
                notification("success", "", intl.formatMessage({ id: "commentAdded" }));
                setState(prevState => ({
                    ...prevState,
                    message: "",
                }))
                setIsShow(false);
            }
        } else {
            setIsShow(false);
            notification("warning", "", intl.formatMessage({ id: "commentRequired" }));
        }

    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = intl.formatMessage({ id: "messagerequired" });
        }

        setError({ errors: error });
        return formIsValid;
    }

    const cancle = () => {
        setState(prevState => ({
            ...prevState,
            message: "",
        }))
    }

    return (
        <>
            <h2><IntlMessages id="postComments" /></h2>
            {props.token.id_token && <div className="container mt-5">
                <div className="d-flex justify-content-center row">
                    <div className="col-md-8">
                        <div className="d-flex flex-column comment-section">
                            <div className="bg-light p-2">
                                <div className="d-flex flex-row align-items-start">
                                    {/* <img className="rounded-circle" src={UserImg} width="40" /> */}
                                    <textarea className="form-control ml-1 shadow-none textarea"
                                        value={state.message} onChange={handleChange} id="message"></textarea>
                                    <span className="error">{errors.errors["message"]}</span>
                                </div>
                                <div className="mt-2 text-right">
                                    <button className="btn btn-primary btn-sm shadow-none" style={{ "display": !isShow ? "inline-block" : "none" }} type="button" onClick={handleSubmitClick}><IntlMessages id="postComment.CTA" /></button>
                                    <div className="tn btn-primary btn-sm shadow-none" style={{ "display": isShow ? "inline-block" : "none" }}> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" />.</div>
                                    <button className="btn btn-outline-primary btn-sm ml-1 shadow-none" type="button" onClick={cancle}><IntlMessages id="postComment.cancel" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {/* comments listing starts from here */}
            {comments.length > 0 && (
                <div className="container mt-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-8">
                            {comments.map((item, i) => {
                                return (
                                    <div className="card p-3 mt-4" key={i}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="user d-flex flex-row align-items-center">
                                                {/* <img src={UserImg} width="30" className="user-img rounded-circle mr-2" alt="user-image" /> */}
                                                <span>&nbsp;&nbsp;<small className="font-weight-bold text-primary">{item.name}</small>
                                                    &nbsp;&nbsp;<small className="font-weight-bold">{item.message}</small>
                                                </span>
                                            </div>
                                            <small>{moment(item.created_at).fromNow()}</small>
                                        </div>
                                    </div>
                                );
                            })}


                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
const mapStateToProps = state => ({
    auth: state,
    errors: state.errors,
    token: state.session.user
});
export default connect(
    mapStateToProps,
    { postComment }
)(PostComment);