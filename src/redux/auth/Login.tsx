import API from "../../restApi/Api";
const Api = new API();

class Login {
  //Login
  login(email: string, password: string, type: string) {
    console.log("herer");
    var payload = {
      email: email,
      password: password,
      type: type
    };
    return Api.request("Contact/login", payload, "POST", "");
  }
}

export default Login;
