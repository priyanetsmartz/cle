import ADMINAPI from "../../restApi/Api";
import ADMINTOKEN from "../../restApi/AdminApi";
import { sessionService } from 'redux-react-session';
import { store } from "../store";
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

export async function getVendorProducts(language: string, status = '', from = '', to = '', type = '', sortValue) {
    console.log(from, to)
    var storeId = language === 'english' ? 'en' : 'ar';
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    let statusCriteria = ``;
    if (status) {
        statusCriteria = `&searchCriteria[filter_groups][2][filters][0][field]=status&searchCriteria[filter_groups][2][filters][0][value]=${status}&searchCriteria[filter_groups][2][filters][0][condition_type]=eq`;
    }
    if (to) {
        statusCriteria = `&searchCriteria[filterGroups][2][filters][0][field]=${type}&searchCriteria[filterGroups][2][filters][0][value]=${from}&searchCriteria[filterGroups][2][filters][0][conditionType]=from&searchCriteria[filter_groups][3][filters][0][field]=${type}&searchCriteria[filter_groups][3][filters][0][value]=${to}& searchCriteria[filter_groups][3][filters][0][condition_type]=to`;
    }
    return adminToken.request(`/rest/${storeId}/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=visibility&searchCriteria[filter_groups][0][filters][0][value]=4&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=udropship_vendor&searchCriteria[filter_groups][1][filters][0][value]=${vendorId}&searchCriteria[filter_groups][1][filters][0][condition_type]=eq${statusCriteria}&searchCriteria[sortOrders][0][field]=${sortValue.sortBy}&searchCriteria[sortOrders][0][direction]=${sortValue.sortByValue}&fields=items[sku,name,id,price,status,custom_attributes,created_at]`, "", "GET", "");
}

export async function getVendorOrders(language: string, pageSize: number, status: any, from: any, to: any, term: any, dateFrom: any, dateTo: any, sortOrders: any) {
    var storeId = language === 'english' ? '3' : '2';
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    let queryString = "vendorId=" + vendorId + "&storeId=" + storeId + "&pageSize=" + pageSize;

    if (status !== null && status !== '') {
        queryString += "&status=" + status;
    }
    if ((from !== null && from !== '') && (to !== null && to !== '' && to !== 0)) {
        queryString += "&fromPrice=" + from + "&toPrice=" + to;
    }
    if (term !== null && term !== '') {
        queryString += "&searchterm=" + term;
    }
    if ((dateFrom !== null && dateFrom !== '') && (dateTo !== null && dateTo !== '')) {
        queryString += "&fromDate=" + dateFrom + "&toDate=" + dateTo;
    }
    if (sortOrders !== '') {
        queryString += "&sortOrder=" + sortOrders;
    }

    return adminToken.request(`rest/all/V1/vendor/vendorOrderCollection?${queryString}`, "", "GET", "");
}

export async function closePopup(flag: number) {
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    let payload = {
        vendor_id: vendorId,
        popUpClose: flag
    }
    return adminToken.request(`rest/all/V1/vendor/vendorPopUpClose`, payload, "PUT", "");
}

export function editVendor(userInfo) {
    return adminToken.request(`rest/all/V1/vendor/editvendordetails`, userInfo, "PUT", "");
}

export function editBusinessDetails(businessDetails) {
    return adminToken.request(`rest/all/V1/vendor/updatebusinessdetails`, businessDetails, "PUT", "");
}

export function editBankDetails(bankdetails) {
    return adminToken.request(`rest/all/V1/vendor/updatebankdetails`, bankdetails, "PUT", "");
}

export function editVendorAddress(address) {
    return adminToken.request(`rest/all/V1/vendor/updateVendorAddress`, address, "PUT", "");
}

export function vendorRestpassword(payload) {
    return adminToken.request(`rest/all/V1/vendor/resetPassword`, payload, "PUT", "");
}


export function removeProduct(deleteInfo) {
    return adminToken.request(`rest/all/V1/products`, deleteInfo, "POST", "");
}

export async function searchProducts(language: string, pageSize: number, status: any, from: any, to: any, term: any, dateFrom: any, dateTo: any, sortOrders: any) {
    var storeId = language === 'english' ? '3' : '2';
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;

    let queryString = "vendorId=" + vendorId + "&storeId=" + storeId + "&pageSize=" + pageSize;
    if (status !== null && status !== '') {
        queryString += "&status=" + status;
    }
    if ((from !== null && from !== '') && (to !== null && to !== '' && to !== 0)) {
        queryString += "&from_price=" + from + "&to_price=" + to;
    }
    if (term !== null && term !== '') {
        queryString += "&searchterm=" + term;
    }
    if ((dateFrom !== null && dateFrom !== '') && (dateTo !== null && dateTo !== '')) {
        queryString += "&from_date=" + dateFrom + "&to_date=" + dateTo;
    }
    if (sortOrders !== '') {
        queryString += "&sortOrder=" + sortOrders;
    }

    return adminToken.request(`rest/all/V1/product/searchProducts?${queryString}`, "", "GET", "")

}

export async function getVendorReturns(language: string, pageSize: number, status: any, from: any, to: any, term: any, dateFrom: any, dateTo: any, sortOrders: any) {
    var storeId = language === 'english' ? '3' : '2';
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    let queryString = "vendorId=" + vendorId + "&storeId=" + storeId + "&pageSize=" + pageSize;

    if (status !== null && status !== '') {
        queryString += "&status=" + status;
    }
    if ((from !== null && from !== '') && (to !== null && to !== '' && to !== 0)) {
        queryString += "&from_price=" + from + "&to_price=" + to;
    }
    if (term !== null && term !== '') {
        queryString += "&searchterm=" + term;
    }
    if ((dateFrom !== null && dateFrom !== '') && (dateTo !== null && dateTo !== '')) {
        queryString += "&from_date=" + dateFrom + "&to_date=" + dateTo;
    }
    if (sortOrders !== '') {
        queryString += "&sortBy=grand_total&sortOrders=" + sortOrders;
    }
    return adminToken.request(`rest/all/V1/vendor/returnCollection?${queryString}`, "", "GET", "");
}

export async function getPayoutOrders(po_date_from, po_date_to, po_status, po_fromPrice, po_toPrice, page_size, sort_order, search) {

    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    let queryString = "vendorId=" + vendorId;
    if (po_date_from != null && po_date_from !== '')
        queryString += "&po_date_from=" + po_date_from
    if (po_date_to != null && po_date_to !== '')
        queryString += "&po_date_to=" + po_date_to
    if (po_status != null && po_status !== '')
        queryString += "&po_status=" + po_status
    if (po_fromPrice != null && po_fromPrice !== '' && po_fromPrice !== 0)
        queryString += "&po_fromPrice=" + po_fromPrice
    if (po_toPrice != null && po_toPrice !== '' && po_toPrice !== 0)
        queryString += "&po_toPrice=" + po_toPrice
    if (page_size != null)
        queryString += "&page_size=" + page_size
    if (search != null && search !== '')
        queryString += "&search=" + search
    return adminToken.request(`default/rest/all/V1/vendor/vendorPayoutCollection?${queryString}`, "", "GET", "")

}

export async function getReturnDetail(id: number) {
    return adminToken.request(`default/rest/all/V1/vendor/returnDetailInformation?rmaId=${id}`, "", "GET", "");
}

export async function getOrderDetail(lang: string, id: number) {
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    return adminToken.request(`default/rest/all/V1/vendor/vendorOrderDetail?vendorId=${vendorId}&orderId=${id}`, "", "GET", "");
}

export async function getPayoutDetails(payoutId) {
    //var storeId = language === 'english' ? 3 : 2;
    let vendor = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
    const vendorId = vendor.vendor_id;
    return adminToken.request(`rest/all/V1/vendor/vendorPayoutDetailPage?vendorId=${vendorId}&pId=`+payoutId, "", "GET", "")
}