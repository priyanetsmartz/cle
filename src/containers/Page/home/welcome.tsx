import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getContent } from '../../../redux/pages/customers';



function Welcome(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getContent(props.languages, 'home_page_banner');
        if (result) {
            SetPagesData(result.data.items[0]);
        }
    }

    return (
        <>
            {pagesData ? <div dangerouslySetInnerHTML={{ __html: pagesData.content }} /> : ""}

            {/* <section className="welcome_sec">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 pt-12">
                            <div className="welcome_marketbanner">
                                <div className="welcome_inner">
                                    <h1>WELCOME TO OUR MARKETPLACE</h1>
                                    <h2>Summer redolence</h2>
                                    <p className="fst-italic">
                                        Refreshing fragrances reminiscent of the warm weather
                                    </p>
                                    <button type="button" className="btn btn-white-outline">Discover</button>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div className="overlay-black"></div>
                <img src="images/homebanner.svg" className="img-fluid welcome-slide" alt="" />


            </section> */}
        </>
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
)(Welcome);