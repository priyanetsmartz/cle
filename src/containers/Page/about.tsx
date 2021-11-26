import React, { useEffect, useState } from 'react';
import { Pages } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import appAction from "../../redux/app/actions";
import { getCookie } from "../../helpers/session";
import IntlMessages from "../../components/utility/intlMessages";
const { openSignUp } = appAction;

function AboutUs(props) {
    const language = getCookie('currentLanguage');
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    const [onLogin, setOnLogin] = useState(false);
    useEffect(() => {
        async function fetchMyAPI() {
            let lang = props.languages ? props.languages : language;
            let result: any = await Pages('about-us', lang);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])

    useEffect(() => {
        let tokenCheckFilter = !props.helpusVal ? props.token : props.helpusVal;
        // console.log(tokenCheckFilter)
        if (!tokenCheckFilter) {
            setOnLogin(false);
        } else {
            setOnLogin(true);
        }
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    })


    const handleClick = (e) => {
        e.preventDefault()
        const { openSignUp } = props;
        openSignUp(true);
    }
    return (
        <div className="container about-inner aboutUs-inner">
            <figure className="text-center page-head">
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
        helpusVal: helpusVal,
        token: state.session.user

    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(AboutUs);