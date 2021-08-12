import ADMINAPI from "../../restApi/AdminApi";
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

export function uodateCustEmail(data) {
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

