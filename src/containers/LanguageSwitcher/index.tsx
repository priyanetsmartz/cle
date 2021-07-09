import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import IntlMessages from "../../components/utility/intlMessages";
import actions from "../../redux/languageSwitcher/actions";
// import config from "./config";
import { Link } from "react-router-dom";
import { setCookie } from "../../helpers/session";
const { changeLanguage } = actions;
function LanguageSwitcher(props) {
  const { language, changeLanguage } = props;
  // console.log(language)
  useEffect(() => {
    if (language) {
      setCookie("currentLanguage", language)
    } else {
      setCookie("currentLanguage", 'english')
    }
  }, [language]);
  return (
    <li className="lang-sec"><Link to={"#"} onClick={() => {
      changeLanguage('english');
    }} >En</Link>
      <Link to={"#"} onClick={() => {
        changeLanguage('arabic');
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="19" viewBox="0 0 31 19">
          <g id="Component_82_1" data-name="Component 82 – 1" transform="translate(0 2)">
            <text id="عربى" transform="translate(0 13)" fontSize="14" fontFamily="SegoeUI-Bold, Segoe UI"
              fontWeight="700" opacity="0.497">
              <tspan x="0" y="0">عربى</tspan>
            </text>
          </g>
        </svg>
      </Link>
    </li>
  );
}



// const mapStateToProps = state => ({
//   console.log(state)
//   ...state.current
// });
function mapStateToProps(state) {
  // console.log(state.LanguageSwitcher.language);
  return state.LanguageSwitcher

}
export default connect(
  mapStateToProps,
  { changeLanguage }
)(LanguageSwitcher);
