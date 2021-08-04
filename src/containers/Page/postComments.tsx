import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
import IntlMessages from "../../components/utility/intlMessages";
import notification from '../../components/notification';
import { AddComment } from '../../redux/pages/magazineList';
import { GetComments } from '../../redux/pages/magazineList';
import UserImg from '../../image/user.png'
const { postComment } = authAction;

function PostComment(props) {
    const [state, setState] = useState({
        name: localStorage.getItem('token_name'),
        email: localStorage.getItem('token_email'),
        post_id: props.postId,
        message: "",
        store_id: props.auth.LanguageSwitcher.language == 'english' ? 3 : 2,
        customer_id: localStorage.getItem('cust_id'),
        reply_to: null
    })
    const [comments, setComments] = useState([]);
    const [errors, setError] = useState({
        errors: {}
    });

    useEffect(() => {
        getComments()
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
            let result: any = await AddComment(state);
            if (result) {
                getComments()
                notification("success", "", "Comment added!");
                setState(prevState => ({
                    ...prevState,
                    name: "",
                    email: "",
                    post_id: 12, //change this
                    message: "",
                    store_id: 3, //change this
                    customer_id: localStorage.getItem('cust_id'),
                    reply_to: null
                }))
            }
        } else {
            notification("warning", "", "Please enter required values");
        }

    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = 'Message is required';
        }

        setError({ errors: error });
        return formIsValid;
    }

    return (
        <>
            {localStorage.getItem('id_token') && <div className="container mt-5">
                <div className="d-flex justify-content-center row">
                    <div className="col-md-8">
                        <div className="d-flex flex-column comment-section">
                            <div className="bg-light p-2">
                                <div className="d-flex flex-row align-items-start">
                                    <img className="rounded-circle" src={UserImg} width="40" />
                                    <textarea className="form-control ml-1 shadow-none textarea"
                                        value={state.message} onChange={handleChange} id="message"></textarea>
                                </div>
                                <div className="mt-2 text-right">
                                    <button className="btn btn-primary btn-sm shadow-none" type="button" onClick={handleSubmitClick}>Post comment</button>
                                    <button className="btn btn-outline-primary btn-sm ml-1 shadow-none" type="button">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

        {/* comments listing starts from here */}
            <div className="container mt-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8">
                        {comments.map((item, i) => {
                            return (
                                <div className="card p-3" key={i}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="user d-flex flex-row align-items-center">
                                            <img src={UserImg} width="30" className="user-img rounded-circle mr-2" />
                                            <span>&nbsp;&nbsp;<small className="font-weight-bold text-primary">{item.name}</small>
                                            &nbsp;&nbsp;<small className="font-weight-bold">{item.message}</small>
                                            </span>
                                        </div>
                                        <small>{item.created_at}</small>
                                    </div>
                                    <div className="action d-flex justify-content-between mt-2 align-items-center">
                                    </div>
                                </div>
                            );
                        })}


                    </div>
                </div>
            </div>

        </>
    );
}
const mapStateToProps = state => ({
    auth: state,
    errors: state.errors,
    // loginerror:state.errors.loginerror
});
export default connect(
    mapStateToProps,
    { postComment }
)(PostComment);