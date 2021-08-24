import actions from './productAction';
const data = localStorage.getItem('cartItems')
const initState = {
    items: data ? JSON.parse(data) : [],
    addedItems: [],
    total: 0

}

const cartReducer = (state = initState, action) => {

    if (action.type === actions.PRODUCT_LIST) {
        return {
            ...state,
            items: action.payload
        }
    }
    if (action.type === actions.ADD_TO_CART) {
        let addedItem = state.items.find(item => item.id === action.id)
        //check if the action id exists in the addedItems
        let existed_item = state.addedItems.find(item => action.id === item.id)
        let total = localStorage.getItem('cartTotal') ? localStorage.getItem('cartTotal') : '';
        let newCart = state.addedItems;
        if (existed_item) {
            addedItem.quantity += 1;
            total = state.total + addedItem.price;
            // return {
            //     ...state,
            //     total: state.total + addedItem.price
            // }

        }
        else {
            addedItem.quantity = 1;
            //calculating the total
            total = state.total + addedItem.price;
            newCart = [...state.addedItems, addedItem];

            //   
            // return {
            //     ...state,
            //     addedItems: [...state.addedItems, addedItem],
            //     total: newTotal
            // }

        }
        //console.log('data');
        localStorage.setItem('cartItems', JSON.stringify(newCart));
        localStorage.setItem('cartTotal', JSON.stringify(total));
        return {
            ...state,
            addedItems: newCart,
            total: total
        }

    }
    if (action.type === actions.REMOVE_ITEM) {
        let itemToRemove = state.addedItems.find(item => action.id === item.id)
        let new_items = state.addedItems.filter(item => action.id !== item.id)
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity)
        return {
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if (action.type === actions.ADD_QUANTITY) {
        let addedItem = state.items.find(item => item.id === action.id)
        addedItem.quantity += 1
        let newTotal = state.total + addedItem.price
        return {
            ...state,
            total: newTotal
        }
    }

    if (action.type === actions.SUB_QUANTITY) {
        let addedItem = state.items.find(item => item.id === action.id)
        //if the qt == 0 then it should be removed
        if (addedItem.quantity === 1) {
            let new_items = state.addedItems.filter(item => item.id !== action.id)
            let newTotal = state.total - addedItem.price;
            return {
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        } else {
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return {
                ...state,
                total: newTotal
            }
        }

    }
    return state
}

export default cartReducer