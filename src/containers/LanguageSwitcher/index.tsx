import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import actions from "../../redux/languageSwitcher/actions";
import { Link } from "react-router-dom";
import { setCookie } from "../../helpers/session";
import { LanguageContext } from "../../languageContext";
// import config from "../../containers/LanguageSwitcher/config";
const { changeLanguage } = actions;

function LanguageSwitcher(props) {
  const { setValue } = useContext(LanguageContext)
  const handleChange = (lang: string) => {
    setCookie("currentLanguage", lang)
    props.changeLanguage(lang)
    setValue(lang);
  }
  return (
    <li className="lang-sec"><Link to={"#"} onClick={() => {
      handleChange('english');
    }} >En</Link>
      <Link to={"#"} onClick={() => {
        handleChange('arabic');
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

function mapStateToProps(state) {
  return state.LanguageSwitcher

}
export default connect(
  mapStateToProps,
  { changeLanguage }
)(LanguageSwitcher);
