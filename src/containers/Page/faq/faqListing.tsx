import { useState, useEffect } from 'react';
import { connect } from "react-redux";

function FaqListing(props) {

    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="FAQ-head">Returns & Refunds</h3>
                        <div className="accordion helpCenter-ViewAll" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                        Accordion Item #1
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <p><strong>This is the first item's accordion body.</strong> It is shown by default, until the
                                            collapse plugin adds the appropriate classNamees that we use to style each element. </p>
                                        <p>These classNamees control the overall appearance, as well as the showing and hiding via CSS
                                            transitions. You can modify any of this with custom CSS or overriding our default variables.</p>
                                        <p>It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>,
                                            though the transition does limit overflow.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Accordion Item #2
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                                        collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees
                                        control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                        modify any of this with custom CSS or overriding our default variables. It's also worth noting that
                                        just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit
                                        overflow.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Accordion Item #3
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the
                                        collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees
                                        control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                        modify any of this with custom CSS or overriding our default variables. It's also worth noting that
                                        just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit
                                        overflow.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <h3 className="FAQ-head">Related FAQs</h3>
                        <div className="accordion helpCenter-ViewAll" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingRelateOne">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseRelateOne" aria-expanded="false" aria-controls="collapseRelateOne">
                                        Accordion Item #1
                                    </button>
                                </h2>
                                <div id="collapseRelateOne" className="accordion-collapse collapse" aria-labelledby="headingRelateOne"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse
                                        plugin adds the appropriate classNamees that we use to style each element. These classNamees control the
                                        overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of
                                        this with custom CSS or overriding our default variables. It's also worth noting that just about any
                                        HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingRelateTwo">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseRelateTwo" aria-expanded="false" aria-controls="collapseRelateTwo">
                                        Accordion Item #2
                                    </button>
                                </h2>
                                <div id="collapseRelateTwo" className="accordion-collapse collapse" aria-labelledby="headingRelateTwo"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
                                        collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees
                                        control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                        modify any of this with custom CSS or overriding our default variables. It's also worth noting that
                                        just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit
                                        overflow.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingRelateThree">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseRelateThree" aria-expanded="false" aria-controls="collapseRelateThree">
                                        Accordion Item #3
                                    </button>
                                </h2>
                                <div id="collapseRelateThree" className="accordion-collapse collapse" aria-labelledby="headingRelateThree"
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the
                                        collapse plugin adds the appropriate classes that we use to style each element. These classNamees
                                        control the overall appearance, as well as the showing and hiding via CSS transitions. You can
                                        modify any of this with custom CSS or overriding our default variables. It's also worth noting that
                                        just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit
                                        overflow.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
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
)(FaqListing);