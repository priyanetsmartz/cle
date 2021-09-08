import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import SizeGuide from './sizeGuide';
import MeasuringGuide from './measuringGuide';
import Recomendations from './recomendations';
import ProductsMagazine from './magazine';
import { useParams } from "react-router-dom";
import ProductImages from './productImges';
import ShareIcon from '../../../../image/share-alt-solidicon.svg';
import cleWork from '../../../../image/cle work-logo.svg';
import Promotion from '../../../partials/promotion';
import { getProductDetails } from '../../../../redux/cart/productApi';
import { formatprice } from '../../../../components/utility/allutils';
function ProductDetails(props) {
    const { sku } = useParams();
    const [isPriveuser, setIsPriveUser] = useState(false);
    const [productImages, setProductImages] = useState([]);
    const [productDetails, setproductDetails] = useState({ name: "", price: 0, extension_attributes: { stock_item: { qty: 1, is_in_stock: true } }, description: "", saleprice: 0, short_description: "", shipping_and_returns: "" });
    const [sizeGuideModal, setSizeGuideModal] = useState(false);
    const [measuringGuideModal, setMeasuringGuideModal] = useState(false);

    useEffect(() => {
        getProductDetailsFxn();

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])

    useEffect(() => {
        //  console.log(props.items.Cart);
        setSizeGuideModal(props.items.Cart.isOpenSizeGuide);
        setMeasuringGuideModal(props.items.Cart.isOpenMeasuringGuide);
    }, [props.items.Cart]);

    const sizeGuideModalHandler = () => {
        setSizeGuideModal(!sizeGuideModal);
    }
    async function getProductDetailsFxn() {
        let result: any = await getProductDetails(sku);

        let description = "", special_price: 0, short, shipping_and_returns: "";
        result.data.custom_attributes.map((attributes) => {
            if (attributes.attribute_code === "description") {
                description = attributes.value;
            }
            if (attributes.attribute_code === "special_price") {
                special_price = attributes.value;
            }
            if (attributes.attribute_code === "short_description") {
                short = attributes.value;
            }
            if (attributes.attribute_code === "shipping_and_returns") {
                shipping_and_returns = attributes.value;
            }

        })
        setProductImages(result.data.media_gallery_entries)
        setproductDetails({ ...productDetails, name: result.data.name, price: result.data.price, description: description, saleprice: special_price, short_description: short, shipping_and_returns: shipping_and_returns });

    }

    return (
        <>
            <main>
                <Promotion />
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                                        <li className="breadcrumb-item"><Link to="#">Women</Link></li>
                                        <li className="breadcrumb-item"><Link to="#">Designers</Link></li>
                                        <li className="breadcrumb-item"><Link to="#">Bottega Veneta</Link></li>
                                        <li className="breadcrumb-item"><Link to="#">Jewelry</Link></li>
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
                                    <ProductImages productImages={productImages} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="product_description">
                                    <div className="list_accordon">
                                        <ul>
                                            <li><Link to="#" className="active">Sale</Link></li>
                                            <li><Link to="#">New Designers</Link></li>
                                            <li><Link to="#">Popular</Link></li>
                                        </ul>
                                        {isPriveuser && <div className="logo_stampg">
                                            <Link to="#"><img src={cleWork} alt="" className="img-fluid" /></Link>
                                        </div>}
                                    </div>
                                    <div className="product_details">
                                        <h1>{productDetails.name}</h1>
                                        <h2><div dangerouslySetInnerHTML={{ __html: productDetails.short_description }} /></h2>
                                    </div>
                                    <div className="product-sale_off mt-4 mb-4">
                                        <div className="product_saleoff">{productDetails.saleprice > 0 ? <><span className="saleoff">${formatprice(productDetails.price)}</span> now 25% off</> : <span>${formatprice(productDetails.price)}</span>}</div>
                                        {productDetails.saleprice > 0 ? <div className="product_price">${formatprice(productDetails.saleprice)}</div> : ""}
                                    </div>
                                    <div className="selection-process mb-2">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <span className="form-label">Quantity:</span>
                                                    <select className="form-select" aria-label="Default select example">
                                                        {Array.from(Array(productDetails.extension_attributes.stock_item.qty), (e, i) => {
                                                            return <option key={i + 1}>{i + 1}</option>
                                                        })}

                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <span className="form-label">Size:</span>
                                                    <select className="form-select" aria-label="Default select example">
                                                        <option value="">One size</option>

                                                        {Array.from(Array(productDetails.extension_attributes.stock_item.qty), (e, i) => {
                                                            return <option key={i}>{i}</option>
                                                        })}

                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <Link className="" to="#" onClick={sizeGuideModalHandler}>Size Guide</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="width-100 my-3">
                                        <div className="d-grid">
                                            {productDetails.extension_attributes.stock_item.is_in_stock === true && (<button type="button" className="btn btn-primary"><img src="images/carticon_btn.svg" alt="" className="pe-1" />
                                                Add to Cart</button>
                                            )}
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
                                                    <div dangerouslySetInnerHTML={{ __html: productDetails.description }} />
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
                                                        <Link to="#" className="sizeguid">Size Guide</Link>
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
                                                        <div dangerouslySetInnerHTML={{ __html: productDetails.shipping_and_returns }} />
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
                    <Recomendations />
                </section>

                <section>
                    <ProductsMagazine />
                </section>
            </main>

            {/* size guide modal starts here */}
            <Modal show={sizeGuideModal} size="lg">
                <SizeGuide />
            </Modal>
            {/* size guide modal ends here */}
            {/* measuring guide modal starts here */}
            <Modal show={measuringGuideModal} size="lg">
                <MeasuringGuide />
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