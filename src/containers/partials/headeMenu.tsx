import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function HeaderMenu(props) {
    useEffect(() => {
    }, [])

    return (
        <>
        
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(HeaderMenu);