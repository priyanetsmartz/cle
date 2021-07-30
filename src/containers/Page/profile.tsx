import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { getCookie } from '../../helpers/session';
import Login from "../../redux/auth/Login";
const loginApi = new Login();


function Profile(props) {
    const [profileDetails, SetProfileDetails] = useState({ email: "", firstname: "", lastname: "" });
    const [noData, setNoData] = useState("");
    useEffect(() => {
        let email = getCookie("username");
        fetchMyAPI(email)
    },[])

    async function fetchMyAPI(email) {
        let result: any = await loginApi.getAuthRegister(email);
        var jsonData = result.data[0];
        if (jsonData === undefined) {
            setNoData("Please login")
        } else {
            SetProfileDetails(jsonData)
        }


    }
    const handleClick = () => {
        const { openSignUp } = props;
        openSignUp(true);
    }

    return (
        <div className="container about-inner" style={{ "minHeight": "300px", "marginTop": "100px" }}>
            {profileDetails.email && (<>
                <figure className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                        <text id="{profileDetails.firstname}" data-name="{profileDetails.firstname}" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                            strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                            <tspan x="-423.555" y="0"><IntlMessages id="profile.welcome" /> {profileDetails.firstname}</tspan>
                        </text>
                    </svg>
                </figure>
                <div>
                    <p><IntlMessages id="profile.name" />: {profileDetails.firstname} {profileDetails.lastname}</p><br />
                    <p><IntlMessages id="profile.email" /> : {profileDetails.email}</p>
                </div>
            </>
            )}
            {noData && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Please login </strong>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>
    )

}

export default Profile;