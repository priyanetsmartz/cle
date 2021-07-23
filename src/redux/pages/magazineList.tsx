import API from "../../restApi/AdminApi";
const Api = new API();

export function MagazineList(language: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request("rest/V1/blog/list?store_id=" + storeId + "&page_no=1", payload, "GET", "");
}

export function PostList() {
    return Api.request("rest/V1/post/list", "", "GET", "");
}
export function GetCategoryData(language = 'english') {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/blog/list?store_id=${storeId}&page_no=1`, "", "GET", "");
}

export function FeaturedList(language = 'english') {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/featured/blog?store_id=` + storeId, "", "GET", "");
}

export function RelatedList(language = 'english', postId) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return Api.request(`default/rest/all/V1/related/blog?storeId=${storeId}&postId=${postId}`, "", "GET", "");
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