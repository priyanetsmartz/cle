import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/allPages';
import appAction from "../../redux/app/actions";
import homeBg from "../../image/home-watch-bg.png";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import Home from './home';
const { openSignUp } = appAction;

function newHome(props) {

    return (
        <>
            <Home />
        </>
    )
}


function mapStateToProps(state) {
    let  languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    // console.log(state.LanguageSwitcher)
    return {
        languages: languages

    };
}
export default connect(
    mapStateToProps,
    { openSignUp }
)(newHome);

