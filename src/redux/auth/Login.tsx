import API from "../../restApi/Api";
const Api = new API();

class Login {
  //Login
  login(email: string, password: string, type: string) {
    var payload = {
      email: email,
      password: password,
      type: type
    };
    return Api.request("login", payload, "POST", "");
  }

  register(email: string, password: string, type: string) {
    var payload = `{
      "customer": {
        "email":`+ email + `,
        "firstname": "test",
        "lastname": "Reddy",
        "storeId": 1,
        "websiteId": 1,
        "group_id": 1
      },
      "password": `+password+`,
      "extension_attributes": {
        "is_subscribed": false
      }
    }`;
    return Api.request("rest/V1/customers", payload, "POST", "");
  }
}

export default Login;
