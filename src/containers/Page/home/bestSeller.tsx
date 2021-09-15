import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";


function BestSeller(props) {
    const [categoriesList, setCategoriesList] = useState(['All Categories', 'Watches', 'Jewelry', 'Bags', 'Accessories', 'Clothes', 'Lingerie', 'Shoes', 'Sport']);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    useEffect(() => {
    }, [])

    return (
        <section className="width-100 my-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div className="resltspage_sec bestseller-sec">
                            <div className="paginatn_result">
                                <div className="new-in-title">
                                    <h1>Bestsellers</h1>
                                </div>

                            </div>
                            <div className="sort_by">
                                <div className="sortbyfilter">
                                    <h3>Show</h3>
                                    <select className="form-select customfliter" aria-label="Default select example">
                                        {categoriesList.map((cat, i) => {
                                            return (<option value={cat} key={i}>{cat} </option>)
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
                                    {props && props.bestSellers.map(item => {
                                        return (
                                            <div className="productcalr" key={item.id}>
                                                <div className="product_img"><img src={item.img} className="image-fluid" /> </div>
                                                <div className="product_name"> {item.name} </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }}></div>
                                                <div className="product_price"> {item.price}</div>
                                            </div>
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
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(BestSeller);