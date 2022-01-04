import React, { useState, useEffect } from 'react';
import ContactBannerFooter from '../Page/customer/contact-banner';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { getCookie } from "../../helpers/session";
import { Pages } from '../../redux/pages/allPages';
const { openSignUp } = appAction;

function ContactUS(props) {
    const userGroup = localStorage.getItem('token');
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    const language = getCookie('currentLanguage');

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        async function fetchMyAPI() {
            let result: any = await Pages('contact-us', lang);
            // let test: any = await Pages1(pageIdentifier);
            // console.log(test)
            var jsonData = result.data.items[0];
            SetPagesData(jsonData)

        }
        fetchMyAPI()
        return () => {
            SetPagesData({ title: '', content: '' })
        }
    }, [props.languages])


    return (
        <div className="container about-inner inner-pages"  >
            <div className="my_orders_returns_sec">
                <div dangerouslySetInnerHTML={{ __html: pagesData ? pagesData.content : "Ooops Page not found...." }} />
            </div>
            <ContactBannerFooter />
        </div>
    );
}

function mapStateToProps(state) {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages
    };
};
export default connect(
    mapStateToProps,
    { openSignUp }
)(ContactUS);