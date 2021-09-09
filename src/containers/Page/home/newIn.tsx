import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function NewIn(props) {
    useEffect(() => {
    }, [])

    return (
        <section className="width-100 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="new-in-title">
                                <h1>New in</h1>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="new-in-slider">
                                <div className="regular slider">
                                    {props && props.newInProducts.map(item => {
                                        return (
                                            <div className="productcalr" key={item.id}>
                                                <div className="product_img">
                                                    <img src={item.img} className="image-fluid" />
                                                </div>
                                                <div className="product_name"> {item.name} </div>
                                                <div className="product_vrity" dangerouslySetInnerHTML={{ __html: item.short_description }} />
                                                {/* <div className="product_vrity">{item.short_description}</div> */}
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
)(NewIn);