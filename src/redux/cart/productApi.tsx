import API from "../../restApi/Api";
const APi = new API();

export function getProductByCategory() {
    return APi.request(`default/rest/all/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=2&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`, "", "GET", "");
}