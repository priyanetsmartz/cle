import AdminApi from "../../restApi/AdminApi";
import Api from "../../restApi/Api";
import { sessionService } from 'redux-react-session';
const APi = new AdminApi();
const customerApi = new Api();


export async function getAllProducts(language, page, pageSize, sortBy, sortByValue) {
    let localToken = await sessionService.loadSession().then(session => { return session }).catch(err => console.log(''))
    var storeId = language === 'english' ? 'en' : 'ar';
    let priveQuery = localToken && parseInt(localToken) === 4 ? '' : `searchCriteria[filter_groups][1][filters][0][field]=prive&searchCriteria[filter_groups][1][filters][0][value]=0&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&`;
    return APi.request(`rest/${storeId}/V1/products/?${priveQuery}searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[currentPage]=${page}&searchCriteria[sortOrders][0][direction]=${sortByValue}`, "", "GET", "");
}

export function getProductByCategory(page, pageSize, category, sortBy, sortByValue, language) {
    var storeId = language === 'english' ? 'en' : 'ar'
    return APi.request(`rest/${storeId}/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=category_id&searchCriteria[filter_groups][1][filters][0][value]=${category}&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&searchCriteria[filter_groups][2][filters][0][field]=status&searchCriteria[filter_groups][2][filters][0][value]=1&searchCriteria[filter_groups][2][filters][0][condition_type]=eq&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[sortOrders][0][direction]=${sortByValue}&searchCriteria[currentPage]=${page}&searchCriteria[pageSize]=${pageSize}`, "", "GET", "");
}

export async function addWhishlist(id: number) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    return APi.request(`rest/V1/wishlist/add/${id}?customerId=${localToken}`, "", "POST", "")
}
export async function addWhishlistBySku(sku: String) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    return APi.request(`rest/V1/wishlist/addBySku/${sku}?customerId=${localToken}`, "", "POST", "");
}

export async function removeWhishlist(wishlist_item_id: number) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    return APi.request(`rest/V1/wishlist/delete/${wishlist_item_id}?customerId=${localToken}`, "", "DELETE", "")
}

export async function getWhishlistItems() {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    return APi.request(`rest/V1/wishlist/items?customerId=${localToken}`, "", "GET", "");
}

export async function getWhishlistItemsForUser() {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    return APi.request(`rest/all/V1/customer/wishlistItems?customerId=${localToken}`, "", "GET", "")
}

export function addToCartApi(cartData) {
    return customerApi.request(`rest/V1/carts/mine/items`, cartData, "POST", "")
}

export function getCartItems(language) {
    var storeId = language === 'english' ? 'en' : 'ar';
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/${storeId}/V1/carts/${cartQuoteId}`, "", "GET", "")
}

export function getCartTotal() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/totals`, "", "GET", "")
}

export async function getcustomercartquoet() {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.token;
    return APi.request(`rest/V1/customers/${localToken}/carts`, "", "POST", "");
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
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${catId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=status&searchCriteria[filter_groups][1][filters][0][value]=1&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=${pageSize}&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=${sortOrder}`, "", "GET", "");
}

export function getCategoryPage(catId) {
    return APi.request(`rest/V1/categories/${catId}?storeId=2`, "", "GET", "");
}

export function getCategoryDetails() {
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=9&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=visibility&searchCriteria[filter_groups][1][filters][0][value]=4&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=10&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC`, "", "GET", "");
}

export function getPriveExclusiveProducts(category, language) {
    var storeId = language === 'english' ? 3 : 2;
    return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${category}&searchCriteria[filter_groups][0][filters][0][field]=prive&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=visibility&searchCriteria[filter_groups][1][filters][0][value]=4&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&fields=items[sku,name,id,price,custom_attributes]&searchCriteria[pageSize]=7&searchCriteria[sortOrders][0][field]=created_at& searchCriteria[sortOrders][0][direction]=DESC&storeId=${storeId}`, "", "GET", "");
}


export function getProductsFilterRestCollection(category_id: number, language: string, sorting, pageSize, currentPage = 1) {
    var storeId = language === 'english' ? 'en' : 'ar';
    let data;
    if (sorting.sortBy === '') {
        data = '{products(filter:{category_id:{ eq: "' + category_id + '" } }, pageSize: ' + pageSize + ',currentPage: ' + currentPage + ' ){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    } else {
        data = '{products(filter:{category_id:{ eq: "' + category_id + '" } }, pageSize: ' + pageSize + ',currentPage: ' + currentPage + ', sort: {' + sorting.sortBy + ': ' + sorting.sortByValue + '}){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    }
    let query = {
        "query": data,
        "storeCode": storeId,
        "catId": category_id
    }
    return APi.request(`rest/all/V1/product/filtersCollection`, query, "POST", "");
}

export function getProductsFilterRestCollectionProducts(category_id: number, language: string, attribute = '', value = '', sorting, pageSize, branding = '', testing = '', currentPage = 1, searchText = '') {
    let selection = '';

    if (searchText !== 'all') {
        selection = 'search: "' + searchText + '",';
    }
    var storeId = language === 'english' ? 'en' : 'ar';
    let data = '';
    if (attribute === 'price') {
        let price = value.split('-');
        let priceLow = price[0], priceHigh = price[1];
        data = '{products(' + selection + ' filter:{category_id:{ eq: "' + category_id + '" },' + attribute + ':{from: "' + priceLow + '", to: "' + priceHigh + '" } }, pageSize: ' + pageSize + ',currentPage: ' + currentPage + ' ){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    } else if (attribute === 'category_id') {
        data = '{products(' + selection + ' filter:{category_id:{ eq: "' + value + '" } }, pageSize: ' + pageSize + ',currentPage: ' + currentPage + '  sort: {' + sorting.sortBy + ': ' + sorting.sortByValue + '}){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    }
    else if (testing === 'test') {     
        data = '{products(search: "' + value + '", pageSize: ' + pageSize + ' ,currentPage: ' + currentPage + ' ){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    }
    else if (category_id === undefined && branding) {      
        data = '{products(search: "' + branding + '", pageSize: ' + pageSize + ',currentPage: ' + currentPage + '  sort: {' + sorting.sortBy + ': ' + sorting.sortByValue + '}){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    }
    else {       
        data = '{products(' + selection + ' filter:{category_id:{ eq: "' + category_id + '" },' + attribute + ': { eq:"' + value + '" } }, pageSize: ' + pageSize + ',currentPage: ' + currentPage + ' ){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id brand name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    }

    let query = {
        "query": data,
        "storeCode": storeId,
        "catId": category_id ? category_id : 0
    }
    return APi.request(`rest/all/V1/product/filtersCollection`, query, "POST", "");
}

export function getProductFilter(category_id: number) {

    const data = {
        query: `{
    products(
        filter: { category_id: { eq: "153" } }, pageSize: 10
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
    }
} `,
    }
    return APi.request(
        "graphql",
        data,
        "POST",
        ""
    );
}

export function getProductDetails(sku: string, language: string) {
    var storeId = language === 'arabic' ? 'ar' : 'en';
    return APi.request(`rest/${storeId}/V1/products/${sku} `, "", "GET", "");
}

export async function getProductExtras(productId: number, language: string) {
    var storeId = language === 'arabic' ? '2' : '3';
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    return APi.request(`rest/V1/product/recommendation?storeId=${storeId}&customerId=${localToken}&productId=${productId}`, "", "GET", "");
}

export function addToCartApiGuest(cartData) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/items`, cartData, "POST", "")

}
export function createGuestToken() {
    return APi.request(`rest/V1/guest-carts`, "", "POST", "")
}
export function getGuestCart(language: string) {
    var storeId = language === 'arabic' ? 'ar' : 'en';
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/${storeId}/V1/guest-carts/${cartQuoteToken}`, "", "GET", "")
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

export async function assignGuestCartToUSer(language) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
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

export function giftMessageDelete(giftItemID: number, itemId: number, language: string) {
    var storeId = language === 'arabic' ? 2 : 3;
    return APi.request(`rest/V1/cart/quoteItemMessage?storeId=${storeId}&itemId=${itemId}&giftMessageId=${giftItemID}`, "", "GET", "")
}

export function getCheckOutTotals() {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`/rest/V1/carts/${cartQuoteId}/totals`, "", "GET", "")
}

export async function getCartRelevantProducts(productIds: number, language: string) {
    var storeId = language === 'arabic' ? 2 : 3;

    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const customerId = user.cust_id;

    return APi.request(`/rest/V1/product/relevantProducts?customerId=${customerId}&storeId=${storeId}&productIds=${productIds}`, "", "GET", "")
}


export function getGuestShippingMethods() {
    return APi.request(`/rest/V1/guest-carts/:cartId/shipping-methods`, "", "GET", "")
}


export function applyPromoCode(couponCode, language) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    const lang = language === 'arabic' ? 'ar' : 'en';
    return APi.request(`rest/${lang}/V1/carts/${cartQuoteId}/coupons/${couponCode}`, "", "PUT", "")
}

export function applyPromoCodeGuest(couponCode, language) {
    const cartQuoteId = localStorage.getItem('cartQuoteToken');
    const lang = language === 'arabic' ? 'ar' : 'en';
    return APi.request(`rest/${lang}/V1/guest-carts/${cartQuoteId}/coupons/${couponCode}`, "", "PUT", "")
}


export function searchFields(search: string, category: number, page: number, language: string, sortBy, sortByValue, currentPage = 1) {
    var storeId = language === 'english' ? 'en' : 'ar';
    let data: any;
    if (category === 0) {
        return APi.request(`rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=name&searchCriteria[filter_groups][1][filters][0][value]=%${search}%&searchCriteria[filter_groups][1][filters][0][condition_type]=like&searchCriteria[filterGroups][2][filters][0][field]=store_id&searchCriteria[filterGroups][2][filters][0][value]=${storeId}&searchCriteria[filter_groups][2][filters][0][condition_type]=eq&fields=items[sku,brand,name,id,custom_attributes,custom_attributes,price]&searchCriteria[currentPage]=1&searchCriteria[pageSize]=${page}&searchCriteria[sortOrders][0][field]=${sortBy}&searchCriteria[sortOrders][0][direction]=${sortByValue}&storeId=${storeId}`, "", "GET", "")
    } else {
        let sortt = '', searching = '';
        if (sortBy !== '') {
            sortt = 'sort: {' + sortBy + ': ' + sortByValue + '}';
        }
      
        if (search !== 'all') {
            searching = 'search: "' + search + '",';
        }
        data = '{products(' + searching + ' filter:{   category_id:{ eq: "' + category + '" }  }, pageSize: ' + page + ',currentPage: ' + currentPage + '  ' + sortt + '){aggregations{attribute_code count label options{ count label value }}total_count  page_info {page_size  current_page} items { id name sku short_description {  html }  image { url } price_range {  minimum_price {  regular_price { value currency } final_price { value currency } fixed_product_taxes {  label amount {value  currency }}}maximum_price {  discount {  amount_off    percent_off } fixed_product_taxes { label amount { value currency } } } } }}}';
    }
    let query = {
        "query": data,
        "storeCode": storeId,
        "catId": category
    }
    return APi.request(`rest/all/V1/product/filtersCollection`, query, "POST", "");

}

export async function setDefaultShippingAddress(addressId) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const customerId = user.cust_id;
    let cartData = {
        "customerId": customerId,
        "addressId": addressId
    }
    return APi.request(`rest/V1/customer/setDefaultShippingAddress`, cartData, "PUT", "")
}

export async function setDefaultBillngAddress(addressId) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const customerId = user.cust_id;
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

export function placeGuestOrder(language, method, cartQuoteToken) {
    const lang = language === 'arabic' ? 'ar' : 'en';
    let data = {
        "paymentMethod": {
            "method": method
        }
    }
    return APi.request(`rest/${lang}/V1/guest-carts/${cartQuoteToken}/order`, data, "PUT", "");
}


export function placeUserOrder(language, method, cartQuoteId) {
    const lang = language === 'arabic' ? 'ar' : 'en';
    let data = {
        "paymentMethod": {
            "method": method
        }
    }
    return APi.request(`rest/${lang}/V1/carts/${cartQuoteId}/order`, data, "PUT", "");
}

export function getAddressById(addId: number) {
    return APi.request(`rest/V1/customers/addresses/${addId}`, "", "GET", "");
}

export function getGiftMessage(itemId: number) {
    const cartQuoteId = localStorage.getItem('cartQuoteId');
    return APi.request(`rest/V1/carts/${cartQuoteId}/gift-message/${itemId}`, "", "GET", "")
}

export function getGuestGiftMessage(itemId: number) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    return APi.request(`rest/V1/guest-carts/${cartQuoteToken}/gift-message/${itemId}`, "", "GET", "")
}
// my fatoora payment method
export async function myFatoora(billAddress) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user?.token_email;
    let data = {
        "PaymentMethodId": "2",
        "CustomerName": billAddress.name,
        "CustomerMobile": billAddress.phone,
        "CustomerEmail": billAddress.CustomerEmail ? billAddress.CustomerEmail : localToken,
        "Street": billAddress.street,
        "Address": billAddress.address,
        "cartId": localStorage.getItem('cartQuoteId')
    }
    return APi.request(`rest/V1/myfatoorah/executePayment`, data, "POST", "");
}

export function getPaymentStatus(paymentId: number) {
    return APi.request(`rest/V1/myfatoorah/paymentStatus?paymentId=${paymentId}`, "", "GET", "");
}


export function addPaymentDetailstoOrder(data) {
    return APi.request(`rest/V1/payment/setInformation`, data, "POST", "");
}

// get product children if configurable
export function getProductChildren(sku: string) {
    return APi.request(`rest/V1/configurable-products/${sku}/children`, "", "GET", "")
}

// get config product labels
export function configLabels(attributeId: string) {
    return APi.request(`rest/V1/products/attributes/${attributeId}/options`, "", "GET", "")
}

// get order detail by order id return after order placed.

export function orderDetailbyId(orderId: number) {
    return APi.request(`rest/V1/orders/${orderId}`, "", "GET", "")
}


// category list api

export function getCategoryList(language, categoryD) {
    var storeId = language === 'arabic' ? "ar" : "en";
    return APi.request(`rest/${storeId}/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=${categoryD}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=is_active&searchCriteria[filterGroups][1][filters][0][value]=1&searchCriteria[filterGroups][1][filters][0][conditionType]=eq&searchCriteria[filterGroups][2][filters][0][field]=include_in_menu&searchCriteria[filterGroups][2][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][conditionType]=eq&fields=items[name,id]`, "", "GET", "")

}