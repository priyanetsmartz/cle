import ADMINAPI from "../../restApi/AdminApi";
const AdminApi = new ADMINAPI();



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
    //console.log(language);
    var storeId = language === 'english' ? 3 : 2;
    var payload = {};
    return AdminApi.request("rest/V1/cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=store_id&searchCriteria[filterGroups][0][filters][0][value]=" + storeId + "&searchCriteria[filterGroups][0][filters][0][condition_type]==&searchCriteria[filterGroups][1][filters][0][field]=identifier&searchCriteria[filterGroups][1][filters][0][value]=" + value + "&searchCriteria[filterGroups][1][filters][0][condition_type]==", payload, "GET", "");
}

export function GetHelpUsForm() {
    return AdminApi.request("rest/all/V1/customform/form?storeId=3&form_code=help-us", "", "GET", "");
}

export function SaveAnswers(data) {
    return AdminApi.request("rest/all/V1/amasty_customform/answer", data, "POST", "");
}

export function SendMailForgotPass(data) {
    return AdminApi.request("rest/V1/customers/password", data, "PUT", "");
}

export function ValidateToken(token: string, customerId: number) {
    return AdminApi.request(`rest/V1/customers/${customerId}/password/resetLinkToken/${token}`, "", "GET", "");
}

export function SAveNewPass(data) {
    return AdminApi.request("rest/all/V1/amasty_customform/answer", data, "POST", "");
}


