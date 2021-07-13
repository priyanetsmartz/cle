import API from "../../restApi/Api";
const Api = new API();

class Login {
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
    return Api.request("/rest/V1/customerGroups/search/?searchCriteria[filterGroups][0][filters][0][field]=id&searchCriteria[filterGroups][0][filters][0][value]=3&searchCriteria[filterGroups][0][filters][0][condition_type]=gt", payload, "GET", "");
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
  register(email: string, password: string, type: number) {
    var payload = {
      "customer": {
        "email": email,
        "firstname": "Prasad",
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
}

export default Login;
