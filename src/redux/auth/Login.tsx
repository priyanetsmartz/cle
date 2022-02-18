import { getCookie } from "../../helpers/session";
import ADMINAPI from "../../restApi/AdminApi";
import API from "../../restApi/Api";

const Api = new API();
const AdminApi = new ADMINAPI();

class Login {


  //Login
  login(email: string, password: string, type: string) {
    var payload = {
      username: email,
      password: password,
      type: type
    };
    return AdminApi.request("rest/V1/integration/customer/token", payload, "POST", "");
  }

  getCustomerType() {
    var payload = {};
    return AdminApi.request("/rest/V1/customerGroups/search/?searchCriteria[filterGroups][0][filters][0][field]=id&searchCriteria[filterGroups][0][filters][0][value]=3&searchCriteria[filterGroups][0][filters][0][condition_type]=gt", payload, "GET", "");
  }
  register(firstname: string, lastname: string, email: string, password: string, type: number, store: string, is_social_login: number) {
    var storeId = store === 'english' ? 3 : 2;
    var payload = {
      "customer": {
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "storeId": storeId,
        "websiteId": 1,
        "group_id": type,
        "is_social_login": is_social_login
      },
      "password": password,
      "extension_attributes": {
        "is_subscribed": false
      }
    }
    return AdminApi.request("default/rest/all/V1/customers", payload, "POST", "");
  }

  getPages() {
    var payload = {};
    return Api.request("rest/V1/cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=partnership", payload, "GET", "");
  }

  async getAuthRegister(email: any) {
    var payload = {
      email: email
    }
    return await AdminApi.request("rest/V1/customer/detail?email=" + email, payload, "GET", "");
  }

  genCartQuoteID(localToken) {
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    const language = getCookie('currentLanguage');
    var storeId = language === 'arabic' ? 'ar' : 'en';
    if (cartQuoteToken && !localToken) {
      return Api.request(`rest/${storeId}/V1/guest-carts/${cartQuoteToken}`, '', "PUT", "")
    } else {
      localStorage.removeItem('cartQuoteToken');
      return AdminApi.request(`rest/V1/customers/${localToken}/carts`, "", "POST", "")
    }
  }

}

export default Login;
