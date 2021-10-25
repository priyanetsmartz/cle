import ADMINAPI from "../../restApi/Api";
import FORGOTPASS from "../../restApi/ForgotPassApi";
import ADMINTOKEN from "../../restApi/AdminApi";
const AdminApi = new ADMINAPI();
const ForgotPassApi = new FORGOTPASS();
const adminToken = new ADMINTOKEN();


export function vendorLogin(userInfo) {
    console.log(userInfo);
    return AdminApi.request(`rest/V1/vendor/login?username=${userInfo.email}&password=${userInfo.password}`, "", "GET", "");
}

export function vendorLogout() {
    return AdminApi.request(`rest/V1/vendor/logout`, "", "GET", "");
}

