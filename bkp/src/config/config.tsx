//This is config file containing all the global sources

const siteConfig = {
    apiUrl: process.env.REACT_APP_API_URL,
    imagePath: function (container) {
        return this.apiUrl + 'attachments/' + container + '/download/'
    }
}

export { siteConfig };