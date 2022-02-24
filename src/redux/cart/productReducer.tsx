import actions from './productAction';
const data = localStorage.getItem('cartItems')
const initState = {
    items: data ? JSON.parse(data) : [],
    addedItems: [],
    total: 0,
    addToCartTask: false,
    openGiftBox: 0,
    addToWishlist: false,
    openAccountPop: false,
    openMiniCartPop: false,
    isPrepOpen: false,
    paymentMethods: [],
    ship: {},
    billing: {},
    recomended: [],
    checkout_sidebar: {
        checkData: {}, items: {}, address: {}, shippingAddress: 0, shippingData: {}
    },
    prods: false,
    filters: { sortBy: 'price', sortByValue: "DESC" },
    pageeSize: 12,
    catIdd: 0,
    catname: 'women',
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
        case actions.ADD_TO_WISHLIST_TASK_NEw:
            return { ...state, addToWishlist: action.isShow };
        case actions.ACCOUNT_SECTION:
            return { ...state, openAccountPop: action.isShow };
        case actions.MINICART_SECTION:
            return { ...state, openMiniCartPop: action.isShow };
        case actions.PAYMENT_METHODS:
            return { ...state, paymentMethods: action.payload };
        case actions.SHIPPING_ADDRESS:
            return { ...state, ship: action.payload };
        case actions.BILLING_ADDRESS:
            return { ...state, billing: action.payload };
        case actions.RECOMENDED_PRODUCTS:
            return { ...state, recomended: action.payload };
        case actions.GET_ATTRIBUTES_PRODUCTS:
            return { ...state, attribute_section: action.payload };
        case actions.CHECKOUT_SIDEBAR:
            return { ...state, checkout_sidebar: action.payload };
        case actions.GET_CATEGORY_DATA:
            return { ...state, category_data: action.payload };
        case actions.SET_LOADER_PRODUCTS:
            return { ...state, prods: action.loading };
        case actions.SET_SORTING_PRODUCTS:
            return { ...state, filters: action.payload };
        case actions.SET_PAGESIZE:
            return { ...state, pageeSize: action.payload };
        case actions.SET_CATAEARCH:
            return { ...state, catIdd: action.catId };
        case actions.SET_CATANAME:
            return { ...state, catname: action.catname };
        case actions.OPEN_PREP_BOX:
            return { ...state, isPrepOpen: action.isPrepOpen };
        default:
            return state;
    }
}

export default cartReducer