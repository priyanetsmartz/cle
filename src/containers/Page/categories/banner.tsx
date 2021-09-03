import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function CategoryBanner(props) {
    return (
        <div className="container" style={{ "marginTop": "200px" }}>
            <h3>Banner</h3>
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
)(CategoryBanner);