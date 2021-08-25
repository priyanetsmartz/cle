import Notification from "../components/notification";
import { apiConfig } from '../settings';
import { getCookie } from "../helpers/session";
import CommonFunctions from "../commonFunctions/CommonFunctions";
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const axios = require("axios");
const processResponse = true;

class AdminApi {
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
            queryString = "";
        } else {
            queryString = "?" + queryString;
        }

        let authtoken = '';
        let token = localStorage.getItem('id_token');
       // const token = apiConfig.adminToken;
        authtoken = `Bearer ${token}`;
        return new Promise(function (resolve, reject) {
            var url = baseUrl + name
            if (method === undefined) {
                method = "post";
            }
            axios
                .request({
                    method: method,
                    url: url,
                    data: postData,
                    headers: { "Content-Type": "application/json", 'Authorization': authtoken }
                })
                .then(async response => {
                    if (processResponse) {
                        resolve(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(function (err) {
                    reject(err.response);
                });
        });
    }
}

export default AdminApi;
