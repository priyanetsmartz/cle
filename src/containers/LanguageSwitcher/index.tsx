import { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import actions from "../../redux/languageSwitcher/actions";
import { Link } from "react-router-dom";
import { setCookie } from "../../helpers/session";
import { LanguageContext } from "../../languageContext";
const { changeLanguage } = actions;

function LanguageSwitcher(props) {
  const { setValue } = useContext(LanguageContext)
  const [highlight, setHighlight] = useState('english');
  const handleChange = (lang: string) => {
    setCookie("currentLanguage", lang)
    props.changeLanguage(lang)
    setHighlight(lang);
    setValue(lang);
    if (lang === 'arabic') {
      document.body.setAttribute('dir',"rtl")
    } else {
      document.body.removeAttribute('dir')
    }
    window.location.reload();
  }
  useEffect(() => {
    setHighlight(props.languages);
  }, [props.languages]);
  return (
    <li className="lang-sec"><Link to="#" style={{ "display": highlight === 'english' ? "none" : "inline-block" }} className={highlight === 'english' ? 'highlighted' : ''} onClick={() => {
      handleChange('english');
    }} >En</Link>
      <Link to="#" style={{ "display": highlight === 'arabic' ? "none" : "inline-block" }} className={highlight === 'arabic' ? 'highlighted' : ''} onClick={() => {
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
  let languages = '';
  if (state && state.LanguageSwitcher) {
    languages = state.LanguageSwitcher.language;
  }

  return {
    languages: languages
  }

}
export default connect(
  mapStateToProps,
  { changeLanguage }
)(LanguageSwitcher);
