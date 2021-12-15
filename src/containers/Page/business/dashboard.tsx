import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getCookie } from '../../../helpers/session';
import { GetDataOfCategory } from '../../../redux/pages/magazineList';

function Dashboard(props) {
    const language = getCookie('currentLanguage');
    let lang = props.languages ? props.languages : language;
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(1);

    useEffect(() => {
        getDataOfCategory(lang, 9, 1, 'published_at', 'desc')
    }, [])

    async function getDataOfCategory(languages, cat, page, sortBy = "published_at", sortByValue = "desc") {
        let result: any = await GetDataOfCategory(languages, cat, page, sortBy, sortByValue);
        console.log(result.data);
        setItems(result.data);

    }
    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>Important announcements</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div id="page-wrapper" className="container">
                            {items.length > 0 && (
                                <div className="row">
                                    {items.map((item, i) => {
                                        return (<div className="col-sm-6" key={i}>
                                            <div className="panel panel-info">
                                                <div className="panel-heading">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <i className="fa fa-users"></i>
                                                        </div>
                                                        <div className="col-sm-8 text-right">
                                                            <p className="announcement-heading">{item.title}</p>
                                                            <p className="announcement-text"><div dangerouslySetInnerHTML={{ __html: item.full_content }} /></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
       
    }
}

export default connect(
    mapStateToProps
)(Dashboard);