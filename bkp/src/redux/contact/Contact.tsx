import { getCookie } from "../../helpers/session";
import API from "../../restApi/AdminApi";
const Api = new API();


export function login() {
  var payload = {};
  return Api.request(
    "Centers/" + getCookie("centerid") + "/contacts",
    payload,
    "GET",
    ""
  );
}
