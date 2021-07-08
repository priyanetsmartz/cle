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
}

export default Login;
