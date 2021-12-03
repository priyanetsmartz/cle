import API from "../../restApi/Api";
import { sessionService } from 'redux-react-session';
import FORGOTPASS from "../../restApi/ForgotPassApi";
import ADMINAPI from "../../restApi/AdminApi";
const Api = new API();
const ForgotPassApi = new FORGOTPASS();
const adminApi = new ADMINAPI();


export function getCountriesList() {
    return Api.request(`rest/all/V1/directory/countries`, "", "GET", "");
}

export function getRegionsByCountryID(countryId: string) {
    return Api.request(`rest/all/V1/directory/countries/${countryId}`, "", "GET", "");
}

export async function getCustomerDetails() {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const custId = user.cust_id;
    return adminApi.request(`rest/V1/customers/${custId}`, "", "GET", "");
}

export function saveCustomerDetails(custId, data) {
    return adminApi.request(`default/rest/all/V1/customers/${custId}`, data, "PUT", "");
}

export function deleteAddress(addressId) {
    return adminApi.request(`rest/all/V1/addresses/${addressId}`, "", "DELETE", "");
}

export function updateCustEmail(data) {
    return ForgotPassApi.request(`rest/V1/customer/emailReset`, data, "PUT", "");
}

export function changePassword(data) {
    return ForgotPassApi.request(`rest/V1/customers/me/password`, data, "PUT", "");
}

export function updateCustAddress(custId, data) {
    return Api.request(`rest/V1/customers/${custId}`, data, "POST", "");
}

export function getPreference(language) {
    const storeId = language === 'english' ? 3 : 2;
    // return adminApi.request(`rest/V1/customer/attributes?id=${custId}`, "", "GET", "");
    return adminApi.request(`rest/all/V1/customer/preferences?storeId=${storeId}`, "", "GET", "");
}


export function savePreference(data) {
    return adminApi.request(`rest/V1/customer/preferences`, data, "PUT", "");
}

export async function getCustomerOrders(pageSize, page) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const custId = user.cust_id;
    return adminApi.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${custId}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[page_size]=${pageSize}&searchCriteria[currentPage]=${page}`, "", "GET", "");
}

export async function getCustomerOrdersByDate(fromDate, toDate, pageSize) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const custId = user.cust_id;
    return adminApi.request(`/rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=created_at&searchCriteria[filterGroups][0][filters][0][value]=${fromDate}&searchCriteria[filterGroups][0][filters][0][conditionType]=from&searchCriteria[filter_groups][1][filters][0][field]=created_at&searchCriteria[filter_groups][1][filters][0][value]=${toDate}&searchCriteria[filter_groups][1][filters][0][condition_type]=to&searchCriteria[filter_groups][2][filters][0][field]=customer_id&searchCriteria[filter_groups][2][filters][0][value]=${custId}&searchCriteria[filter_groups][2][filters][0][condition_type]=eq`, "", "GET", "");
}
export async function getCustomerOrdersByPrice(priceFrom, priceTo, pageSize) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const custId = user.cust_id;
    return adminApi.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=grand_total&searchCriteria[filterGroups][0][filters][0][value]=${priceFrom}&searchCriteria[filterGroups][0][filters][0][conditionType]=from&searchCriteria[filter_groups][1][filters][0][field]=grand_total&searchCriteria[filter_groups][1][filters][0][value]=${priceTo}&searchCriteria[filter_groups][1][filters][0][condition_type]=to&searchCriteria[filter_groups][2][filters][0][field]=customer_id&searchCriteria[filter_groups][2][filters][0][value]=${custId}&searchCriteria[filter_groups][2][filters][0][condition_type]=eq`, "", "GET", "");

}

export async function sortCustomerOrders(sort, pageSize) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const custId = user.cust_id;
    return adminApi.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${custId}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[page_size]=${pageSize}&searchCriteria[sortOrders][0][field]=grand_total&searchCriteria[sortOrders][0][direction]=${sort}`, "", "GET", "");
}

export function searchOrders(orderId) {
    // return adminApi.request(`rest/V1/orders/${orderId}`, "", "GET", "");
    return adminApi.request(`rest/V1/orders?searchCriteria[filter_groups][0][filters][0][field]=increment_id&searchCriteria[filter_groups][0][filters][0][value]=${orderId}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq `, "", "GET", "")
}

export async function getWishList() {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const custId = user.cust_id;
    return Api.request(`rest/V1/wishlist/items?customerId=${custId}`, "", "GET", "");
}

export function addItemToWishList(productId) {
    return Api.request(`rest/V1/wishlist/add/${productId}`, "", "GET", "");
}

export function removeItemFromWishList(custId, wishlist_item_id) {
    custId = 114; //remove that
    return Api.request(`rest/V1/wishlist/delete/${wishlist_item_id}?customerId=${custId}`, "", "DELETE", "");
}

export async function wishListSearchSort(custId, pageSize, sortOrder, sortBy, searchName) {
    let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const localToken = user.cust_id;
    // return adminApi.request(`rest/V1/wishlist/items?customerId=${localToken}&page_size=${pageSize}&sortBy=${sortBy}&soryByValue=${sortOrder}&name=${searchName}`, "", "GET", "");
    return adminApi.request(`rest/V1/wishlist/items?customerId=${localToken}&page_size=${pageSize}&sortBy=${sortOrder}&soryByValue=${sortBy}&name=${searchName}`, "", "GET", "");
}

//apis for the home page
export function getHomePageProducts(language, pageSize, catId) {
    const storeId = language === 'english' ? 3 : 2;
    if (catId && catId !== 0) {
        return adminApi.request(`rest/all/V1/product/newin?storeId=${storeId}&page_size=${pageSize}&catId=${catId}`, "", "GET", "");
    } else {
        return adminApi.request(`rest/all/V1/product/newin?storeId=${storeId}&page_size=${pageSize}`, "", "GET", "");
    }

}

export function getContent(language: string, indentifier) {
    const storeId = language === 'english' ? 3 : 2;
    return adminApi.request(`rest/V1/cmsBlock/search?searchCriteria[filterGroups][0][filters][0][field]=store_id&searchCriteria[filterGroups][0][filters][0][value]=${storeId}&searchCriteria[filterGroups][0][filters][0][condition_type]==eq&searchCriteria[filterGroups][1][filters][0][field]=identifier&searchCriteria[filterGroups][1][filters][0][value]=${indentifier}&searchCriteria[filterGroups][1][filters][0][condition_type]==`, "", "GET", "");
}

export function getCategoryDetails(language, catId) {
    //console.log(catId)
    const storeId = language === 'english' ? 3 : 2;
    return adminApi.request(`rest/V1/categories/${catId}?storeId=${storeId}`, "", "GET", "");
}

export function getCategoryDetailsbyUrlPath(language, url, pageSize) {
    const storeId = language === 'english' ? "en" : "ar";
    return adminApi.request(`rest/${storeId}/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=url_path&searchCriteria[filterGroups][0][filters][0][value]=${url}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[page_size]=${pageSize}`, "", "GET", "");
}

export function getCategoryDetailsbyUrlKey(language, urlkey, pageSize) {
    const storeId = language === 'english' ? "en" : "ar";
    return adminApi.request(`rest/${storeId}/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=url_key&searchCriteria[filterGroups][0][filters][0][value]=${urlkey}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[page_size]=${pageSize}`, "", "GET", "");
}


// export function getWeChooseForYou(language, custId) {
//     const storeId = language === 'english' ? 3 : 2;
//     return adminApi.request(`rest/all/V1/product/relevantProducts?storeId=${storeId}&customerId=${custId}`, "", "GET", "");
// }

export function getWeChooseForYou(language, custId) {
    const storeId = language === 'english' ? 3 : 2;
    // console.log(storeId)
    return adminApi.request(`rest/all/V1/product/newin?storeId=${storeId}&customerId=${custId}`, "", "GET", "");
}


export function getHomePageBanner(language, categoryname = '') {
    let bannerName = '';
    if (categoryname === 'women' || categoryname === '') {
        bannerName = language === 'english' ? 'home_page_slider' : 'home_page_banner_arabic';
    } else {
        bannerName = language === 'english' ? `home_page_slider_${categoryname}` : `home_page_slider_${categoryname}_arabic`;
    }



    return adminApi.request(`rest/V1/lof/bannerslider/getList?searchCriteria[filterGroups][0][filters][0][field]=tags&searchCriteria[filterGroups][0][filters][0][value]=${bannerName}`, "", "GET", "");
}

export function getDesginers(language, catId) {
    const storeId = language === 'english' ? 3 : 2;
    return adminApi.request(`rest/all/V1/designerCategories/collection?storeId=${storeId}&catId=${catId}`, "", "GET", "");
}