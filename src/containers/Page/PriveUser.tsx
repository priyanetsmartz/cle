import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Pages } from '../../redux/pages/allPages';
import banner from "../../image/prive-top-banner.png";
import logo from "../../image/logo_prive_kopia.png";
import gem from "../../image/gem-solid.png";
import clock from "../../image/clock-solid.png";
import gold from "../../image/gift-solid.png";
import { connect } from 'react-redux';
import IntlMessages from "../../components/utility/intlMessages";
import { getCookie } from "../../helpers/session";

function PriveUser(props) {
  const [pagesData, SetPagesData] = useState({ title: '', content: '' })
  const language = getCookie('currentLanguage');
  useEffect(() => {
    async function fetchMyAPI() {
      let lang = props.languages ? props.languages : language;
      let result: any = await Pages('cle-prive', lang);
      var jsonData = result.data.items[0];
      SetPagesData(jsonData)

    }
    fetchMyAPI()
  }, [props.languages,language])
  return (
    <>
      <div className="container magazine-inner">
        <div className="row mt-3 mag-list-head">
          <div className="col-md-6 offset-md-3 text-center">

          </div>
        </div>
      </div>
      <div className="prive-top-banner">
        <img src={banner} alt="prive-banner" />
        <div className="prive-banner-content container">
          <div className="prive-banner-left-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="381" height="130.75" viewBox="0 0 381 130.75">
              <text id="Privé" transform="translate(20 79.25)" fill="none" stroke="#fff" strokeWidth="1.25" fontSize="79" fontFamily="Monument Extended" font-weight="700"><tspan x="0" y="0"><IntlMessages id="prive.top1" /></tspan></text>
              <text id="account" transform="translate(0 111.75)" fill="#017abb" fontSize="60" fontFamily="Monument Extended" font-weight="500"><tspan x="0" y="0"><IntlMessages id="prive.top2" /></tspan></text> </svg>
            <p>
              <div dangerouslySetInnerHTML={{ __html: pagesData ? pagesData.content : "Ooops Page not found...." }} />
            </p>
            <Link className="signup-btn" to="/profile"><IntlMessages id="prive.cta" /></Link>
          </div>
          <div className="prive-banner-right-content">
            <img src={logo} alt="logo" />
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
      <div className="container">

        <div className="row">
          <div className="col-md-12 breadcrumb my-3"><Link to="/"><IntlMessages id="prive.home" /> </Link> / <IntlMessages id="prive.onboard" /></div>
        </div>

        <div className="row">
          <div className="col-md-8 offset-md-2 prive-benefits">
            <h2><IntlMessages id="prive.benefits" /> </h2>
            <p><IntlMessages id="prive.slogan" /></p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="prive-benf-col">
              <img src={gem} alt="Privé Exclusives" />
              <p><IntlMessages id="prive.exclusives" /></p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="prive-benf-col">
              <img src={clock} alt="Early access products" />
              <p><IntlMessages id="prive.early" /></p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="prive-benf-col">
              <img src={gold} alt="The Birthday reward" />
              <p><IntlMessages id="prive.birthday" /></p>
            </div>
          </div>
        </div>

      </div>

      <div className="start-shopping">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2><IntlMessages id="prive.benefits" /></h2>
              <p><IntlMessages id="prive.slogan" /></p>
              <Link className="cle-btn-white-bg" to="#"><IntlMessages id="prive.comingsoon" /></Link>
            </div>
          </div>
        </div>
      </div>
    </>
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
  {})(PriveUser);