import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function Notifications(props) {
    const userGroup = localStorage.getItem('token')
    const [isPriveUser, setIsPriveUser] = useState((userGroup && userGroup == '4') ? true : false);
    const [name, setName] = useState(localStorage.getItem('token_name'));
    const history = useHistory();
    const key = props.match.params.tab;
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        setActiveTab(key);
    }, [key]);

    const changeTab = (tab) => {
        history.push(`/customer/${tab}`);
        setActiveTab(tab);
    }

    const changeMobTab = (e) => {
        changeTab(e.target.value);
    }



    return (
        <main>
            <section className="mt-5">
                <div className="container">
                    <div className="row">

                        <div className="col-sm-3">
                            <div className="date-range">
                                <h4>Date</h4>
                                <div className="date-range-list">
                                    <ul className="list-unstyled">
                                        <li>
                                            <Link to="#" className="current">All</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Just now</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Last Hour</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Today</Link>
                                        </li>
                                        <li>
                                            <Link to="#">Yesterday</Link>
                                        </li>
                                        <li>
                                            <Link to="#">1 week</Link>
                                        </li>
                                        <li>
                                            <Link to="#">2 week</Link>
                                        </li>
                                        <li>
                                            <Link to="#">3 week</Link>
                                        </li>
                                        <li>
                                            <Link to="#">4 week</Link>
                                        </li>
                                        <li>
                                            <Link to="#">1 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">2 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">3 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">4 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">5 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">6 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">7 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">8 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">9 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">10 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">11 month</Link>
                                        </li>
                                        <li>
                                            <Link to="#">12 month</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div className="col-sm-9">

                            <div className="my_orders_returns_sec">
                                <div className="width-100">
                                    <h1>Notifications</h1>
                                    <h2>Check your notifications. Stay up to date with discounts and new collections.</h2>
                                </div>

                                <div className="notification-actions">
                                    <ul className="list-inline mb-1">
                                        <li className="list-inline-item">
                                            <Link to="#">Remove all</Link>
                                        </li>
                                        <li className="list-inline-item">
                                            <Link to="#">Change into viewed</Link>
                                        </li>
                                    </ul>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="resltspage_sec">
                                            <div className="paginatn_result">
                                                <span>Results per page</span>
                                                <ul>
                                                    <li><Link to="#" className="active">12</Link></li>
                                                    <li><Link to="#">60</Link></li>
                                                    <li><Link to="#">120</Link></li>
                                                </ul>
                                            </div>
                                            <div className="sort_by">
                                                <div className="sortbyfilter">

                                                    <select className="form-select customfliter"
                                                        aria-label="Default select example">
                                                        <option>Sort by </option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <section className="notification-list">

                                    <div className="notification-new">
                                        <h5>New</h5>
                                        <div className="notify">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-heart" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">10 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify read">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-percent" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="notification-earlier">
                                        <h5>Earlier</h5>

                                        <div className="notify">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-heart" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">10 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-percent" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify read">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-tag" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-birthday-cake" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify read">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-heart" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-tag" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notify">
                                            <div className="row d-flex align-items-center m-0">
                                                <div className="col-2 col-sm-2 col-lg-1 notify-label text-center">
                                                    <i className="fa fa-birthday-cake" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-8 col-sm-8 col-lg-6 msg">
                                                    <p>The product on your wishlist has been discounted.</p>
                                                    <p className="n-status">12 minutes ago</p>
                                                </div>
                                                <div className="col-2 col-sm-2 col-lg-2">
                                                    <div className="status-dot"><i className="fa fa-square" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-lg-3">
                                                    <Link to="#">Checkout</Link>
                                                </div>
                                            </div>
                                        </div>





                                    </div>

                                </section>


                                <div className="resltspage_sec footer-pagints">
                                    <div className="paginatn_result">
                                        <span>Results per page</span>
                                        <ul>
                                            <li><Link to="#" className="active">12</Link></li>
                                            <li><Link to="#">60</Link></li>
                                            <li><Link to="#">120</Link></li>
                                        </ul>
                                    </div>
                                    <div className="page_by">
                                        <div className="pagination">

                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination">
                                                    <li className="page-item">
                                                        <Link to="#" className="page-link" aria-label="Previous">
                                                        </Link><Link to="#"><img src="images/arrow-left.svg" className="img-fluid"
                                                            alt="" /></Link>

                                                    </li>
                                                    <li className="page-item"><Link to="#" className="page-link" >Page</Link></li>
                                                    <li className="page-item"><Link to="#" className="page-link">1</Link></li>
                                                    <li className="page-item"><Link to="#" className="page-link">of</Link></li>
                                                    <li className="page-item"><Link to="#" className="page-link" >3</Link></li>
                                                    <li className="page-item">
                                                        <Link to="#" className="page-link" aria-label="Next">
                                                        </Link><Link to="#"><img src="images/arrow-right.svg" className="img-fluid"
                                                            alt="" /></Link>

                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </main>
    )
}
const mapStateToProps = (state) => {
    // console.log(state)
    return {}
}

export default connect(
    mapStateToProps
)(Notifications);