import React, { useState } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
import IntlMessages from "../../components/utility/intlMessages";
import notification from '../../components/notification';
import { AddComment } from '../../redux/pages/magazineList';
const { postComment } = authAction;

function PostComment(props) {
    const [state, setState] = useState({
        name: "",
        email: "",
        post_id: 1, //change this
        message: "",
        store_id: 1, //change this
        customer_id: null,
        reply_to: 17 //change this
    })
    const [errors, setError] = useState({
        errors: {}
    });


    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const handleSubmitClick = async (e) => {
        e.preventDefault();
        const { postComment } = props;
        if (handleValidation()) {
            console.log(state);
            // postComment(state);
            let result: any = await AddComment(state);
            console.log(result);
        } else {
            notification("warning", "", "Please enter required values");
        }
        
    }

    const handleValidation = () => {
        let error = {};
        let formIsValid = true;

        if (typeof state["email"] !== "undefined") {
            let lastAtPos = state["email"].lastIndexOf('@');
            let lastDotPos = state["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && state["email"].indexOf('@@') == -1 && lastDotPos > 2 && (state["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                error["email"] = "Email is not valid";
            }
        }
        if (!state["email"]) {
            formIsValid = false;
            error["email"] = "Email is required";
        }

        //password
        if (!state["name"]) {
            formIsValid = false;
            error["name"] = 'Name is required';
        }

        if (!state["message"]) {
            formIsValid = false;
            error["message"] = 'Message is required';
        }


        setError({ errors: error });
        return formIsValid;
    }

    return (
        <div>
            <p><IntlMessages id="post_comments" /></p>
            <br />
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1"><IntlMessages id="full_name" /></label>
                    <input type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter Full Name"
                        value={state.name}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.errors["name"]}</span>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1"><IntlMessages id="email_address" /></label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={state.email}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.errors["email"]}</span>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1"><IntlMessages id="comment" /></label>
                    <input type="text"
                        className="form-control"
                        id="message"
                        placeholder="Type your comment..."
                        value={state.message}
                        onChange={handleChange}
                    />
                    <span className="error">{errors.errors["message"]}</span>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    <IntlMessages id="submit" />
                </button>
            </form>
        </div>
    );
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    // loginerror:state.errors.loginerror
});
export default connect(
    mapStateToProps,
    { postComment }
)(PostComment);

