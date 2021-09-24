import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import cartAction from "../../../redux/cart/productAction";
import { formatprice } from '../../../components/utility/allutils';
import {
    addWhishlist, getProductByCategory, getWhishlistItemsForUser, removeWhishlist, addToCartApi,
    getProductFilter, getGuestCart, addToCartApiGuest, createGuestToken
} from '../../../redux/cart/productApi';
import { getCategoryDetails } from '../../../redux/pages/customers';
import { Pages1 } from '../../../redux/pages/allPages';
import notification from "../../../components/notification";
import { getCookie } from '../../../helpers/session';
import IntlMessages from "../../../components/utility/intlMessages";
const { addToCart, productList } = cartAction;

function PromotedProducts(props) {
    let imageD = '';
    const [pageSize, setPageSize] = useState(12);
    const [pagination, setPagination] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [page, setCurrent] = useState(1);
    const [token, setToken] = useState('');
    const [sortValue, setSortValue] = useState({ sortBy: 'created_at', sortByValue: "DESC" });
    const [sort, setSort] = useState(0);
    const language = getCookie('currentLanguage');
    const baseUrl = process.env.REACT_APP_API_URL;
    const [catId, setCatId] = useState(153)// for promoted products
    const [category, setCategory] = useState({
        name:'',
        custom_attributes: [],
        custom:{
            image:'',
            desc:''
        }
    })
    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getProducts();
        getCategoryData();

        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [sortValue, page, pageSize])

    

    const getCategoryData = async () => {
        let result: any = await getCategoryDetails(props.languages, catId);
       
        if (result) {
            let obj:any = {};
            result.data.custom_attributes.forEach(el => {
                if(el.attribute_code == "image") {
                    obj.image = baseUrl+el.value;
                }else if(el.attribute_code == "description"){
                    obj.desc = el.value;
                } 
                result.data.custom = obj;
            });
            setCategory(result.data);
        }
    }

    async function getProducts() {
        setOpacity(0.3);
        let customer_id = localStorage.getItem('cust_id');
        let result: any = await getProductByCategory(page, pageSize, catId, sortValue.sortBy, sortValue.sortByValue);
        //  console.log(Math.ceil(result.data.total_count / 9))
        setPagination(Math.ceil(result.data.total_count / pageSize));
        let productResult = result.data.items;
        if (customer_id) {
            let whishlist: any = await getWhishlistItemsForUser();
            let products = result.data.items;
            let WhishlistData = whishlist.data;
            const mergeById = (a1, a2) =>
                a1.map(itm => ({
                    ...a2.find((item) => (parseInt(item.id) === itm.id) && item),
                    ...itm
                }));

            productResult = mergeById(products, WhishlistData);

        }
        setOpacity(1);
        //console.log(productResult)
        props.productList(productResult);
        // get product page filter
        //let result1: any = await getProductFilter(9);
        // console.log(result1)

    }
    const filtterData = (event) => {
        let lang = props.languages ? props.languages : language;
        let sortBy = "created_at";
        let sortByValue = "desc";
        if (event.target.value === "1") {
            sortBy = "price";
            sortByValue = "desc";
        } else if (event.target.value === "2") {
            sortBy = "price";
            sortByValue = "asc";
        }

        setSort(event.target.value);
        setSortValue({ sortBy: sortBy, sortByValue: sortByValue })

    }
    async function handleCart(id: number, sku: string) {
        let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
        let customer_id = localStorage.getItem('cust_id');

        let cartQuoteId = ''
        if (cartQuoteIdLocal) {
            cartQuoteId = cartQuoteIdLocal
        } else {
            // create customer token
            let guestToken: any = await createGuestToken();
            localStorage.setItem('cartQuoteToken', guestToken.data);
            let result: any = await getGuestCart();
            cartQuoteId = result.data.id
            console.log(result.data)
        }
        localStorage.setItem('cartQuoteId', cartQuoteId);
        // only simple product is added to cart because in design there are no option to show configuration product
        let cartData = {
            "cartItem": {
                "quote_id": localStorage.getItem('cartQuoteId'),
                "sku": sku,
                "qty": 1
            }
        }
        if (customer_id) {
            addToCartApi(cartData)
        } else {
            addToCartApiGuest(cartData)
        }

        // props.addToCart(id);
        props.addToCartTask(true);
        notification("success", "", "Item added to cart");
    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        getProducts()

    }
    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        getProducts()
    }
    const handlePageSize = (page) => {
        setPageSize(page)
    }
    const getPaginationGroup = () => {
        let start = Math.floor((page - 1) / 4) * 4;
        let fill = pagination > 5 ? 4 : pagination;
        return new Array(fill).fill(fill).map((_, idx) => start + idx + 1);
    };
    return (
        <section className="new-in-brand-sec">
            <div className="container">
                <div className="col-sm-12">
                    <div className="magazine_article ">
                        <h1 className="mb-4">{category.name}</h1>
                        {/* <p className="new-in-brand-desc">They love to study fashion trends, sketch designs, select materials,
                            and have a part in all the production aspects of their designs.</p> */}
                        <div dangerouslySetInnerHTML={{ __html: category.custom.desc }} />
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
                                    {props.items.slice(0, 2).map(item => {
                                        return (
                                            <div className="col-md-3" key={item.id}>
                                                <Link to={'/product-details/' + item.sku}>
                                                    <div className="product py-4">
                                                        {token && (
                                                            <span className="off bg-favorite">
                                                                {!item.wishlist_item_id && (
                                                                    <i onClick={() => { handleWhishlist(item.id) }} className="far fa-heart" aria-hidden="true"></i>
                                                                )}
                                                                {item.wishlist_item_id && (
                                                                    <i className="fa fa-heart" onClick={() => { handleDelWhishlist(parseInt(item.wishlist_item_id)) }} aria-hidden="true"></i>
                                                                )}
                                                            </span>
                                                        )
                                                        }

                                                        <div className="text-center">
                                                            {
                                                                item.custom_attributes.map((attributes) => {
                                                                    if (attributes.attribute_code === 'image') {
                                                                        imageD = attributes.value;
                                                                    }
                                                                })
                                                            }
                                                            <img src={imageD} alt={item.name} width="200" />
                                                        </div>
                                                        <div className="about text-center">
                                                            <h5>{item.name}</h5>
                                                            <div className="tagname">{item.desc}</div>
                                                            <div className="pricetag">${formatprice(item.price)}</div>
                                                        </div>
                                                        {/* {token && ( */}
                                                        <div className="cart-button mt-3 px-2"> <button onClick={() => { handleCart(item.id, item.sku) }} className="btn btn-primary text-uppercase">Add to cart</button>
                                                            <div className="add"> <span className="product_fav"><i className="fa fa-heart-o"></i></span> <span className="product_fav"><i className="fa fa-opencart"></i></span> </div>
                                                        </div>
                                                        {/* )} */}
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    })}
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
    mapStateToProps,
    { addToCart, productList }
)(PromotedProducts);