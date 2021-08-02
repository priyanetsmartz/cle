import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import { footer } from '../../redux/pages/allPages';
import SignUp from '../Page/signup';
import SignIn from '../Page/signin';

function FooterExtra(props) {
    // const [menuLoaded, setMenuLoaded] = useState(false);
    // const handleMenuOpen = (e) => {
    //     e.preventDefault();
    //     setMenuLoaded(true)
    // }
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    useEffect(() => {
        async function fetchMyAPI() {
            let result: any = await footer(props.languages);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData);
        }
        fetchMyAPI()
    }, [props.languages])


    return (
        <>
            <SignIn showLogin={props.showLogin} />
            <SignUp signupModel={props.signupModel} />
            {pagesData ? <div dangerouslySetInnerHTML={{ __html: pagesData.content }} /> : ""}       
                
        </>
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

