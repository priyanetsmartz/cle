import API from "../../restApi/AdminApi";
const Api = new API();

export function MagazineList() {
    return Api.request("rest/V1/blog/list", "", "GET", "");
}


export function PostData(url_key: string) {
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
    return Api.request(`rest/V1/blog/detail?postId=${url_key}`, "", "GET", "");
}

export function AddComment(payload: any) {
    return Api.request(`/rest/V1/blog/addcomment`, payload, "POST", "");
}

export function GetComments(postId: number) {
    return Api.request(`rest/V1/blog/comments?postId=${postId}`, "", "GET", "");
}