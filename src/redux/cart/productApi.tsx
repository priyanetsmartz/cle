import AdminApi from "../../restApi/AdminApi";
import CustomerApi from "../../restApi/Api";
const APi = new AdminApi();
const CUSTOMER = new CustomerApi();

export function getAllProducts(language, page, pageSize, sortBy, sortByValue) {
    const localToken = localStorage.getItem('token');
    var storeId = language === 'english' ? 3 : 2;
    let priveQuery = localToken && parseInt(localToken) === 4 ? '' : `searchCriteria[filter_groups][1][filters][0][field]=prive&searchCriteria[filter_groups][1][filters][0][value]=0&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&`;
    return APi.request(`rest/all/V1/products/?${priveQuery}searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[currentPage]=${page}&searchCriteria[sortOrders][0][direction]=${sortByValue}&storeId=${storeId}`, "", "GET", "");
}

export function getProductByCategory(page, pageSize, category, sortBy, sortByValue) {
    category = 52;
    return APi.request(`rest/all/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=category_id&searchCriteria[filter_groups][1][filters][0][value]=${category}&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[currentPage]=${page}&searchCriteria[sortOrders][0][direction]=${sortByValue}`, "", "GET", "");
}

export function addWhishlist(id: number) {
    const localToken = localStorage.getItem('cust_id');
    return APi.request(`rest/V1/wishlist/add/${id}?customerId=${localToken}`, "", "POST", "")
}
export function addWhishlistBySku(sku: String) {
    const localToken = localStorage.getItem('cust_id')
    return APi.request(`rest/V1/wishlist/addBySku/${sku}?customerId=${localToken}`, "", "POST", "");
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

export function updateCartItem(id: number, cartData: object) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/items/${id}`, cartData, "PUT", "")
}

export function getNewInCategories(sortOrder, pageSize, catId) {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${catId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=${sortOrder}`, "", "GET", "");
}

export function getCategoryPage(catId) {
    return APi.request(`rest/V1/categories/${catId}?storeId=2`, "", "GET", "");
}

export function getCategoryDetails() {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=9&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=visibility&searchCriteria[filter_groups][1][filters][0][value]=4&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=10&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC`, "", "GET", "");
}

export function getPriveUserProducts() {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=9&searchCriteria[filter_groups][0][filters][0][field]=prive&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=visibility&searchCriteria[filter_groups][1][filters][0][value]=4&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=7&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC`, "", "GET", "");
}

export function getPriveExclusiveProducts(category) {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${category}&searchCriteria[filter_groups][0][filters][0][field]=prive&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=visibility&searchCriteria[filter_groups][1][filters][0][value]=4&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=7&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC`, "", "GET", "");
}

export function getProductFilter(category_id: number) {

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
        "en/graphql",
        payload,
        "POST",
        ""
    );
}

export function getProductDetails(sku: string) {
    return APi.request(`rest/V1/products/${sku}`, "", "GET", "");
}

export function getProductExtras(productId: number) {
    const localToken = localStorage.getItem('cust_id');
    return APi.request(`rest/all/V1/product/recommendation?storeId=3&customerId=${localToken}&productId=${productId}`, "", "GET", "");
}

export function addToCartApiGuest(cartData) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/items`, cartData, "POST", "")

}
export function createGuestToken() {
    return APi.request(`rest/V1/guest-carts`, "", "POST", "")
}
export function getGuestCart() {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/all/V1/guest-carts/${cartQuoteToken}`, "", "GET", "")
}
export function getGuestCartTotal() {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/all/V1/guest-carts/${cartQuoteToken}/totals`, "", "GET", "")
}
export function removeItemFromGuestCart(id: number) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/items/${id}`, "", "DELETE", "")
}

export function updateGuestCartItem(id, cartData) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/items/${id}`, cartData, "PUT", "")
}

export function assignGuestCartToUSer(language) {
    const localToken = localStorage.getItem('cust_id');
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    var storeId = language === 'arabic' ? 2 : 3;
    let cartData = {
        "customerId": localToken,
        "storeId": storeId
    }
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}`, cartData, "PUT", "")
}
// gift cart apis
export function giftCart(giftData: any, itemId: number) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/gift-message/${itemId}`, giftData, "POST", "")
}

export function giftGuestCart(giftData: any, itemId: number) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/gift-message/${itemId}`, giftData, "POST", "")
}

export function getCheckOutTotals() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`/rest/V1/carts/${cartQuoteId}/totals`, "", "GET", "")
}

export function getCartRelevantProducts(productIds: number, language: string) {
    var storeId = language === 'arabic' ? 2 : 3;
    const customerId = localStorage.getItem('cust_id');
    return APi.request(`/rest/V1/product/relevantProducts?customerId=${customerId}&storeId=${storeId}&productIds=${productIds}`, "", "GET", "")
}


export function getGuestShippingMethods() {
    // const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`/rest/V1/guest-carts/:cartId/shipping-methods`, "", "GET", "")
}


export function applyPromoCode(couponCode, language) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    const lang = language === 'arabic' ? 'ar' : 'en';
    return APi.request(`rest/${lang}/V1/carts/${cartQuoteId}/coupons/${couponCode}`, "", "PUT", "")
}

export function applyPromoCodeGuest(couponCode, language) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    const lang = language === 'arabic' ? 'ar' : 'en';
    return APi.request(`rest/${lang}/V1/guest-carts/${cartQuoteId}/coupons/${couponCode}`, "", "PUT", "")
}


export function searchFields(search: string, page: number, language: string, sortBy, sortByValue) {
    var storeId = language === 'arabic' ? 2 : 3;
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=name&searchCriteria[filter_groups][1][filters][0][value]=%${search}%&searchCriteria[filter_groups][1][filters][0][condition_type]=like&searchCriteria[filter_groups][1][filters][1][field]=short_description&searchCriteria[filter_groups][1][filters][1][value]=%${search}%&searchCriteria[filter_groups][1][filters][1][condition_type]=like&fields=items[sku,name,id,custom_attributes,custom_attributes,price]&searchCriteria[pageSize]=${page}&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[currentPage]=1&searchCriteria[sortOrders][0][direction]=${sortByValue}&storeId=${storeId}`, "", "GET", "")
}

export function setDefaultShippingAddress(addressId) {
    const customerId = localStorage.getItem('cust_id');
    let cartData = {
        "customerId": customerId,
        "addressId": addressId
    }
    return APi.request(`rest/V1/customer/setDefaultShippingAddress`, cartData, "PUT", "")
}

export function setDefaultBillngAddress(addressId) {
    const customerId = localStorage.getItem('cust_id');
    let cartData = {
        "customerId": customerId,
        "addressId": addressId
    }
    return APi.request(`rest/V1/customer/setDefaulBillingAddress`, cartData, "PUT", "")
}

export function getPaymentMethods() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/payment-methods`, "", "GET", "")
}

export function getShippinMethods() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    // const cartQuoteId = 35;
    return APi.request(`rest/V1/carts/${cartQuoteId}/shipping-methods`, "", "GET", "");
}

export function setGuestUserDeliveryAddress(data) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/shipping-information`, data, "POST", "");
}

export function setUserDeliveryAddress(data) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/shipping-information`, data, "POST", "");
}

export function placeGuestOrder() {
    let data = {
        "paymentMethod": {
            "method": "checkmo"
        }
    }
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/order`, data, "PUT", "");
}


export function placeUserOrder() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    let data = {
        "paymentMethod": {
            "method": "checkmo"
        }
    }
    return APi.request(`rest/V1/carts/${cartQuoteId}/order`, data, "PUT", "");
}

export function getAddressById(addId: number) {
    return APi.request(`rest/V1/customers/addresses/${addId}`, "", "GET", "");
}

export function getGiftMessage(itemId: number) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`/rest/V1/carts/${cartQuoteId}/gift-message/{itemId}`, "", "GET", "")
}

export function getGuestGiftMessage(itemId: number) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`/rest/V1/guest-carts/${cartQuoteToken}/gift-message/${itemId}`, "", "GET", "")
}