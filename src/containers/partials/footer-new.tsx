import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { footer, analyticsFetch } from '../../redux/pages/allPages';
import SignUp from '../Page/signup';
import SignIn from '../Page/signin';

function FooterExtra(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    const [analyticsCode, SetAnalyticsCode] = useState({ status: 0, accountNo: 0 })
    useEffect(() => {
        async function fetchMyAPI() {
            let result: any = await footer(props.languages);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
            let analytics: any = await analyticsFetch();
            SetAnalyticsCode(analytics.data);
        }
        fetchMyAPI()
    }, [props.languages])


    return (
        <div style={{ "clear": "both" }}>
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

