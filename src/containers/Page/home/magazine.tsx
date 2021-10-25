import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCookie } from "../../../helpers/session";
import { MagazineList } from '../../../redux/pages/magazineList';
import IntlMessages from "../../../components/utility/intlMessages";
import { Link } from "react-router-dom";


function Magazine(props) {

    const [items, setItems] = useState([]);
    const language = getCookie('currentLanguage');
    useEffect(() => {
        async function getData() {
            let lang = props.languages ? props.languages : language;
            let result: any = await MagazineList(lang);
            setItems(result.data.slice(0, 2));
        }
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])


    return (
        <section>
            <div className="container">
                <div className="col-sm-12">
                    <div className="magazine_article ">
                        <h1 className="mb-4"><IntlMessages id="menu_Magazine" /></h1>
                        <div className="row">
                            {items.map((item,i) => {
                                return (
                                    <div className="col-sm-6" key={i}>
                                        <div className="magzine_blog">
                                            <div className="blog_img">
                                                <img src={item.post_thumbnail} alt="" className="img-fluid" />
                                            </div>
                                            <h3 className="text">{item.title}</h3>
                                            <p dangerouslySetInnerHTML={{ __html: item.short_content }} />
                                            <Link to={"/magazine/" + item.post_id} className="btn btn-secondary"><IntlMessages id="magazine.read_more" /></Link>
                                        </div>
                                    </div>
                                )
                            })}


                        </div>
                    </div>
                </div>

            </div>
        </section>
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
)(Magazine);