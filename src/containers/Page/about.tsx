import React, { useEffect, useState } from 'react';
import { Pages } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import appAction from "../../redux/app/actions";
import IntlMessages from "../../components/utility/intlMessages";
const { openSignUp } = appAction;

function AboutUs(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    const [onLogin, setOnLogin] = useState(false);
    useEffect(() => {
        async function fetchMyAPI() {
            let result: any = await Pages('about-us', props.languages);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
    }, [props.languages])

    const handleClick = (e) => {
        e.preventDefault()
        const { openSignUp } = props;
        openSignUp(true);
    }

    useEffect(() => {
        let tokenCheck = localStorage.getItem('id_token');
        let tokenCheckFilter = !props.helpusVal ? tokenCheck : props.helpusVal;
       // console.log(tokenCheckFilter)
        if (!tokenCheckFilter) {
            setOnLogin(false);
        } else {
            setOnLogin(true);
        }
    })
    return (
        <div className="container about-inner">
            <figure className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                    <text id="{pagesData.title}" data-name="{pagesData.title}" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                        strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                        <tspan x="-423.555" y="0">{pagesData.title}</tspan>
                    </text>
                </svg>
            </figure>
            <div dangerouslySetInnerHTML={{ __html: pagesData.content }} />
			<div className="blue-rotated-box">
			<div className="blue-small-box"></div>
			<div className="blue-small-box"></div>
			</div>
            {!onLogin && <div className="about-signup-btn">
                <Link to="#" className="signup-btn" onClick={(e) => { handleClick(e); }}>
                    <IntlMessages id="aboutus.sign_up_now" />
                    </Link>
                    </div>}

        </div>
    );
}

function mapStateToProps(state) {
    let signupModel = '', languages = '', helpusVal;
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    // console.log(signupModel)
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    if (state && state.Auth && state.Auth.idToken) {
        helpusVal = state.Auth.idToken;
    }
    // console.log(state.LanguageSwitcher)
    return {
        signupModel: signupModel,
        languages: languages,
        helpusVal: helpusVal

    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(AboutUs);