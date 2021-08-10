import ADMINAPI from "../../restApi/AdminApi";
const AdminApi = new ADMINAPI();


export function getCountriesList() {
    return AdminApi.request(`rest/all/V1/directory/countries`, "", "GET", "");
}

export function getCustomerDetails(custId) {
    return AdminApi.request(`rest/V1/customers/${custId}`, "", "GET", "");
}

export function saveCustomerDetails(custId,data) {
    return AdminApi.request(`rest/V1/customers/${custId}`, data, "PUT", "");
}

