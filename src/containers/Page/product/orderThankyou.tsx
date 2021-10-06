import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

function OrderThankyou(props) {
    return (
        <main>
            <div>
                Thank you order has been placed!
            </div>
        </main>
    )
}


const mapStateToProps = (state) => {

    return {

    }
}
export default connect(
    mapStateToProps,
    {}
)(OrderThankyou);