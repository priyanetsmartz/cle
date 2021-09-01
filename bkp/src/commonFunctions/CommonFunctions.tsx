import { siteConfig } from '../config/config';

class CommonFunctions {
  //Get Image Path
  getImagePath(container:string) {
    return siteConfig.apiUrl + "attachments/" + container + "/download/";
  }

  //Get Base URL
  getBaseUrl() {
    return siteConfig.apiUrl;
  }

  //Round number
  toFixed(num:number, precision:number) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
  }
}

export default CommonFunctions;
