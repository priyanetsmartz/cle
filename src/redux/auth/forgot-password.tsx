import API from "../../restApi/AdminApi";
const Api = new API();

class ForgotPassword {
  //ForgotPassword
  forgotPassword(email: string, type: string) {
    var payload = {
      email: email,
      type: type
    };
    return Api.request("Contact/forgot-password", payload, "POST", "");
  }

  resetPassword(email: string, type: string) {
    var payload = {
      email: email,
      type: type
    };
    return Api.request("Contact/forgot-password", payload, "POST", "");
  }
}

export default ForgotPassword;
