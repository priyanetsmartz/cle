// import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
// import { getHomePageProducts } from '../../../redux/pages/customers';


function PriveExclusive(props) {

    // const [products, setProducts] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        // let result: any = await getPriveExclusiveProducts();
        // if (result) {
        //     setProducts(result.data[0]);
        // }
    }


    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title">Privé Exclusives</h2>
                        <div id="carouselExampleInterval" className="carousel slide DC-carousel" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="row">
                                        <div className="col-md-6 product-dummy"><img src="images/v9lcsqfb.png" alt="" /></div>
                                        <div className="col-md-6">
                                            <div className="product-details-new">
                                                <img src="images/elvibswh.png" alt="" />
                                                <h4>Product Name</h4>
                                                <p></p>
                                                <div className="pro-price-btn">$3,288<Link to="#">Add to Cart</Link></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="row">
                                        <div className="col-md-6 product-dummy"><img src="images/v9lcsqfb.png" alt="" /></div>
                                        <div className="col-md-6">
                                            <div className="product-details-new">
                                                <img src="images/elvibswh.png" alt="" />
                                                <h4>Product Name</h4>
                                                <p></p>
                                                <div className="pro-price-btn">$3,288<Link to="#">Add to Cart</Link></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="row">
                                        <div className="col-md-6 product-dummy"><img src="images/v9lcsqfb.png" alt="" /></div>
                                        <div className="col-md-6">
                                            <div className="product-details-new">
                                                <img src="images/elvibswh.png" alt="" />
                                                <h4>Product Name</h4>
                                                <p></p>
                                                <div className="pro-price-btn">$3,288<Link to="#">Add to Cart</Link></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(PriveExclusive);