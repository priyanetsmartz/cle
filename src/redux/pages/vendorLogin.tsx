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

export async function getVendorDetails(language: string) {
    var storeId = language === 'english' ? 3 : 2;
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    return adminToken.request(`/rest/all/V1/vendor/personaldetails?vendorId=${vendorId}`, "", "GET", "")
}

export async function getVendorProducts(language: string) {
    var storeId = language === 'english' ? 'en' : 'ar';
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    return adminToken.request(`/rest/${storeId}/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=udropship_vendor&searchCriteria[filter_groups][1][filters][0][value]=${vendorId}&searchCriteria[filter_groups][1][filters][0][condition_type]=eq&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC&fields=items[sku,name,id,price,status,custom_attributes,created_at]`, "", "GET", "");
}

export async function getVendorOrders(language: string,pageSize: number) {
    var storeId = language === 'english' ? '3' : '2';
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    return adminToken.request(`/rest/all/V1/vendor/Orders?vendorId=${vendorId}&pageSize=${pageSize}&store_id=${storeId}`, "", "GET", "");
}