import { getCookie } from "../../helpers/session";
import API from "../../restApi/Api";
const Api = new API();


export function Pages(value: string) {
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
    return Api.request(
        "graphql",
        payload,
        "POST",
        ""
    );
}
