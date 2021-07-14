import React, { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import authAction from "../../redux/auth/actions";
import { connect } from "react-redux";
import SignUp from '../Page/signup';

const { closeSignUp } = authAction;

function Footer(props) {
    const [isModel, setISModel] = useState(false);

    useEffect(() => {
        setISModel(props.data.Auth.signUpModelOpen);
    });


    const handleSignUpClose = (e) => {
        e.preventDefault();
        const { closeSignUp } = props;
        setISModel(false);
        closeSignUp({val:false})
    }


    return (
        <>
        <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                    </div>
                </div>
            </div>
        </div>

        {/* sign up modal */}
        {isModel && (<div className="modal-1 signup-Modal" id="signUpModal" tabIndex={-1} aria-labelledby="signUpModalLabel"
                aria-hidden="true">
                <SignUp />
            </div>)}
        </>
    );
}

const mapStateToProps = state => ({
    data: state,
});

export default connect(
    mapStateToProps,
    { closeSignUp }
)(Footer);
