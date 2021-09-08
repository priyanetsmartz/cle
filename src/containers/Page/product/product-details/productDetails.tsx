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
import { getProductDetails, getProductExtras } from '../../../../redux/cart/productApi';
import { formatprice } from '../../../../components/utility/allutils';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import Magazine from '../../categories/Magazine';
import product from '../product';
function ProductDetails(props) {
    const { sku } = useParams();
    const [shareUrl, setShareUrl] = useState('');
    const [isPriveuser, setIsPriveUser] = useState(false);
    const [isShare, setIsLoaded] = useState(false);
    const [productImages, setProductImages] = useState([]);
    const [productDetails, setproductDetails] = useState({ name: "", price: 0, extension_attributes: { stock_item: { qty: 1, is_in_stock: true } }, description: "", saleprice: 0, short_description: "", shipping_and_returns: "" });
    const [sizeGuideModal, setSizeGuideModal] = useState(false);
    const [measuringGuideModal, setMeasuringGuideModal] = useState(false);
    const [magezineData, setMagezineData] = useState({});
    const [recomendationsData, setRecomendations] = useState({});
    useEffect(() => {
        getProductDetailsFxn();
        setShareUrl(window.location.href);
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [])
    const handleClick = () => {
        setIsLoaded(true);
    }
    const hideModal = () => {
        setIsLoaded(false);
    }
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
        let productExtras: any = await getProductExtras(result.data.id);
        //  console.log(productExtras.data[0].posts)
        setMagezineData(productExtras.data[0].posts)
        setRecomendations(productExtras.data[0].recommendation)
        //   console.log(recomendationsData)
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
                                            <button type="button" className="btn btn-outline-success" onClick={() => {
                                                handleClick();
                                            }} ><img src={ShareIcon} alt=""
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
                    <Recomendations recomendationsData={recomendationsData} />
                </section>

                <section>
                    <ProductsMagazine posts={magezineData} />
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

            <Modal show={isShare} onHide={hideModal}>
                <Modal.Header>
                    <h5 className="modal-title">Share this product</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModal} aria-label="Close"></button></Modal.Header>
                <Modal.Body className="arabic-rtl-direction">
                    <li>
                        <FacebookShareButton
                            url={shareUrl}
                            quote={productDetails.name}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21.42" height="21.419" viewBox="0 0 21.42 21.419">
                                <path id="facebook" d="M18.093,7.758A10.614,10.614,0,0,1,23.5,9.229,10.818,10.818,0,0,1,26.2,25.568a10.912,10.912,0,0,1-6.043,3.609v-7.7h2.1l.475-3.025h-3.18V16.472a1.722,1.722,0,0,1,.366-1.138,1.675,1.675,0,0,1,1.344-.511h1.921v-2.65q-.041-.013-.784-.105a15.591,15.591,0,0,0-1.692-.105,4.228,4.228,0,0,0-3.038,1.083,4.187,4.187,0,0,0-1.141,3.108v2.3H14.11v3.025h2.42v7.7a10.65,10.65,0,0,1-6.549-3.609,10.805,10.805,0,0,1,2.706-16.34,10.617,10.617,0,0,1,5.406-1.471Z" transform="translate(-7.383 -7.758)" fill="#2E2BAA" fillRule="evenodd" />
                            </svg>
                        </FacebookShareButton>
                        <LinkedinShareButton
                            url={shareUrl}
                            title={productDetails.name}>
                            <svg id="_x31_0.Linkedin" xmlns="http://www.w3.org/2000/svg" width="21.472" height="21.472" viewBox="0 0 21.472 21.472">
                                <path id="Path_17" data-name="Path 17" d="M52.176,49.981V42.117c0-3.865-.832-6.817-5.341-6.817a4.66,4.66,0,0,0-4.214,2.308h-.054V35.649H38.3V49.981h4.455V42.869c0-1.879.349-3.677,2.657-3.677,2.281,0,2.308,2.12,2.308,3.784v6.978h4.455Z" transform="translate(-30.704 -28.51)" fill="#2E2BAA" />
                                <path id="Path_18" data-name="Path 18" d="M11.3,36.6h4.455V50.932H11.3Z" transform="translate(-10.951 -29.461)" fill="#2E2BAA" />
                                <path id="Path_19" data-name="Path 19" d="M12.577,10a2.59,2.59,0,1,0,2.577,2.577A2.577,2.577,0,0,0,12.577,10Z" transform="translate(-10 -10)" fill="#2E2BAA" />
                            </svg>
                        </LinkedinShareButton>

                        <TwitterShareButton
                            url={shareUrl}
                            title={productDetails.name}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="85.393" height="22" viewBox="0 0 85.393 22">
                                <g id="Group_727" data-name="Group 727" transform="translate(-785.223 -4492)">
                                    <g id="Group_728" data-name="Group 728">
                                        <text id="Twitter" transform="translate(813.615 4510)" fontSize="18"
                                            fontFamily="Lato-Semibold, Lato" fontWeight="600">
                                            {/* <tspan x="0" y="0">Twitter</tspan> */}
                                        </text>
                                        <path id="twitter-brands"
                                            d="M20.989,52.817c.015.208.015.416.015.623A13.548,13.548,0,0,1,7.362,67.082,13.549,13.549,0,0,1,0,64.93a9.919,9.919,0,0,0,1.158.059A9.6,9.6,0,0,0,7.11,62.94a4.8,4.8,0,0,1-4.483-3.325,6.047,6.047,0,0,0,.905.074,5.071,5.071,0,0,0,1.262-.163A4.8,4.8,0,0,1,.95,54.821v-.059a4.829,4.829,0,0,0,2.167.609,4.8,4.8,0,0,1-1.484-6.412,13.628,13.628,0,0,0,9.886,5.017,5.412,5.412,0,0,1-.119-1.1,4.8,4.8,0,0,1,8.3-3.28,9.439,9.439,0,0,0,3.043-1.158,4.782,4.782,0,0,1-2.108,2.642,9.612,9.612,0,0,0,2.761-.742A10.306,10.306,0,0,1,20.989,52.817Z"
                                            transform="translate(785.223 4445.418)" fill="#2E2BAA" />
                                    </g>
                                </g>
                            </svg>
                        </TwitterShareButton>

                    </li>

                </Modal.Body>
            </Modal>
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