import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function DiscoverCategories(props) {
    useEffect(() => {
    }, [])

    return (
        <section className="width-100 my-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="dis-catgry">
                            <h1>Discover categories</h1>
                        </div>
                    </div>
                    <div className="categoriy-list">
                        <div className="row">
                            <div className="col-sm-3">
                                <div className="card mx-auto col-md-3 col-10 mt-5">
                                    <img className='mx-auto img-thumbnail' src="images/cat-watches.svg" width="auto" height="auto" />
                                    <a href="#" className="btn btn-white-primary cart px-auto">Watches</a>
                                    <div className="card-body text-center mx-auto">
                                        <div className='cvp'>

                                            <a href="#" className="btn details px-auto">View more</a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-3">

                                <div className="card mx-auto col-md-3 col-10 mt-5">
                                    <img className='mx-auto img-thumbnail' src="images/cat-jewelry.svg" width="auto" height="auto" />
                                    <a href="#" className="btn btn-white-primary cart px-auto">Jewelery</a>
                                    <div className="card-body text-center mx-auto">
                                        <div className='cvp'>

                                            <a href="#" className="btn details px-auto">View more</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-3">

                                <div className="card mx-auto col-md-3 col-10 mt-5">
                                    <img className='mx-auto img-thumbnail' src="images/cat-new in.svg" width="auto" height="auto" />
                                    <a href="#" className="btn btn-white-primary cart px-auto">ADD TO CART</a>
                                    <div className="card-body text-center mx-auto">
                                        <div className='cvp'>

                                            <a href="#" className="btn details px-auto">View more</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <div className="card mx-auto col-md-3 col-10 mt-5">
                                    <img className='mx-auto img-thumbnail' src="images/cat-designers.svg" width="auto" height="auto" />
                                    <a href="#" className="btn btn-white-primary cart px-auto">ADD TO CART</a>
                                    <div className="card-body text-center mx-auto">
                                        <div className='cvp'>
                                            <button type="button" className="btn btn-link">Link</button>
                                            <a href="#" className="btn details px-auto">View more</a>
                                        </div>
                                    </div>
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
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(DiscoverCategories);