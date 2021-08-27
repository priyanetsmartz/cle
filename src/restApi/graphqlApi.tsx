import CommonFunctions from "../commonFunctions/CommonFunctions";
const commonFunctions = new CommonFunctions();
const baseUrl = commonFunctions.getBaseUrl();
const axios = require("axios");

class GRAPHQLAPI {
    request() {
        return new Promise(function (resolve, reject) {
            axios({
                url: `${baseUrl}graphql`,
                method: 'post',
                proxy: {
                    host: 'https://apidev.werecle.com/'
                  },
                data: {
                    query: `
      query cmsPage(identifier:"about-us") {
        identifier
        }
      `
                }
            }).then((result) => {
                console.log(result.data)
            });
        });
    }
}

export default GRAPHQLAPI;