require("babel-register")({
  presets: ["es2015", "react"]
});

const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;
const axios = require('axios')

async function generateSitemap() {
  try {
    let token = 'hcy0yuocc3geyjhoqd3esopkmjiky8tv'
   , authtoken = `Bearer ${token}`;
    var categories = [];
    var products = [];
    var cmsPages = [];

    await axios.get(`http://apidev.werecle.com/rest/en/V1/categories/list?searchCriteria[filter_groups][0][filters][0][field]=is_active&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[pageSize]=0`, { headers: { "Content-Type": "application/json", 'Authorization': authtoken } })
      .then(res => {
        for (let x in res.data.items) {
          let item = res.data.items[x].custom_attributes
          for (let y in item) {
            if (item[y].attribute_code == 'url_path')
              categories.push(item[y].value)
          }
        }
      })

    await axios.get(`http://apidev.werecle.com/rest/en/V1/products?searchCriteria[pageSize]=0`, { headers: { "Content-Type": "application/json", 'Authorization': authtoken } })
      .then(res => {
       
        for (let x in res.data.items) {
          let item = res.data.items[x]
          products.push(item.sku)
        }
      })

    await axios.get(`https://apidev.werecle.com/rest/V1/cmsPage/search?searchCriteria[filter_groups][0][filters][0][field]=is_active&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filterGroups][0][filters][0][field]=store_id&searchCriteria[filterGroups][0][filters][0][value]=3&searchCriteria[pageSize]=0&fields=items[title,id,identifier,active]`, { headers: { "Content-Type": "application/json", 'Authorization': authtoken } })
      .then(res => {
  
        for (let x in res.data.items) {
          let item = res.data.items[x]
          cmsPages.push(item.identifier)
        }

      })

 
    const paramsConfig = {
      "/products/:category": [{ category: categories }],
      "/product-details/:sku": [{ sku: products }],
      "/:cms": [{ cms: cmsPages }]
    };

    return (
      new Sitemap(router)
        .applyParams(paramsConfig)
        .build("https://dev.werecle.com/")
        .save("./public/sitemap.xml")
    );
  } catch (e) {
  }
}

generateSitemap();