import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { formatprice } from '../../../components/utility/allutils';
import IntlMessages from "../../../components/utility/intlMessages";
import { menu } from '../../../redux/pages/allPages';
import { getHomePageProducts } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import notification from "../../../components/notification";
import { addWhishlist, removeWhishlist } from '../../../redux/cart/productApi';


function BestSeller(props) {
    const [token, setToken] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [isWishlist, setIsWishlist] = useState(0);
    const [delWishlist, setDelWishlist] = useState(0);
    const [customerId, setCustomerId] = useState(localStorage.getItem('cust_id'));
    const [bestseller, setBestseller] = useState([]);
    const [catId, setCatId] = useState(52); //set default category here

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        setToken(localToken)
        getData(catId);

        getCategories()
    }, [props.languages]);

    const getData = async (catId) => {
        let result: any = await getHomePageProducts(props.languages, customerId, catId);
        //  console.log(result.data)
        if (result) {
            setBestseller(result.data[0].bestSellers);
        }
    }

    //get categories for the filter dropdown
    const getCategories = async () => {
        let result: any = await menu(props.languages);
        console.log(result);
        let catList = [];
        if (result && result.data[0] && result.data[0].parent.child[0].child) {
            result.data[0].parent.child[0].child.forEach(el => {
                catList.push(el);
            })
        }
        setCategoriesList(catList);
    }

    const changeCategory = (e) => {
        setCatId(e.target.value);
        getData(e.target.value);
    }

    async function handleWhishlist(id: number) {
        let result: any = await addWhishlist(id);
        notification("success", "", result.data[0].message);
        // getProducts()

    }

    async function handleDelWhishlist(id: number) {
        //need to get whishlist id first
        // console.log(id);
        let del: any = await removeWhishlist(id);
        //  console.log(del);
        notification("success", "", del.data[0].message);
        // getProducts()
    }

    return (
        <section className="width-100 my-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="resltspage_sec bestseller-sec">
                            <div className="paginatn_result">
                                <div className="new-in-title">
                                    <h1><IntlMessages id="home.bestseller" /></h1>
                                </div>

                            </div>
                            <div className="sort_by">
                                <div className="sortbyfilter">
                                    <h3><IntlMessages id="home.show" /></h3>
                                    <select className="form-select customfliter" value={catId} aria-label="Default select example" onChange={changeCategory}>
                                        {categoriesList.map((cat, i) => {
                                            return (<option value={cat.id} key={i}>{cat.name} </option>)
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="new-in-slider">
                            <div className="regular slider">
                                <Slider {...settings}>
                                    {bestseller && bestseller.map(item => {
                                        return (
                                            <Link className="productcalr" key={item.id} to={'/product-details/' + item.name}>
                                                <div className="product_img"><img src={item.img} className="image-fluid" height="150" /> </div>
                                                <div className="product_name"> {item.name} </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div>
                                                <div className="product_price"> ${formatprice(item.price)}</div>
                                            </Link>
                                        )
                                    })}
                                </Slider>
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
        items: state.Cart.items,
        languages: state.LanguageSwitcher.language
    }
}

export default connect(
    mapStateToProps
)(BestSeller);