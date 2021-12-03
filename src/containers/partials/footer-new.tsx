import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { footer } from '../../redux/pages/allPages';
import SignUp from '../Page/signup';
import SignIn from '../Page/signin';
import Recaptcha from 'react-google-invisible-recaptcha';

function FooterExtra(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    // const [analyticsCode, SetAnalyticsCode] = useState({ status: 0, accountNo: 0 })
    useEffect(() => {

        async function fetchMyAPI() {
            let result: any = await footer(props.languages);
            var jsonData = result && result.data && result.data.items && result.data.items.length > 0 ? result.data.items[0] : {};
            SetPagesData(jsonData);
        }
        fetchMyAPI()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])

    const refRecaptcha = React.useRef(null);
    return (
        <div style={{ "clear": "both" }}>
            {/* <Recaptcha
                ref={refRecaptcha}
                sitekey={"ddd"}
                locale={props.languages === 'arabic' ? 'ar' : 'en'}
                onResolved={() => console.log('Human detected.')} /> */}
            <SignIn showLogin={props.showLogin} />
            <SignUp signupModel={props.signupModel} />
            {pagesData ? <div dangerouslySetInnerHTML={{ __html: pagesData.content }} /> : ""}
        </div>
    );
}

function mapStateToProps(state) {
    let showLogin = '', signupModel = '', languages = '';
    if (state && state.App) {
        showLogin = state.App.showLogin;
        signupModel = state.App.showSignUp
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        showLogin: showLogin,
        signupModel: signupModel,
        languages: languages
    }
};
export default connect(
    mapStateToProps,
    {}
)(FooterExtra);

