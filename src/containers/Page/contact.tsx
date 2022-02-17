import React, { useState, useEffect } from 'react';
import ContactBannerFooter from '../Page/customer/contact-banner';
import { connect } from "react-redux";
import appAction from "../../redux/app/actions";
import { getCookie } from "../../helpers/session";
import { Pages } from '../../redux/pages/allPages';
import { Helmet, HelmetProvider } from 'react-helmet-async';
const { openSignUp } = appAction;

function ContactUS(props) {
    const userGroup = localStorage.getItem('token');
    const [pagesData, SetPagesData] = useState({ title: '', content: '', meta_description: '', meta_keywords: "", meta_title: "" })
    const language = getCookie('currentLanguage');

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        async function fetchMyAPI() {
            let result: any = await Pages('contact-us', lang);
            var jsonData = result.data.items[0];

            SetPagesData(jsonData)
        }
        fetchMyAPI()
        return () => {
            SetPagesData({ title: '', content: '', meta_description: '', meta_keywords: "", meta_title: "" })
        }
    }, [props.languages])


    return (
        <div className="container about-inner inner-pages"  >
            <HelmetProvider>
                <Helmet >
                    <title>{pagesData.title}</title>
                    <meta name="description" content={pagesData.meta_description} />
                    <meta name="keywords" content={pagesData.meta_keywords} />
                    <meta property="og:title" content={pagesData.meta_title} />
                    <meta property="og:description" content={pagesData.meta_description} />
                </Helmet>
            </HelmetProvider>
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