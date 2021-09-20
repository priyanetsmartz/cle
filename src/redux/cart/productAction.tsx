
const actions = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_ITEM: 'REMOVE_ITEM',
    ADD_QUANTITY: 'ADD_QUANTITY',
    SUB_QUANTITY: 'SUB_QUANTITY',
    PRODUCT_LIST: 'PRODUCT_LIST',
    OPEN_SIZE_GUIDE: 'OPEN_SIZE_GUIDE',
    OPEN_MEASURING_GUIDE: 'OPEN_MEASURING_GUIDE',
    ADD_TO_CART_TASK: 'ADD_TO_CART_TASK',
    OPEN_GIFT_BOX: 'OPEN_GIFT_BOX',
    ADD_TO_WISHLIST_TASK: 'ADD_TO_WISHLIST_TASK',
    addToCart: (id: number) => ({
        type: actions.ADD_TO_CART,
        id
    }),
    addToCartTask: addToCartTask => ({
        type: actions.ADD_TO_CART_TASK,
        addToCartTask
    }),
    addToWishlistTask: addToWishlistTask => ({
        type: actions.ADD_TO_WISHLIST_TASK,
        addToWishlistTask
    }),
    removeItem: (id: number) => ({
        type: actions.REMOVE_ITEM,
        id
    }),
    addQuantity: (id: number) => ({
        type: actions.ADD_QUANTITY,
        id
    }),
    subtractQuantity: (id: number) => ({
        type: actions.SUB_QUANTITY,
        id
    }),
    productList: payload => ({
        type: actions.PRODUCT_LIST,
        payload
    }),
    openSizeGuide: isOpen => ({
        type: actions.OPEN_SIZE_GUIDE,
        isOpen: isOpen
    }),
    openMeasuringGuide: isOpen => ({
        type: actions.OPEN_MEASURING_GUIDE,
        isOpen: isOpen
    }),
    openGiftBoxes: isOpen => ({
        type: actions.OPEN_GIFT_BOX,
        isOpen: isOpen
    })

};
export default actions;
