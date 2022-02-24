import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCookie } from "../../helpers/session";
import { MagazineList } from '../../redux/pages/magazineList';
import { siteConfig } from '../../settings';
function Magazine(props) {
    const [items, setItems] = useState([]);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await MagazineList(lang, siteConfig.pageSize);
            setItems(result?.data);
        }
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])


    return (
        <>
            <div className="container magazine-inner">
                <figure className="offset-md-1 ps-4  page-head">
                    <svg xmlns="http://www.w3.org/2000/svg" width="770" height="134" viewBox="0 0 770 134">
                        <text id="Magazines" transform="translate(385 98)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="110"
                            fontFamily="Monument Extended Book">
                            <tspan x="-383.515" y="0"><IntlMessages id="magazine.header" /></tspan>
                        </text> </svg>
                </figure>
                <div className="row my-3 mag-first-sec arabic-rtl-direction">
                    <div className="mag-come-soon"><IntlMessages id="magazine.comingsoon" /></div>                  

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
    {}
)(Magazine);
