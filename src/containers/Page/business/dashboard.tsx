import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';


import Modal from "react-bootstrap/Modal";

import { Link } from "react-router-dom";
import HtmlContent from '../../partials/htmlContent';

function Dashboard(props) {
    const [myDashboardModal, setMyDashboardModal] = useState(true);
    useEffect(() => {
    }, [])

    const openDashboardModal = () => {
        setMyDashboardModal(!myDashboardModal);
    }

    return (
        <Modal show={myDashboardModal} >
                <div className="CLE_pf_details">
                    <Modal.Header>
                        <h1>Dashboard Details</h1>
                        <Link to="#" onClick={openDashboardModal} className="cross_icn"> <i className="fas fa-times"></i></Link>
                    </Modal.Header>
                    <Modal.Body className="arabic-rtl-direction">
                    <div className="section" >
                <HtmlContent identifier="login_popup" />
            </div>
                    </Modal.Body>
                    

                </div>
            </Modal>
       
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