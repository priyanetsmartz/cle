import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getCookie } from "../../../helpers/session";
import {  Pages } from '../../../redux/pages/allPages';


function MySupport(props) {
    const userGroup = localStorage.getItem('token');
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup === '4') ? true : false);
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
           
        }
    }, [ props.languages])
    return (
        <div className='col-sm-9'>
            <div className="my_orders_returns_sec">
                <div dangerouslySetInnerHTML={{ __html: pagesData ? pagesData.content : "Ooops Page not found...." }} />
            </div>
        </div>
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
)(MySupport);