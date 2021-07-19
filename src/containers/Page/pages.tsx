import React, { useEffect, useState } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/allPages';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { Link } from "react-router-dom";
const { openSignUp } = appAction;

function AllPages(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    useEffect(() => {
        let pageIdentifier = props.match.params.id;
        async function fetchMyAPI() {
            let result: any = await Pages(pageIdentifier);
            console.log(result)
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
    }, [props.match.params.id])


    const handleClick = () => {
        const { openSignUp } = props;
        openSignUp(true);
    }

    return (
        <div className="container about-inner">
        <figure className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                <text id="About_CLé" data-name="About CLé" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                    strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                    <tspan x="-423.555" y="0">{pagesData.title}</tspan>
                </text>
            </svg>
        </figure>
        <div dangerouslySetInnerHTML={{ __html: pagesData.content }} />
        {props.match.params.id === 'about-us' && (
            <div><Link to={"#"} className="signup-btn" onClick={() => { handleClick(); }}><IntlMessages id="aboutus.sign_up_now" /></Link></div>
        )}
    </div>
    );
}

function mapStateToProps(state) {
    let signupModel = '';
    if (state && state.App) {
        signupModel = state.App.showSignUp
    }
    // console.log(signupModel)
    return {
        signupModel: signupModel
    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(AllPages);