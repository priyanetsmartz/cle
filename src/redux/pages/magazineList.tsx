import API from "../../restApi/AdminApi";
const Api = new API();

export function MagazineList(language: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/blog/list?store_id=${storeId}&page_no=1&sortBy=published_at&soryByValue=desc`, payload, "GET", "");
}

export function PostList() {
    return Api.request("rest/V1/post/list", "", "GET", "");
}
export function GetCategoryData(language: string, page: number, sortBy: string, sortByValue: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/blog/list?store_id=${storeId}&page_no=${page}&sortBy=${sortBy}&soryByValue=${sortByValue}`, payload, "GET", "");
}

export function FeaturedList(language: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/featured/blog?store_id=` + storeId, payload, "GET", "");
}

export function GetCategoryList(language: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/blog/categories?store_id=` + storeId, payload, "GET", "");
}

export function GetDataOfCategory(language: string, categroy_Id: number, page: number, sortBy: string, sortByValue: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/category/bloglist?store_id=${storeId}&page_no=${page}&catId=${categroy_Id}&sortBy=${sortBy}&soryByValue=${sortByValue}`, payload, "GET", "");
}

export function RelatedList(language: string, postId) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/related/blog?storeId=${storeId}&postId=${postId}`, payload, "GET", "");
}

export function PostData(url_key: string) {
    return Api.request(`rest/V1/blog/detail?postId=${url_key}`, "", "GET", "");
}

export function AddComment(payload: any) {
    return Api.request(`rest/V1/blog/addcomment`, payload, "POST", "");
}

export function GetComments(postId: number) {
    return Api.request(`rest/V1/blog/comments?postId=${postId}`, "", "GET", "");
}

export function SendNewsletter(payload, language = 'english') {
    const data = { storeId: language === 'english' ? 3 : 2, email: payload.userInfo.email }
    return Api.request(`rest/all/V1/newsletter/subscriber`, data, "POST", "");
}

export function postViews(language, id, ip) {
    const data = {
        "postId": id,
        "customerId": null,
        "sessionId": localStorage.getItem('id_token') ? localStorage.getItem('id_token') : ip,
        "remoteAddr": ip,
        "store_id": language === 'english' ? 3 : 2
    }
    return Api.request('rest/V1/addrecent/view', data, "POST", "");
}