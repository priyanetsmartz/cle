import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import cartAction from "../../../../redux/cart/productAction";
import IntlMessages from "../../../../components/utility/intlMessages";
const { openSizeGuide, openMeasuringGuide } = cartAction;

function SizeGuide(props) {
    useEffect(() => {
      //  console.log(props.sizeDetails)
    }, []);


    const sizeGuideModalHandler = () => {
        const { openSizeGuide } = props;
        openSizeGuide(false);
    }

    const measuringGuideHanler = () => {
        const { openMeasuringGuide } = props;
        props.openSizeGuide(false);
        openMeasuringGuide(true);
    }

    return (
        <div className="container">
            <div className="col-sm-12">
                <div className="size_details">
                    <div className="size_tbl">
                        <h1>Size Guide</h1>
                        <Link className="cross_icn" to="#" onClick={sizeGuideModalHandler}> <i className="fas fa-times"></i></Link>
                        <div className="view_measuring">
                            <Link to="#" onClick={measuringGuideHanler}><IntlMessages id="product.measuringGuide" /> </Link>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: props.sizeDetails }} />
                    </div>

                </div>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {

    }
}

export default connect(
    mapStateToProps, { openSizeGuide, openMeasuringGuide }
)(SizeGuide);