import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function MyRewards(props) {
    useEffect(() => {
    }, [])

    return (
        <div className="col-sm-9">
            <h3>My Rewards</h3>
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
)(MyRewards);