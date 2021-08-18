import ADMINAPI from "../../restApi/Api";
const AdminApi = new ADMINAPI();


export function getCountriesList() {
    return AdminApi.request(`rest/all/V1/directory/countries`, "", "GET", "");
}

export function getCustomerDetails(custId) {
    return AdminApi.request(`rest/V1/customers/${custId}`, "", "GET", "");
}

export function saveCustomerDetails(custId, data) {
    return AdminApi.request(`default/rest/all/V1/customers/${custId}`, data, "PUT", "");
}

export function updateCustEmail(data) {
    return AdminApi.request(`default/rest/all/V1/customers/me`, data, "PUT", "");
}

export function updateCustAddress(custId, data) {
    return AdminApi.request(`rest/V1/customers/${custId}`, data, "POST", "");
}

export function deleteAddress(addressId) {
    return AdminApi.request(`rest/all/V1/addresses/${addressId}`, "", "DELETE", "");
}

export function getPreference(custId) {
    return AdminApi.request(`rest/V1/customer/attributes?id=${custId}`, "", "GET", "");
}

export function getCustomerOrders(custId) {
    custId = 115; //remove that 
    return AdminApi.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${custId}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`, "", "GET", "");
}

export function getCustomerOrdersByDate(custId, date) {
    custId = 115; //remove that 
    return AdminApi.request(`rest/V1/orders?searchCriteria[filterGroups][0][filters][0][field]=customer_id&searchCriteria[filterGroups][0][filters][0][value]=${custId}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][0][filters][0][field]=created_at&searchCriteria[filterGroups][0][filters][0][value]=${date}&searchCriteria[filterGroups][0][filters][0][conditionType]=eq`, "", "GET", "");
}

export function searchOrders(orderId) {
    return AdminApi.request(`rest/V1/orders/${orderId}`, "", "GET", "");
}


