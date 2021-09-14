import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function BestSeller(props) {
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
                                        <option value="">All categories </option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
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