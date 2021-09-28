import actions from './productAction';
const data = localStorage.getItem('cartItems')
const initState = {
    items: data ? JSON.parse(data) : [],
    addedItems: [],
    total: 0,
    addToCartTask: false,
    openGiftBox: 0,
    addToWishlistTask: false,
    openAccountPop: false,
    openMiniCartPop: false
}

const cartReducer = (state = initState, action) => {
    switch (action.type) {
        case actions.PRODUCT_LIST:
            return { ...state, items: action.payload };
        case actions.OPEN_SIZE_GUIDE:
            return { ...state, isOpenSizeGuide: action.isOpen };
        case actions.OPEN_MEASURING_GUIDE:
            return { ...state, isOpenMeasuringGuide: action.isOpen };
        case actions.ADD_TO_CART_TASK:
            return { ...state, addToCartTask: action.addToCartTask };
        case actions.OPEN_GIFT_BOX:
            return { ...state, openGiftBox: action.isOpen };
        case actions.ADD_TO_WISHLIST_TASK:
            return { ...state, addToWishlistTask: action.addToWishlistTask };
        case actions.ACCOUNT_SECTION:
            return { ...state, openAccountPop: action.isShow };
        case actions.MINICART_SECTION:
            return { ...state, openMiniCartPop: action.isShow };

        default:
            return state;
    }
}

export default cartReducer