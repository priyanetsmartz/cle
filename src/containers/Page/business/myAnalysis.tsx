import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import IntlMessages from "../../../components/utility/intlMessages";
import './myanalysis.css';

import MyAnalysisDataTiles from './myAnalysis/DataTiles';
import MyAnalysisOrders from './myAnalysis/OrderAnalysis';
import MyAnalysisPayouts from './myAnalysis/PayoutsAnalysis';
import MyAnalysisProducts from './myAnalysis/ProductAnalysis';
import MyAnalysisReturn from './myAnalysis/ReturnAnalysis';
import MyAnalysisCustomer from './myAnalysis/CustomerAnalysis';
import MyProductListing from './myProductListing';
import MyReturnsComplaints from './myReturnsComplaints';
import MySalesOrders from './mySalesOrders';
function MyAnalysis(props) {
//Various pages are called in this analysispage, which are mentioned below:
//     MyAnalysisDataTiles
//  MyAnalysisOrders 
//  MyAnalysisPayouts 
//  MyAnalysisProducts
//  MyAnalysisReturn
//  MyAnalysisCustomer
//  MyProductListing
//  MyReturnsComplaints
//  MySalesOrders
    const [viewState, setViewState] = useState('all');

    useEffect(() => {


        return () => {
        }
    }, [])


    function changeData(e) {
        setViewState(e.target.value);
    }



    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>My Analysis</h1>
                            <p>Welcome to your data & analytics page. Here you will find insights about your brand's activity and performance on CLE's platform</p>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-sm-12">
                            <ul className="analysis-demo">
                                <li>
                                    <input type="radio" id="all" name="radioanalysis" value="all" onClick={changeData} checked={viewState === 'all'} />
                                    <label>All</label>
                                </li>
                                <li>
                                    <input type="radio" id="sales" name="radioanalysis" value="sales" checked={viewState === 'sales'} onClick={changeData} />
                                    <label>Sales</label>
                                </li>
                                <li>
                                    <input type="radio" id="products" checked={viewState === 'products'} name="radioanalysis" value="products" onClick={changeData} />
                                    <label>Products</label>
                                </li>
                                <li>
                                    <input type="radio" id="returns" checked={viewState === 'returns'} name="radioanalysis" value="returns" onClick={changeData} />
                                    <label>Returns</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div >
            </section>
            {(viewState === 'sales' || viewState === 'all') && (
                <>
                    <MyAnalysisDataTiles />
                    <MyAnalysisCustomer />
                    <MyAnalysisOrders />
                    <MyAnalysisPayouts />
                </>
            )}
            {(viewState === 'products' || viewState === 'all') && (
                <>
                    <MyAnalysisProducts />
                </>
            )}
            {(viewState === 'returns' || viewState === 'all') && (
                <>
                    <MyAnalysisReturn />
                </>
            )}

            {(viewState === 'products' || viewState === 'all') && (
                <>
                    <section className="my_profile_sect">
                        <div className="container">
                            <div className="row mb-4">
                                <div className="col-sm-12">
                                    <h2><IntlMessages id="vendor.productListing" /></h2>
                                </div>
                            </div>
                        </div>
                    </section>
                    <MyProductListing pageData={5} />
                </>
            )}

            {(viewState === 'sales' || viewState === 'all') && (
                <>
                    <section className="my_profile_sect">
                        <div className="container">
                            <div className="row mb-4">
                                <div className="col-sm-12">
                                    <h2><IntlMessages id="salesOrder.title" /></h2>
                                </div>
                            </div>
                        </div>
                    </section>
                    <MySalesOrders pageData={5} />
                </>
            )}
            {(viewState === 'returns' || viewState === 'all') && (
                <>
                    <section className="my_profile_sect">
                        <div className="container">
                            <div className="row mb-4">
                                <div className="col-sm-12">
                                    <h2><IntlMessages id="vendor.returnandcomplaints" /></h2>
                                </div>
                            </div>
                        </div>
                    </section>
                    <MyReturnsComplaints pageData={5} />
                </>
            )}
        </div >
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        items: state.Cart.items,
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(MyAnalysis);