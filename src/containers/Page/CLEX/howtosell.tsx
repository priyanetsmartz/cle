import React, { useState, useEffect } from 'react';

import { connect } from "react-redux";

import { getCookie } from "../../../helpers/session";
import {  Pages } from '../../../redux/pages/allPages';
// import ContactBannerFooter from './contact-banner';


function Howtosell(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })  
    const language = getCookie('currentLanguage');

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        async function fetchMyAPI() {
            let result: any = await Pages('how-to-sell', lang);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData)

        }
        fetchMyAPI()
        return () => {
            SetPagesData({ title: '', content: '' }) 
        }
    }, [ props.languages])




    return (
        <main>
            <div className="row">
                <div className="container">
                    <div dangerouslySetInnerHTML={{ __html: pagesData ? pagesData.content : "Ooops Page not found...." }} />
                </div>
            </div>

            {/* <ContactBannerFooter /> */}
        </main>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(Howtosell);