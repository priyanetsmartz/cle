import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import SizeGuide from './sizeGuide';
import cartAction from "../../../../redux/cart/productAction";
import MeasuringGuide from './measuringGuide';
import Recomendations from './recomendations';
import ProductsMagazine from './magazine';
import { useParams } from "react-router-dom";
import ProductImages from './productImges';
import ShareIcon from '../../../../image/share-alt-solidicon.svg';
import cleWork from '../../../../image/cle work-logo.svg';
import IntlMessages from "../../../../components/utility/intlMessages";
import { addToCartApi, addToCartApiGuest, addWhishlist, createGuestToken, getGuestCart, getProductDetails, getProductExtras, getWhishlistItemsForUser, removeWhishlist } from '../../../../redux/cart/productApi';
import { formatprice } from '../../../../components/utility/allutils';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import notification from '../../../../components/notification';
import GiftMessage from './GiftMessage';
const { addToCart, addToCartTask, openGiftBoxes, addToWishlistTask } = cartAction;

function ProductDetails(props) {
    const { sku } = useParams();
    const [opacity, setOpacity] = useState(1);
    const [isShow, setIsShow] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    const [iteminWhishlist, setItemInWhishlist] = useState(0);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [prodId, setProdId] = useState(0);
    const [token, setToken] = useState('');
    const [isPriveuser, setIsPriveUser] = useState(false);
    const [isShare, setIsLoaded] = useState(false);
    const [isGiftMessage, setIsGiftMessage] = useState(false);
    const [productImages, setProductImages] = useState([]);
    const [productDetails, setproductDetails] = useState({});
    const [sizeGuideModal, setSizeGuideModal] = useState(false);
    const [measuringGuideModal, setMeasuringGuideModal] = useState(false);
    const [magezineData, setMagezineData] = useState({});
    const [recomendationsData, setRecomendations] = useState({});
    const [configurableOptions, setConfigurableOptions] = useState([]);
    const [productSizeDetails, setProductSizeDetails] = useState({});
    const [tagsState, setTagsState] = useState([]);
    const [slectedAttribute, setSlectedAttribute] = useState({
        options: {}
    });
    const [extensionAttributes, setExtensionAttributes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProductDetailsFxn(sku);
        setShareUrl(window.location.href);
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [sku])
    useEffect(() => {
        //  console.log(props.items.Cart);
        let giftBox = props.items.Cart.openGiftBox === 0 ? false : true;
        setIsGiftMessage(giftBox)
        setSizeGuideModal(props.items.Cart.isOpenSizeGuide);
        setMeasuringGuideModal(props.items.Cart.isOpenMeasuringGuide);
    }, [props.items.Cart]);

    //     useEffect(() => {
    //    //     console.log(props);
    //     }, [props]);
    const handleClick = () => {
        setIsLoaded(true);
    }


    const hideGiftModalModal = () => {
        setIsGiftMessage(false)
    }
    const hideModal = () => {
        setIsLoaded(false);
    }
    const handleChange = (event) => {
        let option = {};
        var index = event.target.selectedIndex;
        let optionElement = event.target.childNodes[index]
        let optionVal = optionElement.getAttribute('data-attribute');

        option['option_id'] = optionVal;
        option['option_value'] = event.target.value;
        setSlectedAttribute({ options: option });
    }


    const sizeGuideModalHandler = () => {
        setSizeGuideModal(!sizeGuideModal);
    }
    async function getProductDetailsFxn(skuUrl) {
        setOpacity(0.3)
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductDetails(skuUrl);


        let projectSingle = {};
        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            // let products = result.data.items;
            let WhishlistData = whishlist.data;

            const inWhishlist = WhishlistData.find(element => element.sku === skuUrl);
            if (inWhishlist) {
                setItemInWhishlist(inWhishlist.wishlist_item_id)
            }
            let productExtras: any = await getProductExtras(result.data.id);
            setMagezineData(productExtras.data[0].posts)
            setRecomendations(productExtras.data[0].recommendation)
            //   console.log(productExtras.data)
        }

        let description = "", special_price: 0, short, shipping_and_returns: "", tags = [];

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
            if (attributes.attribute_code === "popular" && attributes.value === "1") {
                tags.push("Popular");
            }
            if (attributes.attribute_code === "new_designer" && attributes.value === "1") {
                tags.push("New Designers");
            }
            if (attributes.attribute_code === "sale" && attributes.value === "1") {
                tags.push("Sale");
            }

        })

        // console.log(tags);
        // console.log(result.data.extension_attributes)
        projectSingle['id'] = result.data.id;
        projectSingle['type_id'] = result.data.type_id;
        projectSingle['sku'] = result.data.sku;
        projectSingle['name'] = result.data.name;
        projectSingle['price'] = result.data.price;
        projectSingle['description'] = description;
        projectSingle['saleprice'] = special_price;
        projectSingle['short_description'] = short;
        projectSingle['shipping_and_returns'] = shipping_and_returns;
        projectSingle['is_in_stock'] = result.data.extension_attributes.stock_item.is_in_stock;
        setOpacity(1)
        setProdId(projectSingle['id']);
        setTagsState(tags)
        setProductImages(result.data.media_gallery_entries)
        setConfigurableOptions(result.data.extension_attributes.configurable_product_options);
        setExtensionAttributes(result.data.extension_attributes.stock_item.qty);
        setproductDetails(projectSingle);
        setProductSizeDetails(result.data.extension_attributes.mp_sizechart.rule_content);
    }

    const handleGiftMEssage = () => {
        props.openGiftBoxes(productDetails);
        setIsGiftMessage(true)
    }

    async function handleCart(id: number, sku: string) {
        setIsShow(true);
        let cartData = {};
        let cartSucces: any;
        let cartQuoteId = '';
        let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
        if (cartQuoteIdLocal) {
            cartQuoteId = cartQuoteIdLocal
        } else {
            // create customer token
            let guestToken: any = await createGuestToken();
            localStorage.setItem('cartQuoteToken', guestToken.data);
            let result: any = await getGuestCart();
            cartQuoteId = result.data.id
            //  console.log(result.data)
        }
        localStorage.setItem('cartQuoteId', cartQuoteId);
        // console.log(slectedAttribute.options)
        if (productDetails['type_id'] === 'configurable') {
            if (!slectedAttribute.options["option_id"]) {
                setIsShow(false);
                notification("error", "", "Please select Size");
                return false;
            }
            cartData = {
                "cart_item": {
                    "quote_id": cartQuoteId,
                    "product_type": "configurable",
                    "sku": productDetails['sku'],
                    "qty": quantity,
                    "product_option": {
                        "extension_attributes": {
                            "configurable_item_options": [
                                {
                                    "option_id": slectedAttribute.options["option_id"],
                                    "option_value": slectedAttribute.options["option_value"]
                                }
                            ]
                        }
                    }
                }
            }
        } else {
            cartData = {
                "cartItem": {
                    "sku": productDetails['sku'],
                    "qty": quantity,
                    "quote_id": cartQuoteId
                }
            }
        }

        let customer_id = localStorage.getItem('cust_id');
        if (customer_id) {
            cartSucces = await addToCartApi(cartData)
        } else {
            cartSucces = await addToCartApiGuest(cartData)
        }
        if (cartSucces.data.item_id) {
            props.addToCartTask(true);
            notification("success", "", "Item added to cart!");
            setIsShow(false);
        } else {
            notification("error", "", "Something went wrong!");
            setIsShow(false);
        }
    }

    const handleQuantity = (event) => {
        setQuantity(event.target.value)
    }

    async function handleWhishlist(id: number) {
        if (token) {
            setIsWishlist(id)
            let result: any = await addWhishlist(id);
            //     console.log(result);
            if (result.data) {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("success", "", 'Your product has been successfully added to your wishlist');
                getProductDetailsFxn(sku)
            } else {
                setIsWishlist(0)
                props.addToWishlistTask(true);
                notification("error", "", "Something went wrong!");
                getProductDetailsFxn(sku)
            }
        } else {
            props.showSignin(true);
        }
    }
    async function handleDelWhishlist(id: any) {
        setDelWishlist(id)
        //console.log(delWishlist, iteminWhishlist)
        let del: any = await removeWhishlist(id);
        // console.log(del)
        if (del.data[0].message) {
            setDelWishlist(0)
            setItemInWhishlist(0)
            props.addToWishlistTask(true);
            notification("success", "", del.data[0].message);
            getProductDetailsFxn(sku)
        } else {
            setDelWishlist(0)
            props.addToWishlistTask(true);
            notification("error", "", "Something went wrong!");
            getProductDetailsFxn(sku)
        }
    }
    return (
        <>
            <main>
                {/* <Promotion /> */}
                <section style={{ 'opacity': opacity }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="product-slider">
                                    <span className="pdp-favorite">
                                        {iteminWhishlist === 0 ? (
                                            <div>{isWishlist === prodId ? <i className="fas fa-circle-notch fa-spin"></i> : <i onClick={() => { handleWhishlist(prodId) }} className="far fa-heart" aria-hidden="true"></i>}
                                            </div>
                                        ) : <div>{delWishlist === iteminWhishlist ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fa fa-heart" onClick={() => { handleDelWhishlist(iteminWhishlist) }} aria-hidden="true"></i>}
                                        </div>}
                                    </span>
                                    <ProductImages productImages={productImages} />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="product_description">
                                    <div className="list_accordon">
                                        {tagsState.length > 0 && (
                                            <ul>
                                                {tagsState.map((tag, i) => {
                                                    return (<li key={i}><Link to="#" className="active">{tag}</Link></li>)
                                                })}

                                            </ul>
                                        )
                                        }
                                        {isPriveuser && <div className="logo_stampg">
                                            <Link to="#"><img src={cleWork} alt="" className="img-fluid" /></Link>
                                        </div>}
                                    </div>
                                    <div className="product_details">
                                        <h1>{productDetails['name']}</h1>
                                        <h2><div dangerouslySetInnerHTML={{ __html: productDetails['short_description'] }} /></h2>
                                    </div>
                                    <div className="product-sale_off mt-4 mb-4">
                                        <div className="product_saleoff">{productDetails['saleprice'] > 0 ? <><span className="saleoff">${formatprice(productDetails['price'])}</span> now 25% off</> : <span>${formatprice(productDetails['price'])}</span>}</div>
                                        {productDetails['saleprice'] > 0 ? <div className="product_price">${formatprice(productDetails['saleprice'])}</div> : ""}
                                    </div>
                                    <div className="selection-process mb-2">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <span className="form-label"><IntlMessages id="product.quantity" />:</span>
                                                    {(extensionAttributes) ? (
                                                        <select className="form-select" onChange={handleQuantity} aria-label="Default select example">
                                                            {Array.from(Array(extensionAttributes).slice(0, 10), (e, i) => {
                                                                return <option key={i + 1}>{i + 1}</option>
                                                            })}

                                                        </select>
                                                    ) : ""}
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    {(configurableOptions && configurableOptions.length) ? (
                                                        <div>
                                                            {
                                                                configurableOptions.map((data, i) => {
                                                                    return (
                                                                        <div key={i}>
                                                                            <span className="form-label">{data.label} </span>
                                                                            {(data && data.values) && (
                                                                                <select className="form-select" onChange={handleChange} aria-label="productattribute">
                                                                                    <option>----</option>
                                                                                    {
                                                                                        data.values.map((val, i) => {
                                                                                            return <option key={i} data-attribute={data.attribute_id} value={val.value_index} >{val.value_index}</option>
                                                                                        })}

                                                                                </select>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    ) : ""}
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <Link className="" to="#" onClick={sizeGuideModalHandler}> <IntlMessages id="product.sizeguide" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="width-100 my-3">
                                        <div className="d-grid">
                                            {productDetails['is_in_stock'] === true && (
                                                <>  <button type="button" style={{ "display": !isShow ? "inline-block" : "none" }} onClick={() => { handleCart(productDetails['id'], productDetails['sku']) }} className="btn btn-primary"><img src="images/carticon_btn.svg" alt="" className="pe-1" />
                                                    <IntlMessages id="product.addToCart" /></button>
                                                    <button style={{ "display": isShow ? "inline-block" : "none" }} className="btn btn-primary"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row my-3">
                                        <div className="d-grid gap-2 d-md-flex justify-content-start">
                                            <button type="button" className="btn btn-outline-primary me-4" onClick={() => {
                                                handleGiftMEssage();
                                            }} > <IntlMessages id="product.sendAGift" /></button>
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
                                                    <IntlMessages id="product.description" />
                                                </button>
                                            </h2>
                                            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                                                data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div dangerouslySetInnerHTML={{ __html: productDetails['description'] }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingTwo">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                    <IntlMessages id="product.details" />
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
                                                    <IntlMessages id="product.size" />
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
                                                        <Link to="#" className="sizeguid"> <IntlMessages id="product.sizeguide" /></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="flush-headingFourth">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                    data-bs-target="#flush-collapseFourth" aria-expanded="false" aria-controls="flush-collapseThree">
                                                    <IntlMessages id="product.shipingAndReturn" />
                                                </button>
                                            </h2>
                                            <div id="flush-collapseFourth" className="accordion-collapse collapse"
                                                aria-labelledby="flush-headingFourth" data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div className="express_rate">
                                                        <div dangerouslySetInnerHTML={{ __html: productDetails['shipping_and_returns'] }} />
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

                {/* <section> */}
                <Recomendations recomendationsData={recomendationsData} />
                {/* </section> */}

                <section>
                    <ProductsMagazine posts={magezineData} />
                </section>
            </main>

            {/* size guide modal starts here */}
            <Modal show={sizeGuideModal} size="lg" >
                <SizeGuide sizeDetails={productSizeDetails} />
            </Modal>
            {/* size guide modal ends here */}
            {/* measuring guide modal starts here */}
            <Modal show={measuringGuideModal} size="lg">
                <MeasuringGuide />
            </Modal>
            <Modal show={isGiftMessage} size="lg" data={productDetails} >
                <Modal.Header>
                    <h5 className="modal-title"><IntlMessages id="gift.title" /></h5>
                    <div><IntlMessages id="gift.subTitle" /> </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideGiftModalModal} aria-label="Close"></button>
                </Modal.Header>
                <GiftMessage />
            </Modal>
            <Modal show={isShare} onHide={hideModal}>
                <Modal.Header>
                    <h5 className="modal-title"><IntlMessages id="products.shareProduct" /></h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideModal} aria-label="Close"></button></Modal.Header>
                <Modal.Body className="arabic-rtl-direction">
                    <li>
                        <FacebookShareButton
                            url={shareUrl}
                            quote={productDetails['name']}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21.42" height="21.419" viewBox="0 0 21.42 21.419">
                                <path id="facebook" d="M18.093,7.758A10.614,10.614,0,0,1,23.5,9.229,10.818,10.818,0,0,1,26.2,25.568a10.912,10.912,0,0,1-6.043,3.609v-7.7h2.1l.475-3.025h-3.18V16.472a1.722,1.722,0,0,1,.366-1.138,1.675,1.675,0,0,1,1.344-.511h1.921v-2.65q-.041-.013-.784-.105a15.591,15.591,0,0,0-1.692-.105,4.228,4.228,0,0,0-3.038,1.083,4.187,4.187,0,0,0-1.141,3.108v2.3H14.11v3.025h2.42v7.7a10.65,10.65,0,0,1-6.549-3.609,10.805,10.805,0,0,1,2.706-16.34,10.617,10.617,0,0,1,5.406-1.471Z" transform="translate(-7.383 -7.758)" fill="#2E2BAA" fillRule="evenodd" />
                            </svg>
                        </FacebookShareButton>
                        <LinkedinShareButton
                            url={shareUrl}
                            title={productDetails['name']}>
                            <svg id="_x31_0.Linkedin" xmlns="http://www.w3.org/2000/svg" width="21.472" height="21.472" viewBox="0 0 21.472 21.472">
                                <path id="Path_17" data-name="Path 17" d="M52.176,49.981V42.117c0-3.865-.832-6.817-5.341-6.817a4.66,4.66,0,0,0-4.214,2.308h-.054V35.649H38.3V49.981h4.455V42.869c0-1.879.349-3.677,2.657-3.677,2.281,0,2.308,2.12,2.308,3.784v6.978h4.455Z" transform="translate(-30.704 -28.51)" fill="#2E2BAA" />
                                <path id="Path_18" data-name="Path 18" d="M11.3,36.6h4.455V50.932H11.3Z" transform="translate(-10.951 -29.461)" fill="#2E2BAA" />
                                <path id="Path_19" data-name="Path 19" d="M12.577,10a2.59,2.59,0,1,0,2.577,2.577A2.577,2.577,0,0,0,12.577,10Z" transform="translate(-10 -10)" fill="#2E2BAA" />
                            </svg>
                        </LinkedinShareButton>

                        <TwitterShareButton
                            url={shareUrl}
                            title={productDetails['name']}>
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
    //  console.log(state)
    return {
        items: state
    }
}

export default connect(
    mapStateToProps,
    { addToCart, addToCartTask, openGiftBoxes, addToWishlistTask }
)(ProductDetails);