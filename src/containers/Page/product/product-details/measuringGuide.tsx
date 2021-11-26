import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import minicart_p1 from "../../../../image/minicart_p1.png";
import cartAction from "../../../../redux/cart/productAction";
import IntlMessages from "../../../../components/utility/intlMessages";
const { openMeasuringGuide, openSizeGuide } = cartAction;


function MeasuringGuide(props) {
    useEffect(() => {
    }, []);

    const measuringGuideHanler = () => {
        const { openMeasuringGuide, openSizeGuide } = props;
        openMeasuringGuide(false);
        openSizeGuide(false);
    }
    const sizeGuideModalHandler = () => {
        props.openMeasuringGuide(false);
        props.openSizeGuide(true);
    }

    return (
        <div className="container">
            <div className="col-sm-12">
                <div className="CLE_product">
                    <div className="CLE_guide">
                        {/* <div className="productview">
                            <img src={minicart_p1} alt="" className="img-fluid" />
                        </div> */}
                        <div className="measur_guide">
                            <h1 className="measuring_guide">Measuring Guide</h1>
                            <Link to="#" onClick={measuringGuideHanler} className="cross_icn"> <i className="fas fa-times"></i></Link>
                            <div className="view_size"><Link to="#" onClick={sizeGuideModalHandler}><IntlMessages id="product.sizeguide" /></Link></div>
                            <div dangerouslySetInnerHTML={{ __html: props.measuringDetailsg }} />
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
    mapStateToProps,{openMeasuringGuide, openSizeGuide}
)(MeasuringGuide);