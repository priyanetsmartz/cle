import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function Designer(props) {
    useEffect(() => {
    }, [])

    return (
        <section className="width-100 my-5">
            <div className="container">
                <div className="row ">
                    <div className="col-sm-12 col-md-6 px-0">
                        <div className="best-product-profile">
                            <img src="images/best-priofile.svg" alt="" className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 px-0">
                        <div className="best-from-designers">
                            <h2>Best from designers</h2>
                            <h3>FROM: Browns, London TO: Michelle Elie,</h3>
                            <p>Browns boutique is fast becoming a driving force in the sustainable fashion space. Accessories designer
                                @michelle_elie picks her favorite pieces from the store’s impressive edit of consciously minded
                                designers.</p>
                            <button type="button" className="btn btn-secondary">Read and Shop</button>
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
)(Designer);