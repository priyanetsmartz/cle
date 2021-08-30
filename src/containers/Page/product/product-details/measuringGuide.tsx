import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import minicart_p1 from "../../../../image/minicart_p1.png";
import cartAction from "../../../../redux/cart/productAction";
const { openMeasuringGuide } = cartAction;


function MeasuringGuide(props) {
    useEffect(() => {
    }, []);

    const measuringGuideHanler = () => {
        const { openMeasuringGuide } = props;
        openMeasuringGuide(false);
    }

    return (
        <div className="container">
            <div className="col-sm-12">
                <div className="CLE_product">
                    <div className="CLE_guide">
                        <div className="productview">
                            <img src={minicart_p1} alt="" className="img-fluid" />
                        </div>
                        <div className="measur_guide">
                            <h1 className="measuring_guide">Measuring Guide</h1>
                            <a onClick={measuringGuideHanler} className="cross_icn"> <i className="fas fa-times"></i></a>
                            <div className="view_size"><a onClick={measuringGuideHanler}>View Size Guide</a></div>
                            <h2>The Attico</h2>
                            <p>Padded-shoulders logo-jacquard satin shirt</p>
                            <p className="mb-0"><span className="chest_meas">Chest:</span> Measured flat across from underarm seam to
                                underarm seam, and then doubled.</p>
                            <p><span className="lenght_meas">Length:</span> Measured from collar seam to the longest part of the hem at
                                center back.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps,{openMeasuringGuide}
)(MeasuringGuide);