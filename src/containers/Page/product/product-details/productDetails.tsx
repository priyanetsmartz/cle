import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from "react-bootstrap/Modal";
import SizeGuide from './sizeGuide';
import cartAction from "../../../../redux/cart/productAction";
import MeasuringGuide from './measuringGuide';
import Recomendations from './recomendations';
import { getCookie } from "../../../../helpers/session";
import ProductsMagazine from './magazine';
import { Link, useParams } from "react-router-dom";
import ProductImages from './productImges';
import cleWork from '../../../../image/cle work-logo.svg';
import IntlMessages from "../../../../components/utility/intlMessages";
import { addToCartApi, addToCartApiGuest, addWhishlist, configLabels, createGuestToken, getGuestCart, getProductChildren, getProductDetails, getProductExtras, getWhishlistItemsForUser, removeWhishlist } from '../../../../redux/cart/productApi';
import { checkVendorLoginWishlist, formatprice } from '../../../../components/utility/allutils';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import notification from '../../../../components/notification';
import { siteConfig } from '../../../../settings';
import GiftMessage from './GiftMessage';
import Login from '../../../../redux/auth/Login';
import appAction from "../../../../redux/app/actions";
import { useIntl } from 'react-intl';
import { useLastLocation } from 'react-router-last-location';
const loginApi = new Login();
const { showSignin, showLoader } = appAction;
const { addToCart, addToCartTask, openGiftBoxes, addToWishlistTask, recomendedProducts, getAttributeProducts, openSizeGuide } = cartAction;
function ProductDetails(props) {
    const { sku }: any = useParams();
    const intl = useIntl();
    const language = getCookie('currentLanguage');
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
    const [recomendationsData, setRecomendations] = useState([]);
    const [configurableOptions, setConfigurableOptions] = useState([]);
    const [childrenProducts, seChildrenProducts] = useState([]);
    const [productSizeDetails, setProductSizeDetails] = useState({});
    const [measuringDetails, setMeasuringDetails] = useState({});
    const [tagsState, setTagsState] = useState([]);
    const [slectedAttribute, setSlectedAttribute] = useState(0);
    const [extensionAttributes, setExtensionAttributes] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [locationBread, setLocationBread] = useState([]);
    const lastLocation = useLastLocation();

    useEffect(() => {

        let path = lastLocation?.pathname;
        const location_array = path?.split('/');

        if (!location_array?.includes('search')) {
            setLocationBread(location_array)
        } else {
            setLocationBread(undefined)
        }


        setTimeout(() => {
            window.scrollTo(0, 0)
            props.showLoader(false);
        }, 3000);
        const localToken = props.token.token;
        setToken(localToken)
        getProductDetailsFxn(sku);
        setShareUrl(window.location.href);
        return () => {
            props.openGiftBoxes(0);
        }
    }, [sku, props.languages])
    useEffect(() => {
        let giftBox = props.items.Cart.openGiftBox === 0 ? false : true;
        setIsGiftMessage(giftBox)
        setSizeGuideModal(props.items.Cart.isOpenSizeGuide);
        setMeasuringGuideModal(props.items.Cart.isOpenMeasuringGuide);
    }, [props.items.Cart]);

    useEffect(() => {
        if (props.attributeConfig && props.attributeConfig.length > 0) {
            attributeSection(props.attributeConfig);
        }

    }, [props.attributeConfig]);

    const handleClick = () => {
        setIsLoaded(!isShare);
    }


    const hideGiftModalModal = () => {
        props.openGiftBoxes(0);
        setIsGiftMessage(false)
    }

    const handleChange = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index]
        const option = el.getAttribute('id');
        let selected = e.target.value;
        setSlectedAttribute(selected);
        let selectChild = childrenProducts[option - 1];
        let projectSingle = {};
        let description = "", special_price: 0, short, shipping_and_returns: "", tags = [], img = "";


        selectChild.custom_attributes.map((attributes) => {
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
            if (attributes.attribute_code === "image") {
                img = attributes.value;
            }


        })

        projectSingle['id'] = selectChild.id;
        projectSingle['type_id'] = selectChild.type_id;
        projectSingle['sku'] = selectChild.sku;
        projectSingle['name'] = selectChild.name;
        projectSingle['price'] = selectChild.price ? selectChild.price : 0;
        projectSingle['description'] = description;
        projectSingle['saleprice'] = special_price ? special_price : 0;
        projectSingle['short_description'] = short;
        projectSingle['shipping_and_returns'] = shipping_and_returns;
        projectSingle['is_in_stock'] = productDetails['is_in_stock']
        projectSingle['img'] = img;
        setproductDetails(projectSingle);

    }

    const sizeGuideModalHandler = () => {
        props.openSizeGuide(true);
    }

    async function attributeSection(attrs) {

        const attributesDrop = [];
        attrs.forEach(async (i) => {
            attributesDrop.push(new Promise((resolve, reject) => {
                const res: any = someAPICall(i);
                resolve(res);
            }));
        })
        const result = await Promise.all(attributesDrop);
        setConfigurableOptions(result)
    }


    async function someAPICall(attribute) {
        let data: any = []
        let labels: any = await configLabels(attribute.attribute_id);
        data.title = attribute.label;
        data.attribute_id = attribute.attribute_id;
        data.labels = labels = labels.data;
        return data;
    }

    async function getProductDetailsFxn(skuUrl) {
        setOpacity(0.3)
        let lang = props.languages ? props.languages : language;
        let customer_id = props.token.cust_id;
        let result: any = await getProductDetails(skuUrl, lang);

        let projectSingle = {};
        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            let WhishlistData = whishlist.data;

            const inWhishlist = WhishlistData.find(element => element.sku === skuUrl);
            if (inWhishlist) {
                setItemInWhishlist(inWhishlist.wishlist_item_id)
            }
            let productExtras: any;
            if (result && result.data) {
                productExtras = await getProductExtras(result.data.id, lang);
            }

            let posts = productExtras && productExtras.data[0] && productExtras.data[0].posts ? productExtras.data[0].posts : [];
            let recomendations = productExtras && productExtras.data[0] && productExtras.data[0].recommendation ? productExtras.data[0].recommendation : []
            setMagezineData(posts)
            setRecomendations(recomendations)

        }

        if (result?.data?.type_id === "configurable") {
            let attributes = result.data.extension_attributes.configurable_product_options;
            let childProducts: any = await getProductChildren(skuUrl);
            props.getAttributeProducts(attributes)
            seChildrenProducts(childProducts.data);
        }
        let description = "", img = "", special_price: 0, short, brand, watch_color, gift, shipping_and_returns: "", tags = [];
        if (result?.data?.custom_attributes) {
            result.data.custom_attributes.map((attributes) => {
                if (attributes.attribute_code === "description") {
                    description = attributes.value;
                }
                if (attributes.attribute_code === "special_price") {
                    special_price = attributes.value;
                }
                if (attributes.attribute_code === "brand") {
                    brand = attributes.value;
                }
                if (attributes.attribute_code === "watch_color") {
                    watch_color = attributes.value;
                }
                if (attributes.attribute_code === "gift_message_available") {
                    gift = attributes.value;
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
                if (attributes.attribute_code === "image") {
                    img = attributes.value;
                }


            })
        }
        projectSingle['id'] = result.data.id;
        projectSingle['type_id'] = result.data.type_id;
        projectSingle['sku'] = result.data.sku;
        projectSingle['name'] = result.data.name;
        projectSingle['brand'] = brand;
        projectSingle['price'] = result.data.price ? result.data.price : 0;
        projectSingle['description'] = description;
        projectSingle['saleprice'] = special_price ? special_price : 0;
        projectSingle['watch_color'] = watch_color;
        projectSingle['gift'] = gift;
        projectSingle['short_description'] = short;
        projectSingle['img'] = img;
        projectSingle['shipping_and_returns'] = shipping_and_returns;
        projectSingle['is_in_stock'] = result?.data && result.data.extension_attributes && result.data.extension_attributes.stock_item ? result.data.extension_attributes.stock_item.is_in_stock : "";
        let jsonBread = result?.data?.extension_attributes?.category_path ? JSON.parse(result?.data?.extension_attributes?.category_path) : [];
        projectSingle['breadcrumbsArray'] = jsonBread;
        setOpacity(1)
        setProdId(projectSingle['id']);
        setTagsState(tags)

        setProductImages(result?.data?.media_gallery_entries?.length > 0 ? result?.data?.media_gallery_entries : projectSingle['img'])

        let qtyy = result?.data && result.data.extension_attributes ? result.data.extension_attributes.stock_item.qty : 0
        setExtensionAttributes(qtyy);
        setproductDetails(projectSingle);


        if (result?.data && result.data.extension_attributes && result.data.extension_attributes.mp_sizechart && result.data.extension_attributes.mp_sizechart.rule_content) {
            setProductSizeDetails(result.data.extension_attributes.mp_sizechart.rule_content);
        }
        if (result?.data && result.data.extension_attributes && result.data.extension_attributes.mp_sizechart && result.data.extension_attributes.mp_sizechart.rule_description) {
            setMeasuringDetails(result.data.extension_attributes.mp_sizechart.rule_description);
        }
    }

    const handleGiftMEssage = () => {
        if (productDetails['type_id'] === 'configurable') {
            if (slectedAttribute === 0) {
                setIsShow(false);
                notification("error", "", intl.formatMessage({ id: "selectproductsize" }));
                return false;
            }
        } else {
            props.openGiftBoxes(productDetails);
            setIsGiftMessage(true)
        }

    }

    async function handleCart(id: number, sku: string) {
        let vendorCheck = await checkVendorLoginWishlist();
        if (vendorCheck?.type === 'vendor') {
            notification("error", "", "You are  not allowed to purchase a product, kindly login as a valid customer!");
            return false;
        }
        setIsShow(true);
        let cartData = {};
        let cartSucces: any;
        let cartQuoteId = '';
        let customer_id = props.token.cust_id;
        let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
        if (cartQuoteIdLocal && customer_id) {
            let customerCart: any = await loginApi.genCartQuoteID(customer_id)
            cartQuoteId = cartQuoteIdLocal
            if (customerCart?.data !== parseInt(cartQuoteIdLocal)) {
                cartQuoteId = customerCart?.data;
            }
        } else {
            if (!cartQuoteIdLocal) {
                let guestToken: any = await createGuestToken();
                localStorage.setItem('cartQuoteToken', guestToken.data);
                let result: any = await getGuestCart(props.languages);
                cartQuoteId = result?.data?.id
            } else {
                let result: any = await getGuestCart(props.languages);
                cartQuoteId = result?.data?.id
            }

        }
        localStorage.setItem('cartQuoteId', cartQuoteId);
        cartData = {
            "cartItem": {
                "sku": sku,
                "qty": quantity,
                "quote_id": cartQuoteId
            }
        }


        if (customer_id) {
            cartSucces = await addToCartApi(cartData)
        } else {
            cartSucces = await addToCartApiGuest(cartData)
        }
        if (cartSucces.data.item_id) {
            props.addToCartTask(true);
            notification("success", "", intl.formatMessage({ id: "addedtocart" }));
            setIsShow(false);
        } else {
            if (cartSucces.data.message) {
                notification("error", "", cartSucces.data.message);
            } else {
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
            }
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
            if (result?.data) {
                props.addToWishlistTask(true);
                setIsWishlist(0)
                notification("success", "", intl.formatMessage({ id: "addedToWhishlist" }));
                getProductDetailsFxn(sku)
            } else {
                props.addToWishlistTask(true);
                setIsWishlist(0)
                notification("error", "", intl.formatMessage({ id: "genralerror" }));
                getProductDetailsFxn(sku)
            }
        } else {
            let vendorCheck = await checkVendorLoginWishlist();
            if (vendorCheck?.type === 'vendor') {
                notification("error", "", "You are  not allowed to add products to wishlist, kindly login as a valid customer!");
                return false;
            }
            props.showSignin(true);
        }
    }
    async function handleDelWhishlist(id: any) {
        setDelWishlist(id)
        let del: any = await removeWhishlist(id);
        if (del.data[0].message) {
            props.addToWishlistTask(true);
            setDelWishlist(0)
            setItemInWhishlist(0)
            notification("success", "", del.data[0].message);
            getProductDetailsFxn(sku)
        } else {
            props.addToWishlistTask(true);
            setDelWishlist(0)
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
            getProductDetailsFxn(sku)
        }
    }
    const getAnimalsContent = catsName => {
        let content = [];
       
        for (let i = 0; i <= catsName?.length; i++) {
            if (i === 0)
                content.push(<li className="breadcrumb-item" key={i}>{catsName[0]?.url_key ? <Link to={"/category/" + catsName[0].url_key}>{catsName[0].name}</Link> : catsName[0].name}</li>)
            if (i === 1)
                content.push(<li className="breadcrumb-item" key={i}>{catsName[1]?.url_key ? <Link to={"/products/" + catsName[0].url_key + "/" + catsName[1].url_key}>{catsName[1].name}</Link> : catsName[1].name}</li>)
            if (i === 2)
                content.push(<li className="breadcrumb-item" key={i}>{catsName[2]?.url_key ? <Link to={"/products/" + catsName[0].url_key + "/" + catsName[1].url_key + "/" + catsName[2].url_key}>{catsName[2].name}</Link> : catsName[2].name}</li>)
            if (i === 3)
                content.push(<li className="breadcrumb-item" key={i}>{catsName[3]?.url_key ? <Link to={"/products/" + catsName[0].url_key + "/" + catsName[1].url_key + "/" + catsName[2].url_key + "/" + catsName[3].url_key}>{catsName[3].name}</Link> : catsName[3].name}</li>)

        }
        return content;
    };
    return (
        <>
            <main>
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <ol className="breadcrumb">

                                    {productDetails?.['breadcrumbsArray']?.length > 0 && (
                                        <>
                                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                            {getAnimalsContent(productDetails?.['breadcrumbsArray'])}
                                            <li className="breadcrumb-item">{productDetails?.['name']}</li>
                                        </>

                                    )}
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section style={{ 'opacity': opacity }} >
                    <div className="container" id="productID" >
                        <div className="row">
                            <div className="col-sm-6">
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
                            <div className="col-sm-6">
                                <div className="product_description">
                                    <div className="list_accordon">

                                        {isPriveuser && <div className="logo_stampg">
                                            <Link to="#"><img src={cleWork} alt="" className="img-fluid" /></Link>
                                        </div>}
                                    </div>
                                    <div className="product_details">
                                        <h1><Link to={'/search/' + productDetails['brand']}>{productDetails['brand']}</Link></h1>
                                        <h2>{productDetails['name']}</h2>
                                    </div>
                                    <div className="product-sale_off mt-4 mb-4">
                                        <div className="product_saleoff">{productDetails['saleprice'] > 0 ? <><span className="saleoff">{siteConfig.currency} {formatprice(productDetails['price'])} </span> now 25% off</> : <span> {siteConfig.currency}{productDetails['price'] > 0 ? formatprice(productDetails['price']) : 0}</span>}</div>
                                        {productDetails['saleprice'] > 0 ? <div className="product_price">{siteConfig.currency} {formatprice(productDetails['saleprice'])}</div> : ""}
                                    </div>
                                    <div className="selection-process mb-2">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <div className="form-group">
                                                    <span className="form-label"><IntlMessages id="product.quantity" />:</span>
                                                    <select className="form-select" onChange={handleQuantity} aria-label="Default select example">
                                                        {

                                                            Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, 10), (e, i) => {
                                                                return <option key={i + 1}>{i + 1}</option>
                                                            })
                                                        }
                                                        { }


                                                    </select>
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
                                                                            <span className="form-label">{data.title} </span>
                                                                            <select className="form-select" onChange={handleChange} aria-label="productattribute">
                                                                                {(data && data.labels) && (
                                                                                    data.labels.map((label, i) => {
                                                                                        return (
                                                                                            <option key={i} data-order={data.attribute_id} id={i} value={label.value}>{label.label}</option>
                                                                                        )

                                                                                    })

                                                                                )}
                                                                            </select>
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
                                                <>  <button type="button" style={{ "display": !isShow ? "flex" : "none" }} onClick={() => { handleCart(productDetails['id'], productDetails['sku']) }} className="btn btn-primary"><img src="images/carticon_btn.svg" alt="" className="pe-1" />
                                                    <IntlMessages id="product.addToCart" /></button>
                                                    <button style={{ "display": isShow ? "inline-block" : "none" }} className="btn btn-primary"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>  <IntlMessages id="loading" /></button>
                                                </>
                                            )}
                                            {productDetails['is_in_stock'] === false && (
                                                <button type="button" className="btn btn-primary"><img src="images/carticon_btn.svg" alt="" className="pe-1" />
                                                    <IntlMessages id="product.outofstock" /></button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="my-3">
                                        <div className="gap-2 justify-content-start">
                                            {productDetails['gift'] === '1' && (
                                                <button type="button" className="send-a-gift-btn" onClick={() => {
                                                    handleGiftMEssage();
                                                }} > <IntlMessages id="product.sendAGift" /></button>
                                            )}
                                            <div className="pdp-share share-btn">
                                                <div className="share-toggle" onClick={() => {
                                                    handleClick();
                                                }}   ><Link to="#"><i className="fas fa-share-alt"></i></Link></div>
                                                {isShare && (<div className="share-options">
                                                    <ul className="list-inline">
                                                        <li className="list-inline-item"> <FacebookShareButton
                                                            url={shareUrl}
                                                            quote={productDetails['name']}>
                                                            <i className="fab fa-facebook" aria-hidden="true"></i>
                                                        </FacebookShareButton></li>
                                                        <li className="list-inline-item"><LinkedinShareButton
                                                            url={shareUrl}
                                                            title={productDetails['name']}>
                                                            <i className="fab fa-linkedin" aria-hidden="true"></i>
                                                        </LinkedinShareButton></li>
                                                        <li className="list-inline-item"><TwitterShareButton
                                                            url={shareUrl}
                                                            title={productDetails['name']}>
                                                            <i className='fab fa-twitter'></i>
                                                        </TwitterShareButton></li>
                                                    </ul>
                                                </div>
                                                )}
                                            </div>

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
                                                            <li>     <IntlMessages id="Colour" />: {productDetails['watch_color']}</li>
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
                <Recomendations recomend={recomendationsData} />
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
                <MeasuringGuide measuringDetailsg={measuringDetails} />
            </Modal>
            <Modal show={isGiftMessage} size="lg" className="giftmessagebox" data={productDetails} onHide={hideGiftModalModal} data-backdrop="static" data-keyboard="false">
                <Modal.Header>
                    <h5 className="modal-title"><IntlMessages id="gift.title" /></h5>
                    <p className="gifting-subtitle"><IntlMessages id="gift.subTitle" /> </p>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={hideGiftModalModal} aria-label="Close"></button>
                </Modal.Header>
                <GiftMessage />
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    let attributeConfig = [], languages = '';
    if (state.Cart && state.Cart.attribute_section) {
        attributeConfig = state.Cart.attribute_section;
    }
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        items: state,
        languages: languages,
        attributeConfig: attributeConfig,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { addToCart, openSizeGuide, addToCartTask, openGiftBoxes, addToWishlistTask, recomendedProducts, getAttributeProducts, showSignin, showLoader }
)(ProductDetails);