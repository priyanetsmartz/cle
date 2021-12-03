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
  register(firstname: string, lastname: string, email: string, password: string, type: number, store: string) {
    var storeId = store === 'english' ? 3 : 2;
    var payload = {
      "customer": {
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "storeId": storeId,
        "websiteId": 1,
        "group_id": type
      },
      "password": password,
      "extension_attributes": {
        "is_subscribed": false
      }
    }
    return Api.request("rest/V1/customers", payload, "POST", "");
  }

  getPages() {
    var payload = {};
    return Api.request("rest/V1/cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=partnership", payload, "GET", "");
  }

  getAuthRegister(email: any) {
    var payload = {
      email: email
    }
    return AdminApi.request("rest/V1/customer/detail?email=" + email, payload, "GET", "");
  }

  genCartQuoteID(localToken) {
    //console.log('hetre');
    const cartQuoteToken = localStorage.getItem('cartQuoteToken');
    const language = getCookie('currentLanguage');
    var storeId = language === 'arabic' ? 'ar' : 'en';
    if (cartQuoteToken && !localToken) {
      return Api.request(`rest/${storeId}/V1/guest-carts/${cartQuoteToken}`, '', "PUT", "")
    } else {
      localStorage.removeItem('cartQuoteToken');
      return AdminApi.request(`rest/V1/customers/${localToken}/carts`, "", "POST", "")

      // return Api.request(`rest/V1/carts/mine`, '', 'GET', "")
    }
  }

}

export default Login;
