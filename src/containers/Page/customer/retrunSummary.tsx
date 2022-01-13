import React from 'react';
import ReturnFooter from './returnFooter';

function retrunSummary(props) {
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="main-head">
                            <h1>Return summary</h1>
                            <h2>Here's your return summary. There is last chance to cancel the return .</h2>
                        </div>

                        <div className="return-det">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Return number: 103934438484833</h5>
                                </div>
                                <div className="col-sm-3">
                                    <h6>Returned created date</h6>
                                    <p>Mon, 10 May 2021</p>
                                </div>
                                <div className="col-sm-3">
                                    <h6>Drop off date</h6>
                                    <p>Mon, 01 June 2021</p>
                                </div>
                                <div className="col-sm-3">
                                    <h6>Payment method</h6>
                                    <p>Mastercard</p>
                                </div>
                                <div className="col-sm-3">
                                    <h6>Products</h6>
                                    <p>13</p>
                                </div>
                            </div>
                        </div>

                        <div className="what-next">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="next-conts">
                                        <h4>What's next?</h4>
                                        <ul className="list-unstyled m-0">
                                            <li><i className="fas fa-check"></i> There is last chance to cancel the return. Please check all chosen
                                                products.</li>
                                            <li><i className="fas fa-key"></i> Choose days and preferred hour then the courier will pick the parcel
                                                up</li>
                                            <li><i className="fas fa-print"></i> Print the returns label we have emailed you and attach it to the
                                                outside of your parcel</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <section>
                            <div className="row">
                                <div className="col-md-7">

                                    <div className="pick-date">
                                        <div className="accordion" id="accordionPanelsStayOpenExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                                        aria-controls="panelsStayOpen-collapseOne">
                                                        Pickup date
                                                    </button>
                                                </h2>
                                                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show"
                                                    aria-labelledby="panelsStayOpen-headingOne">
                                                    <div className="accordion-body">
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                                                        aria-controls="panelsStayOpen-collapseTwo">
                                                        Pickup time slot
                                                    </button>
                                                </h2>
                                                <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse"
                                                    aria-labelledby="panelsStayOpen-headingTwo">
                                                    <div className="accordion-body">
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                                                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-5">

                                </div>
                            </div>
                        </section>


                        <section>

                            <div className="return-det">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h3>Summary</h3>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Pickup date </h6>
                                        <p>Mon, 24 May 2021</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Pickup time slot</h6>
                                        <p>8 am. - 11 am.</p>
                                    </div>
                                    <div className="col-sm-3">
                                        <h6>Products</h6>
                                        <p>13</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-tot">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="return-user-info">
                                            <h5>User Information</h5>
                                            <address>
                                                Ann Smith<br />
                                                Baker Street<br />
                                                40-333<br />
                                                London<br />
                                                Great Britain
                                            </address>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="return-user-total">
                                            <h5>Return Total</h5>
                                            <table className="table table-borderless mb-0">
                                                <tr>
                                                    <td>Subtotal</td>
                                                    <th className="text-end">$8,533</th>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <th className="text-end">$0</th>
                                                </tr>
                                                <tr className="r-tax">
                                                    <td>Tax</td>
                                                    <th className="text-end">$741</th>
                                                </tr>
                                                <tr className="tot-bor">
                                                    <th>Tax</th>
                                                    <th className="text-end fin-p">$9,274</th>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 text-center">
                                        <a href="#" className="btn btn-return">Return Products</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <ReturnFooter />

                    </div>
                </div>
            </div>
        </main >
    );
}

export default retrunSummary;