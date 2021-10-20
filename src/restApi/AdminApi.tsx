import Notification from "../components/notification";
import { apiConfig } from '../settings';
import CommonFunctions from "../commonFunctions/CommonFunctions";
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
//const qs = require("qs");
const axios = require("axios");
const processResponse = true;

class API {
  //Request Method
  request(name, postData, method, queryString) {
    //Check Internet connection is in working mode
    const connection = navigator.onLine ? true : false;
    if (!connection) {
      Notification(
        "error",
        "Please check your Internet connection and try again",
        ""
      );
      return false;
    }
    if (queryString === undefined) {
      queryString = '';
    }
    //Get token value from cookie
    let authtoken = '';

    const token = apiConfig.adminToken;
    authtoken = `Bearer ${token}`;
   // console.log(token);
    return new Promise(function (resolve, reject) {
      var url = queryString === '' ? baseUrl + name : baseUrl + name + "?" + queryString;
      if (method === undefined) {
        method = "post";
      }
      axios
        .request({
          method: method,
          url: url,
          data: postData,
          headers: { "Content-Type": "application/json", 'Authorization': authtoken}
        })
        .then(async response => {
          if (processResponse) {
            resolve(response);
          } else {
            resolve(response);
          }
        })
        .catch(function (err) {
          resolve(err.response);
        });
    });
  }

  //File Upload
  fileUpload = (name, file, fileName) => {
    var url = baseUrl + name;
    const formData = new FormData();
    formData.append("image", file, fileName);
    return new Promise(function (resolve, reject) {
      axios.post(url, formData).then(res => {
        resolve(res);
      })
        .catch(function (err) {
          reject(err);
        });
    });
  };
}

export default API;
