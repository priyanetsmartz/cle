import ADMINAPI from "../../restApi/Api";
import ADMINTOKEN from "../../restApi/AdminApi";
import { sessionService } from 'redux-react-session';
const AdminApi = new ADMINAPI();
const adminToken = new ADMINTOKEN();


export function vendorLogin(userInfo) {
    return adminToken.request(`rest/V1/vendor/login`, userInfo, "POST", "");
}

export function vendorLogout() {
    return AdminApi.request(`rest/V1/vendor/logout`, "", "GET", "");
}

export async function dataTiles(from, to) {
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    return adminToken.request(`rest/all/V1/vendor/tiles?vendorId=${vendorId}&po_date_from=${from}&po_date_to=${to}`, "", "GET", "");
}