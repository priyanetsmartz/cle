import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import appAction from "../../redux/app/actions";
import Login from "../../redux/auth/Login";
import { connect } from 'react-redux';
const { showSignin } = appAction;
const loginApi = new Login();


function Profile(props) {
    const [profileDetails, SetProfileDetails] = useState({ email: "", firstname: "", lastname: "" });
    useEffect(() => {
        let tokenCheck = localStorage.getItem('token_email');
        fetchMyAPI(tokenCheck)
    }, [props.authtoken])

    async function fetchMyAPI(email) {
        let result: any = await loginApi.getAuthRegister(email);
        var jsonData = result.data[0];
        if (jsonData === undefined) {
        } else {
            SetProfileDetails(jsonData)
        }
    }

    const handleClick = () => {
        const { showSignin } = props;
        showSignin(true);
    }

    return (
        <div className="container about-inner" style={{ "minHeight": "300px", "marginTop": "100px" }}>
            {(props.authtoken || localStorage.getItem('token_email')) ? <>
                <figure className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                        <text id="{profileDetails.firstname}" data-name="{profileDetails.firstname}" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="70" fontFamily="Monument Extended Book">
                            <tspan x="-423.555" y="0"><IntlMessages id="profile.welcome" /> {profileDetails.firstname}</tspan>
                        </text>
                    </svg>
                </figure>
                <div>
                    <p><IntlMessages id="profile.name" />: {profileDetails.firstname} {profileDetails.lastname}</p><br />
                    <p><IntlMessages id="profile.email" /> : {profileDetails.email}</p>
                </div>
            </> :
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Please login </strong>
                    <button className="signup-btn" onClick={() => { handleClick(); }}>
                        <IntlMessages id="menu_Sign_in" />
                    </button>
                </div>
            }
        </div>
    )

}

function mapStateToProps(state) {
    let authtoken = '';
    if (state && state.Auth && state.Auth.idToken) {
        authtoken = state.Auth.idToken;
    }
    console.log(authtoken)
    return {
        authtoken: authtoken
    };
};
export default connect(
    mapStateToProps,
    { showSignin }
)(Profile);
