import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { Link } from "react-router-dom";
import partnershipImage from "../../image/partnership-page-pic.png";
const { openSignUp } = appAction;

function Partnership(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    useEffect(() => {
        //   let pageIdentifier = 'partnership';
        async function fetchMyAPI() {
            let result: any = await Pages('partnership', props.languages);
          //  console.log(result)
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
    }, [props.languages])

    const handleClick = () => {
        const { openSignUp } = props;
        openSignUp(true);
    }

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
        </div>
    );
}

function mapStateToProps(state) {
    let signupModel = '', languages = '';
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    // console.log(signupModel)
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
)(Partnership);