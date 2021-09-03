import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCookie } from "../../helpers/session";
import { MagazineList } from '../../redux/pages/magazineList';

function Magazine(props) {
    const [items, setItems] = useState([]);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await MagazineList(lang);
            setItems(result.data);
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
                        <text id="Magazine" transform="translate(385 98)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="110"
                            fontFamily="Monument Extended Book">
                            <tspan x="-383.515" y="0"><IntlMessages id="magazine.header" /></tspan>
                        </text> </svg>
                </figure>
                <div className="row my-3 mag-first-sec arabic-rtl-direction">
                    {items.slice(0, 4).map((item, i) => {
                        return (
                            <div className={"col-md-5 " + (((i % 2) === 0) ? 'offset-md-1' : 'mt-5')} key={i}>
                                <div className="blog-sec-main">
                                    <div className="mag-blog-pic"><img src={item.list_thumbnail} alt="list-thumbnail" /></div>
                                    <h3 className="mag-blog-title mt-5 mb-3">{item.title}</h3>
                                    <div className="mag-blog-desc d-none"><div dangerouslySetInnerHTML={{ __html: item.short_content }} />...</div>
                                    <Link to={"/magazine/" + item.post_id} className="signup-btn"><IntlMessages id="magazine.read_more" /></Link>
                                </div>
                            </div>
                        );
                    })}
                    {!items.length && (
                        <div className="container">
                            <IntlMessages id="no_data" />
                        </div>
                    )}
                    <figure className="new-heading-back">
                        <svg xmlns="http://www.w3.org/2000/svg" width="770" height="134" viewBox="0 0 770 134">
                            <text id="Magazine" transform="translate(385 98)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="110"
                                fontFamily="Monument Extended Book">
                                <tspan x="-383.515" y="0"><IntlMessages id="magazine.header" /></tspan>
                            </text>
                        </svg>
                    </figure>

                </div>
                <div className="row mt-5 arabic-rtl-direction">
                    <div className="col-12 text-center">
                        <Link to={"/magazines"} className="signup-btn" href=""><IntlMessages id="magazine.see_all_articles" /></Link>
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
    {}
)(Magazine);
