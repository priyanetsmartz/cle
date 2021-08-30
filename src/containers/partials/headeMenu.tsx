import { useEffect } from 'react';
import { connect } from 'react-redux'
import CLELogo from '../../image/CLIlogo.png'
import avatar from '../../image/avtar.svg'
import favorit from '../../image/favrot.svg'
import cartIcon from '../../image/carticon.svg'
import IconZoomIn from '../../image/Icon_zoom_in.svg'
import { Link } from "react-router-dom";

function HeaderMenu(props) {
    useEffect(() => {
    }, [])

    return (
        <>
            <div className="container">
                <div className="row flex-nowrap justify-content-between align-items-center top-menuselect">
                    <div className="col-4 pt-1">
                        <div className="select-wearing">
                            <ul>
                                <li> <Link href="#" className="line-through-active up-arrow">Women</Link> </li>
                                <li> <Link href="#">Men</Link></li>
                                <li> <Link href="#">Kids</Link></li>
                                <li> <Link href="#">All</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="cli_logo">
                            <Link className=" me-2" to="/">
                                <img src={CLELogo} className="img-fluid"  alt="logo"/>
                            </Link>
                        </div>
                    </div>
                    <div className="col-4">

                        <div className="sell_item" style={{ display: 'none' }}>
                            <div className="sell_itemnote mb-2">
                                <Link href="" className="btn btn-green">Sell an Item</Link>
                            </div>
                        </div>

                        <div className="user_cart">
                            <div className="cartuser-info">
                                <ul>
                                    <li><Link href="#">Alex </Link></li>
                                    <li> <Link href="#"><img src={avatar} alt="userimage" /> </Link></li>
                                    <li> <Link href="#"><img src={favorit}  alt="wishlist"/></Link> </li>
                                    <li> <Link href="#"><img src={cartIcon} alt="cart" /> <span className="cart-number">(3)</span></Link></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <header className="header-top navbar navbar-expand-md navbar-light main-navbr mb-2">



                <nav className="container-xxl flex-wrap flex-md-nowrap " aria-label="Main navigation">


                    <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar"
                        aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="bi" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z">
                            </path>
                        </svg>

                    </button>

                    <div className="navbar-collapse collapse mainmenu-bar" id="bdNavbar">
                        <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="/">New in</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2 active" aria-current="true" href="#" >Watches</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="/docs/5.0/examples/" >Jewerly</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="https://icons.getbootstrap.com/" target="_blank"
                                    rel="noopener">Designers</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="https://themes.getbootstrap.com/" target="_blank"
                                    rel="noopener">Pre-Owned</Link>
                            </li>
                            <li className="nav-item col-6 col-md-auto">
                                <Link className="nav-link p-2" href="https://blog.getbootstrap.com/" target="_blank"
                                    rel="noopener">Sale</Link>
                            </li>
                        </ul>

                        <hr className="d-md-none text-white-50" />

                        <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                            <div className="search_input">
                                <div className="search_top"><img src={IconZoomIn} alt="" className="me-1" />
                                    <input type="search" placeholder="Search..." className="form-control me-1" />
                                    <select className="form-select" aria-label="Default select example">
                                        <option value="">Select category</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>

                                </div>
                            </div>
                        </ul>


                    </div>
                </nav>


            </header>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(HeaderMenu);