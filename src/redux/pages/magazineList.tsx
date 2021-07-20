import API from "../../restApi/AdminApi";
const Api = new API();

export function MagazineList() {
    // var payload =
    // {
    //     query: `
    //     cmsPage(identifier: "`+ value + `") {
    //     identifier
    //     url_key
    //     title
    //     content
    //     content_heading
    //     page_layout
    //     meta_title
    //     meta_description
    //     meta_keywords
    // }
    //     `

    // }
    return Api.request("rest/V1/blog/list?store_id=3&page_no=1", "", "GET", "");
}

export function PostList() {
    return Api.request("rest/V1/post/list", "", "GET", "");
}


export function PostData(url_key: string) {
    return Api.request(`rest/V1/blog/detail?postId=${url_key}&store_id=3`, "", "GET", "");
}

export function AddComment(payload: any) {
    return Api.request(`/rest/V1/blog/addcomment`, payload, "POST", "");
}

export function GetComments(postId: number) {
    return Api.request(`rest/V1/blog/comments?postId=${postId}`, "", "GET", "");
}