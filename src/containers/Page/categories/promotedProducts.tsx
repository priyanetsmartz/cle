import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";


function PromotedProducts(props) {
    return (
        <section className="new-in-brand-sec">
            <div className="container">
                <div className="col-sm-12">
                    <div className="magazine_article ">
                        <h1 className="mb-4">Versace</h1>
                        <p className="new-in-brand-desc">They love to study fashion trends, sketch designs, select materials,
                            and have a part in all the production aspects of their designs.</p>
                        <div className="row">

                            <div className="col-sm-5">
                                <div className="new-in-brandMainPic">
                                    <img src="images/blog_1.jpg" alt="" className="img-fluid" />
                                    <Link to="/products/promoted" className="BrandMainPic-btn">
                                        <IntlMessages id="category.viewAll" /></Link>
                                </div>
                            </div>

                            <div className="col-sm-7">
                                <div className="brand-pro-list">
                                    add products here
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
)(PromotedProducts);