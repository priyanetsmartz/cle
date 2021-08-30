import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import SizeGuide from './sizeGuide';
import MeasuringGuide from './measuringGuide';
import Recomendations from './recomendations';
import ProductsMagazine from './magazine';

import ProductImages from './productImges';
import ShareIcon from '../../../../image/share-alt-solidicon.svg';
import cleWork from '../../../../image/cle work-logo.svg';
import social1 from "../../../../image/checkout-social-1.png";
import social2 from "../../../../image/checkout-social-2.png";
import social3 from "../../../../image/checkout-social-3.png";
import social4 from "../../../../image/checkout-social-4.png";
import social5 from "../../../../image/checkout-social-5.png";
import social6 from "../../../../image/checkout-social-6.png";
import social7 from "../../../../image/checkout-social-7.png";

function ProductDetails(props) {
    const [isPriveuser, setIsPriveUser] = useState(false);
    const [productImages, setProductImages] = useState([
        social1, social2, social3, social4, social5, social6, social7
    ]);
    const [sizeGuideModal, setSizeGuideModal] = useState(false);
    const [measuringGuideModal, setMeasuringGuideModal] = useState(false);

    useEffect(() => {
        console.log(props.items.Cart);
        setSizeGuideModal(props.items.Cart.isOpenSizeGuide);
        setMeasuringGuideModal(props.items.Cart.isOpenMeasuringGuide);
    }, [props.items.Cart]);

    const sizeGuideModalHandler = () => {
        setSizeGuideModal(!sizeGuideModal);
    }

    return (
        <>
            <main>
                <section>
                    <div className="notification">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="promotion_alert">
                                        <p>
                                            <span className="promition">promotion</span> Contrary to popular belief, Lorem Ipsum is not simply random
                                            text.
                                        </p>
                                    </div>
                                    <div className="alert_cross">
                                        <a href="#"><img src="images/cross.svg" className="" alt="" /> </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item"><a href="#">Women</a></li>
                                        <li className="breadcrumb-item"><a href="#">Designers</a></li>
                                        <li className="breadcrumb-item"><a href="#">Bottega Veneta</a></li>
                                        <li className="breadcrumb-item"><a href="#">Jewelry</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Necklaces</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="product-slider">
                                    <ProductImages  productImages = {productImages}/>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="product_description">
                                    <div className="list_accordon">
                                        <ul>
                                            <li><a href="#" className="active">Sale</a></li>
                                            <li><a href="#">New Designers</a></li>
                                            <li><a href="#">Popular</a></li>
                                        </ul>
                                        {isPriveuser && <div className="logo_stampg">
                                            <a href="#"><img src={cleWork} alt="" className="img-fluid" /></a>
                                        </div>}
                                    </div>
                                    <div className="product_details">
                                        <h1>Bottega Veneta</h1>
                                        <h2>18Kt Gold-Plated Sterling-Silver Chain Necklace</h2>
                                    </div>
                                    <div className="product-sale_off mt-4 mb-4">
                                        <div className="product_saleoff"><span className="saleoff">$2,850</span> now 25% off</div>
                                        <div className="product_price">$2,137</div>
                                    </div>
                                    <div className="selection-process mb-2">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <span className="form-label">Quantity:</span>
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option value="">1</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <span className="form-label">Size:</span>
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option value="">One size</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <a className="" onClick={sizeGuideModalHandler}>Size Guide</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="width-100 my-3">
                                        <div className="d-grid">
                                            <button type="button" className="btn btn-primary"><img src="images/carticon_btn.svg" alt="" className="pe-1" />
                                                Add to Cart</button>
                                        </div>
                                    </div>

                                    <div className="row my-3">
                                        <div className="d-grid gap-2 d-md-flex justify-content-start">
                                            <Link to="my-cart" type="button" className="btn btn-outline-primary me-4">Send a Gift</Link>
                                            <button type="button" className="btn btn-outline-success"><img src={ShareIcon} alt=""
                                                className="pe-1" /> </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="accodian_descrpt">
                                    <div className="accordion accordion-flush" id="accordionFlushExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingOne">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                    Description
                                                </button>
                                            </h2>
                                            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                                                data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <p> Bottega Veneta’s 18kt gold-plated sterling-silver necklace is joined with marbled-brown
                                                        picture jasper links – a semi-precious healing stone thought to bring tranquility to the wearer.
                                                        It’s handcrafted by an Italian goldsmith with curb and irregular-chain links. Alternate between
                                                        wearing it with the T-bar pendant at the front and back.</p>
                                                    <p> Shown here with Bottega Veneta Gathered-back balloon-sleeve poplin shirt.</p>
                                                    <p> Product number: 1396090</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingTwo">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                    Details
                                                </button>
                                            </h2>
                                            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                                                data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div className="details_product">
                                                        <ul>
                                                            <li>Colour: Gold</li>
                                                            <li>Composition: 18kt gold-plated sterling silver.</li>
                                                            <li>Country of origin: Italy</li>
                                                            <li>Curb-chain links</li>
                                                            <li>Picture jasper-stone links</li>
                                                            <li>T bar</li>
                                                            <li>Clasp fastening</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingThree">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                    Size
                                                </button>
                                            </h2>
                                            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree"
                                                data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div className="details_product">
                                                        <ul>
                                                            <li> Chain length 16.6in/42.5cm</li>
                                                            <li> Max feature width 1.4in/3.8cm</li>
                                                            <li> Max feature length 0.7in/1.3cm</li>
                                                        </ul>
                                                        <a href="#" className="sizeguid">Size Guide</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingFourth">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#flush-collapseFourth" aria-expanded="false" aria-controls="flush-collapseThree">
                                                    Shipping and returns
                                                </button>
                                            </h2>
                                            <div id="flush-collapseFourth" className="accordion-collapse collapse"
                                                aria-labelledby="flush-headingFourth" data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div className="express_rate">
                                                        <ul>
                                                            <li>Express: EUR $25</li>
                                                        </ul>
                                                        <p>
                                                            Delivery between 9am-5pm, Monday to Friday
                                                            Receive your purchases in 2-3 working days after your order has been placed
                                                        </p>
                                                        <ul>
                                                            <li>Standard: EUR $15</li>
                                                        </ul>
                                                        <p>
                                                            Delivery between 9am-5pm, Monday to Friday
                                                            Receive your purchases in 3-4 working days after your order has been placed
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                   <Recomendations/>
                </section>

                <section>
                   <ProductsMagazine/>
                </section>
            </main>

            {/* size guide modal starts here */}
            <Modal show={sizeGuideModal} size="lg">
                <SizeGuide/>
            </Modal>
            {/* size guide modal ends here */}
            {/* measuring guide modal starts here */}
            <Modal show={measuringGuideModal}  size="lg">
                <MeasuringGuide/>
            </Modal>
            {/* measuring guide modal ends here */}
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state
    }
}

export default connect(
    mapStateToProps
)(ProductDetails);