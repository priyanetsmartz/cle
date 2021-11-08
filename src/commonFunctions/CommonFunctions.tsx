import { siteConfigs } from '../config/config';

class CommonFunctions {
  //Get Image Path
  getImagePath(container:string) {
    return siteConfigs.apiUrl + "attachments/" + container + "/download/";
  }

  //Get Base URL
  getBaseUrl() {
    return siteConfigs.apiUrl;
  }

  //Round number
  toFixed(num:number, precision:number) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
  }
}

export default CommonFunctions;
