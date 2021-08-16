
const actions = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_ITEM: 'REMOVE_ITEM',
    ADD_QUANTITY: 'ADD_QUANTITY',
    SUB_QUANTITY: 'SUB_QUANTITY',
    addToCart: id => ({
        type: actions.ADD_TO_CART,
        id
    }),
    removeItem: id => ({
        type: actions.REMOVE_ITEM,
        id
    }),
    addQuantity: id => ({
        type: actions.ADD_QUANTITY,
        id
    }),
    subtractQuantity: id => ({
        type: actions.SUB_QUANTITY,
        id
    })
};
export default actions;
