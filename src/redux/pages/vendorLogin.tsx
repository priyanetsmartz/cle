import ADMINAPI from "../../restApi/Api";
import ADMINTOKEN from "../../restApi/AdminApi";
const AdminApi = new ADMINAPI();

const adminToken = new ADMINTOKEN();


export function vendorLogin(userInfo) {
    return adminToken.request(`rest/V1/vendor/login`, userInfo, "POST", "");
}

export function vendorLogout() {
    return AdminApi.request(`rest/V1/vendor/logout`, "", "GET", "");
}
