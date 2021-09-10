import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';


function PriveExclusive(props) {

    useEffect(() => {
    }, []);


    return (
        <section>
            <div className="container">
                <div className="col-sm-12">
                    <div className="magazine_article ">
                        <h1 className="mb-4">Magazine</h1>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="magzine_blog">
                                    <div className="blog_img">
                                        <img src="images/blog_1.jpg" alt="" className="img-fluid" />
                                    </div>
                                    <h3 className="text">Preppy style: how to wear the trend in 2021</h3>
                                    <p className="text">This season’s runways were packed with preppy references, from V-neck
                                        knitted sweaters
                                        to socks with loafers. But what is preppy style and how do you cremplement your look,
                                        jewellery is a
                                        tremplement your look, jewellery is a tremplement your look, jewellery is a tremplement
                                        your look,
                                        jewellery is a tremplement your look, jewellery is a tremplement your look, jewellery is
                                        a
                                        tremplement your look, jewellery is a tremplement your look, jewellery is a treate a...
                                    </p>
                                    <button type="button" className="btn btn-secondary"> Read more</button>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="magzine_blog">
                                    <div className="blog_img">
                                        <img src="images/blog_1.jpg" alt="" className="img-fluid" />
                                    </div>
                                    <h3 className="text">Introducing... The Jewellery Guide</h3>
                                    <p className="text">Adding the final touch to complement your look, jewellery is a treasured
                                        accesmplement
                                        your look, jewellery is a tremplement your look, jewellery is a tremplement your look,
                                        jewellery is
                                        a tremplement your look, jewellery is a tremplement your look, jewellery is a tresory
                                        that varies
                                        from the everyday to the collectible. Whether you are sourcing a logo...</p>
                                    <button type="button" className="btn btn-secondary"> Read more</button>
                                </div>
                            </div>

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
)(PriveExclusive);