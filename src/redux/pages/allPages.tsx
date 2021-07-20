import { getCookie } from "../../helpers/session";
import ADMINAPI from "../../restApi/AdminApi";
const AdminApi = new ADMINAPI();


// get menu api right
// export function getFooterMenu() {
//     var payload = {};
//     return AdminApi.request("/rest/V1/cmsBlock/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=footer_link", payload, "GET", "");
// }

// graphql api if needed
export function Pages1(value: string) {
    var payload =
    {
        query: `
        cmsPage(identifier: "`+ value + `") {
        identifier
        url_key
        title
        content
        content_heading
        page_layout
        meta_title
        meta_description
        meta_keywords
    }
        `

    }
    return AdminApi.request(
        "graphql",
        payload,
        "POST",
        ""
    );
}
// rest api 
export function Pages(value: string, language: string) {
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return AdminApi.request("rest/V1/cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=store_id&searchCriteria[filterGroups][0][filters][0][value]=" + storeId + "&searchCriteria[filterGroups][0][filters][0][condition_type]==&searchCriteria[filterGroups][1][filters][0][field]=identifier&searchCriteria[filterGroups][1][filters][0][value]=" + value + "&searchCriteria[filterGroups][1][filters][0][condition_type]==", payload, "GET", "");
}


