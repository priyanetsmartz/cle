import AdminApi from "../../restApi/AdminApi";
const APi = new AdminApi();


export function getProductByCategory(page,pageSize,category, sortBy, sortByValue) {
    category = 2;
    return APi.request(`rest/all/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${category}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[currentPage]=${page}&searchCriteria[sortOrders][0][direction]=${sortByValue}`, "", "GET", "");
}

export function addWhishlist(id: number) {
    const localToken = localStorage.getItem('cust_id');
    return APi.request(`rest/V1/wishlist/add/${id}?customerId=${localToken}`, "", "POST", "")
}

export function removeWhishlist(wishlist_item_id: number) {
    const localToken = localStorage.getItem('cust_id');
    return APi.request(`rest/V1/wishlist/delete/${wishlist_item_id}?customerId=${localToken}`, "", "DELETE", "")
}

export function getWhishlistItems() {
    const localToken = localStorage.getItem('cust_id');
    return APi.request(`rest/V1/wishlist/items?customerId=${localToken}`, "", "GET", "");
}

export function getWhishlistItemsForUser() {
    const localToken = localStorage.getItem('cust_id');
    return APi.request(`rest/all/V1/customer/wishlistItems?customerId=${localToken}`, "", "GET", "")
}

export function addToCartApi(cartData) {
    return APi.request(`rest/V1/carts/mine/items`, cartData, "POST", "")
}

export function getCartItems() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}`, "", "GET", "")
}

export function getCartTotal() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/totals`, "", "GET", "")
}
export function removeItemFromCart(id: number) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/items/${id}`, "", "DELETE", "")
}

export function updateCartItem(id, cartData) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/items/${id}`, cartData, "PUT", "")
}

export function getNewInCategories(sortOrder, pageSize) {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=9&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=${sortOrder}`, "", "GET", "");
}

export function getCategoryPage(catId) {
    return APi.request(`rest/V1/categories/${catId}?storeId=2`, "", "GET", "");
}

export function getCategoryDetails() {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=9&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=10&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC`, "", "GET", "");
}

export function getPriveUserProducts() {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=9&searchCriteria[filter_groups][0][filters][0][field]=prive&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=7&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC`, "", "GET", "");
}

export function  getProductFilter(category_id:number) {
    
    let payload = {
        query: `{
            products(
            filter: { category_id: { eq: "9" } }, pageSize: 10
            ) {
            aggregations{
            attribute_code
            count
            label
            options{
            count
            label
            value
            }
            }
            total_count
            page_info {
            page_size
            current_page
            }
            items {
            id
            name
            sku
            short_description {
            html
            }
            image {
            url
            }
            price_range {
            minimum_price {
            regular_price {
            value
            currency
            }
            final_price {
            value
            currency
            }
            fixed_product_taxes {
            label
            amount {
            value
            currency
            }
            }
            }
            maximum_price {
            discount {
            amount_off
            percent_off
            }
            fixed_product_taxes {
            label
            amount {
            value
            currency
            }
            }
            }
            }
            }
            }
           }
   `,
    }
    return APi.request(
        "graphql",
        payload,
        "POST",
        ""
    );
}