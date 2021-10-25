import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function MyNotifications(props) {
    useEffect(() => {
    }, [])

    return (
        <div className="col-sm-9">
            <h3>My Notifications</h3>
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
)(MyNotifications);