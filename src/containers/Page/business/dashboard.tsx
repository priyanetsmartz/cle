import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function Dashboard(props) {
    useEffect(() => {
    }, [])

    return (
        <div className="col-sm-9">
            <section className="my_profile_sect mb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1>Important announcements</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-9">
                            <div id="page-wrapper" className="container">

                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="panel panel-info">
                                            <div className="panel-heading">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <i className="fa fa-users fa-5x"></i>
                                                    </div>
                                                    <div className="col-xs-6 text-right">
                                                        <p className="announcement-heading">1</p>
                                                        <p className="announcement-text">Users</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="panel panel-warning">
                                            <div className="panel-heading">
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <i className="fa fa-check fa-5x"></i>
                                                    </div>
                                                    <div className="col-xs-6 text-right">
                                                        <p className="announcement-heading">12</p>
                                                        <p className="announcement-text">To-Do Items</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(Dashboard);