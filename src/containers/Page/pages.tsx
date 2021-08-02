import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { Link } from "react-router-dom";
//import history from './history';
const { openSignUp } = appAction;

function AllPages(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    useEffect(() => {
        let pageIdentifier = props.match.params.id;
        async function fetchMyAPI() {
            let result: any = await Pages(pageIdentifier, props.languages);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData)

        }
        fetchMyAPI()
    }, [props.match.params.id, props.languages])


    const handleClick = (e) => {
        e.preventDefault();
        const { openSignUp } = props;
        openSignUp(true);
    }

    return (
        <div className="container about-inner inner-pages">
            <figure className="text-center page-head">
                <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                    <text id="{pagesData.title}" data-name="{pagesData.title}" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                        strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                        <tspan x="-423.555" y="0">{pagesData ? pagesData.title : "404"}</tspan>
                    </text>
                </svg>
            </figure>
            <div dangerouslySetInnerHTML={{ __html: pagesData ? pagesData.content : "Ooops Page not found...." }} />
            {props.match.params.id === 'about-us' && (
                <div><Link to={"/"} className="signup-btn" onClick={(e) => { handleClick(e); }}><IntlMessages id="aboutus.sign_up_now" /></Link></div>
            )}
        </div>
    );
}

function mapStateToProps(state) {
    let signupModel = '', languages = '';
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    // console.log(state.LanguageSwitcher)
    return {
        signupModel: signupModel,
        languages: languages

    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(AllPages);