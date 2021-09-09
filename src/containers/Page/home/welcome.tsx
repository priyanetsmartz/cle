import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function Welcome(props) {
    useEffect(() => {
    }, [])

    return (
        <section className="welcome_sec">
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
)(Welcome);