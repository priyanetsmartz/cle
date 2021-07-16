import API from "../../restApi/Api";
import ADMINAPI from "../../restApi/AdminApi";

const Api = new API();
const AdminApi = new ADMINAPI();

class Login {

  getAdminToken() {
    var payload = {
      username: 'monikat',
      password: 'monika@123'
    };
    return Api.request("rest/V1/integration/admin/token", payload, "POST", "");
  }
  //Login
  login(email: string, password: string, type: string) {
    var payload = {
      username: email,
      password: password,
      type: type
    };
    return Api.request("rest/V1/integration/customer/token", payload, "POST", "");
  }

  getCustomerType() {
    var payload = {};
    return AdminApi.request("/rest/V1/customerGroups/search/?searchCriteria[filterGroups][0][filters][0][field]=id&searchCriteria[filterGroups][0][filters][0][value]=3&searchCriteria[filterGroups][0][filters][0][condition_type]=gt", payload, "GET", "");
  }

  // register(email: string, password: string, type: string) {
  //   var payload = `{
  //     "customer": {
  //       "email":`+ email + `,
  //       "firstname": "test",
  //       "lastname": "Reddy",
  //       "storeId": 1,
  //       "websiteId": 1,
  //       "group_id": 1
  //     },
  //     "password": `+ password + `,
  //     "extension_attributes": {
  //       "is_subscribed": false
  //     }
  //   }`;
  //   return Api.request("rest/V1/customers", payload, "POST", "");
  // }
  register(firstname: string, email: string, password: string, type: number) {
    var payload = {
      "customer": {
        "email": email,
        "firstname": firstname,
        "lastname": "Reddy",
        "storeId": 1,
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
    return Api.request("rest/V1/cmsPage/search?searchCriteria[filterGroups][0][filters][0][field]=identifier&searchCriteria[filterGroups][0][filters][0][value]=partnership", "", "GET", "");
  }
}

export default Login;
