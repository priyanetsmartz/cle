import ADMINAPI from "../../restApi/Api";
import FORGOTPASS from "../../restApi/ForgotPassApi";
import ADMINTOKEN from "../../restApi/AdminApi";
const AdminApi = new ADMINAPI();
const ForgotPassApi = new FORGOTPASS();
const adminToken = new ADMINTOKEN();


export function getCountriesList() {
    return AdminApi.request(`rest/all/V1/directory/countries`, "", "GET", "");
}

export function getCustomerDetails(custId) {
    return adminToken.request(`rest/V1/customers/${custId}`, "", "GET", "");
}

export function saveCustomerDetails(custId, data) {
    return adminToken.request(`default/rest/all/V1/customers/${custId}`, data, "PUT", "");
}

export function deleteAddress(addressId) {
    return adminToken.request(`rest/all/V1/addresses/${addressId}`, "", "DELETE", "");
}

export function updateCustEmail(data) {
    return ForgotPassApi.request(`rest/V1/customer/emailReset`, data, "PUT", "");
}

export function changePassword(data) {
    return ForgotPassApi.request(`rest/V1/customers/me/password`, data, "PUT", "");
}

export function updateCustAddress(custId, data) {
    return AdminApi.request(`rest/V1/customers/${custId}`, data, "POST", "");
}

export function getPreference() {
    const custId = localStorage.getItem('cust_id');
    return AdminApi.request(`rest/V1/customer/attributes?id=${custId}`, "", "GET", "");
}

export function getCustomerOrders() {
    const localToken = 114;
    return adminToken.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${localToken}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`, "", "GET", "");
}

export function getCustomerOrdersByDate(date) {
    const localToken = localStorage.getItem('cust_id');
    return AdminApi.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${localToken}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][0][filters][0][field]=created_at&searchCriteria[filterGroups][0][filters][0][value]=${date}&searchCriteria[filterGroups][0][filters][0][conditionType]=gteq`, "", "GET", "");
}

export function sortCustomerOrders(sort) {
    const custId = 114;
    const pageSize = 10;
    return adminToken.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${custId}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[page_size]=${pageSize}&searchCriteria[sortOrders][0][field]=grand_total&searchCriteria[sortOrders][0][direction]=${sort}`, "", "GET", "");
}

export function searchOrders(orderId) {
    return adminToken.request(`rest/V1/orders/${orderId}`, "", "GET", "");
}

export function getWishList() {
    const custId = localStorage.getItem('cust_id');
    return AdminApi.request(`rest/V1/wishlist/items?customerId=${custId}`, "", "GET", "");
}

export function addItemToWishList(productId) {
    return AdminApi.request(`rest/V1/wishlist/add/${productId}`, "", "GET", "");
}

export function removeItemFromWishList(custId, wishlist_item_id) {
    custId = 114; //remove that
    return AdminApi.request(`rest/V1/wishlist/delete/${wishlist_item_id}?customerId=${custId}`, "", "DELETE", "");
}

export function wishListSearchSort(custId, pageSize, sortOrder, sortBy, searchName) {
    const localToken = localStorage.getItem('cust_id');
    return AdminApi.request(`rest/V1/wishlist/items?customerId=${localToken}&page_size=${pageSize}&soryByValue=${sortOrder}&sortBy=${sortBy}&name=${searchName}`, "", "GET", "");
}

//apis for the home page
export function getHomePageProducts() {
    const storeId = 2;
    const customerId = 114;
    return adminToken.request(`rest/all/V1/product/newin?storeId=${storeId}&customerId=${customerId}`, "", "GET", "");
}

