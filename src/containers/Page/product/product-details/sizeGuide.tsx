import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import cartAction from "../../../../redux/cart/productAction";
const { openSizeGuide, openMeasuringGuide } = cartAction;

function SizeGuide(props) {
    useEffect(() => {
    }, []);


    const sizeGuideModalHandler = () => {
        const { openSizeGuide } = props;
        openSizeGuide(false);
    }

    const measuringGuideHanler = () => {
        const { openMeasuringGuide } = props;
        openMeasuringGuide(true);
    }

    return (
        <div className="container">
            <div className="col-sm-12">
                <div className="size_details">
                    <div className="size_tbl">
                        <h1>Size Guide</h1>
                        <a className="cross_icn" onClick={sizeGuideModalHandler}> <i className="fas fa-times"></i></a>
                        <div className="view_measuring">
                            <a onClick={measuringGuideHanler}>View Measuring Guide </a>
                        </div>
                        <table>

                            <thead>
                                <tr>
                                    <td></td>
                                    <th scope="col">XS</th>
                                    <th scope="col">S</th>
                                    <th scope="col">M</th>
                                    <th scope="col">L</th>
                                    <th scope="col">XL</th>
                                    <th scope="col">XXL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">US/UX Chest</th>
                                    <td>190</td>
                                    <td>160</td>
                                    <td>40</td>
                                    <td>120</td>
                                    <td>30</td>
                                    <td>70</td>
                                </tr>
                                <tr>
                                    <th scope="row">US/UK Waist</th>
                                    <td>3</td>
                                    <td>40</td>
                                    <td>30</td>
                                    <td>45</td>
                                    <td>35</td>
                                    <td>49</td>
                                </tr>
                                <tr>
                                    <th scope="row">Europe</th>
                                    <td>10</td>
                                    <td>180</td>
                                    <td>10</td>
                                    <td>85</td>
                                    <td>25</td>
                                    <td>79</td>
                                </tr>
                                <tr>
                                    <th scope="row">Asian</th>
                                    <td>40</td>
                                    <td>80</td>
                                    <td>90</td>
                                    <td>25</td>
                                    <td>15</td>
                                    <td>119</td>
                                </tr>
                            </tbody>
                        </table>
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
    mapStateToProps,{ openSizeGuide, openMeasuringGuide }
)(SizeGuide);