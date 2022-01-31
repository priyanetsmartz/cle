require("babel-register")({
    presets: ["es2015", "react"]
  });
   
  const router = require("./sitemap-routes").default;
  const Sitemap = require("react-router-sitemap").default;
  const axios = require('axios')

  async function generateSitemap() {
    try {
    //   console.log(process.env.REACT_APP_API_URL)
    token ='hcy0yuocc3geyjhoqd3esopkmjiky8tv'
    authtoken = `Bearer ${token}`;
   var categories = [];  
   var products = []; 
   var cmsPages = [];
   var magazineCategories = [];
    
    await axios.get(`http://apidev.werecle.com/rest/en/V1/categories/list?searchCriteria[filter_groups][0][filters][0][field]=is_active&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[pageSize]=0`,{headers: { "Content-Type": "application/json", 'Authorization': authtoken }})
      .then(res =>{
        //console.log("count",res.data.items.length)
        for (let x in res.data.items){
          let item = res.data.items[x].custom_attributes
          for(let y in item){
            if(item[y].attribute_code == 'url_path')
            categories.push(item[y].value)
          }
        }
      })

      await axios.get(`http://apidev.werecle.com/rest/en/V1/products?searchCriteria[pageSize]=0`,{headers: { "Content-Type": "application/json", 'Authorization': authtoken }})
      .then(res =>{
        //console.log("pcount", res.data.items.length)
        for (let x in res.data.items){
          let item = res.data.items[x]
          products.push(item.sku)
        }
      })

      await axios.get(`https://apidev.werecle.com/rest/V1/cmsPage/search?searchCriteria[filter_groups][0][filters][0][field]=is_active&searchCriteria[filter_groups][0][filters][0][value]=1&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filterGroups][0][filters][0][field]=store_id&searchCriteria[filterGroups][0][filters][0][value]=3&searchCriteria[pageSize]=0&fields=items[title,id,identifier,active]`,{headers: { "Content-Type": "application/json", 'Authorization': authtoken }})
      .then(res =>{
        //console.log("cms", res.data.items.length)
        for (let x in res.data.items){
          let item = res.data.items[x]
          cmsPages.push(item.identifier)
        }

      })

      // await axios.get(`http://4a83875b65.nxcli.net/default/rest/all/V1/blog/list?store_id=3&page_no=1&sortBy=title&soryByValue=asc&pageSize=12`,{headers: { "Content-Type": "application/json", 'Authorization': authtoken }})
      // .then(res =>{
      //   for (let x in res.data){
      //     let item = res.data[x]
      //     magazineCategories.push(item.categroy)
      //   }
      // })
      
      const paramsConfig = {
        "/products/:category":[{category:categories}],
        "/product-details/:sku": [{sku:products}],
        "/:cms":[{cms:cmsPages}]
      };
  
      return (
        new Sitemap(router)
            .applyParams(paramsConfig)
            .build("https://dev.werecle.com/")
            .save("./public/sitemap.xml")
      );
    } catch(e) {
      console.log(e);
    } 
  }
  
  generateSitemap();