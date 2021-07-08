import React, { useState } from 'react';
import { connect } from "react-redux";
import authAction from "../../redux/auth/actions";
const { postComment } = authAction;

function PostComment(props) {
    const [state, setState] = useState({
        name: "",
        email: "",
        comment: ""
    })
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        const { postComment } = props;
        if (state.name != '' || state.email != '' || state.comment != '') {

            const userInfo = {
                "name": state.name,
                "email": state.email,
                "comment": state.comment
            }
            console.log(userInfo);
            postComment({ userInfo });
        } else {
            console.log("All fields are required!");
        }
    }

    return (
        <div>
            <p>Post Commetns</p>
            <br />
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Full Name</label>
                    <input type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter Full Name"
                        value={state.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={state.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Comment</label>
                    <input type="text"
                        className="form-control"
                        id="comment"
                        placeholder="Type your comment..."
                        value={state.comment}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Submit
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

