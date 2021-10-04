import ADMINAPI from "../../restApi/Api";
const Api = new ADMINAPI();


export function initiatePayment() {
    return Api.request(`rest/pay`, "", "GET", "");
}