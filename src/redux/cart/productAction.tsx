
const actions = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_ITEM: 'REMOVE_ITEM',
    ADD_QUANTITY: 'ADD_QUANTITY',
    SUB_QUANTITY: 'SUB_QUANTITY',
    PRODUCT_LIST: 'PRODUCT_LIST',
    OPEN_SIZE_GUIDE:'OPEN_SIZE_GUIDE',
    OPEN_MEASURING_GUIDE:'OPEN_MEASURING_GUIDE',
    addToCart: (id: number) => ({
        type: actions.ADD_TO_CART,
        id
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
        isOpen:isOpen
    }),
    openMeasuringGuide: isOpen => ({
        type: actions.OPEN_MEASURING_GUIDE,
        isOpen:isOpen
    })
};
export default actions;
