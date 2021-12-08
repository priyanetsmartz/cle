import { addToCartApi, addToCartApiGuest, createGuestToken, getGuestCart, getWhishlistItemsForUser } from "../../redux/cart/productApi";
import { getCategoryDetailsbyUrlKey, getCategoryDetailsbyUrlPath, getHomePageProducts } from "../../redux/pages/customers";
import { siteConfig } from "../../settings";
import Login from '../../redux/auth/Login';
import { sessionService } from 'redux-react-session';
import { getCookie } from "../../helpers/session";
const loginApi = new Login();



export function formatprice(price) {
  //return parseFloat(price).toFixed(2)

  return price ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : price
}
export function capitalize(str) {
  //console.log(str)
  return str.charAt(0).toUpperCase() + str.slice(1);

}

export async function getSession() {
  return  await sessionService.loadUser().then(user => { return user }).catch(err => { return err 
  })
}
export function createBreadCrums(key: string) {
  let string = key.replace(/\//g, " ");
  return string.split(' ');
}


export async function getCategoryDetailsbyUrlPathFxn(languages: string, urlPath: string) {
  let result: any = await getCategoryDetailsbyUrlPath(languages, urlPath, siteConfig.pageSize);
  if (result && result.data && result.data.items && result.data.items.length > 0 && result.data.items[0].custom_attributes && result.data.items[0].custom_attributes.length > 0) {
    return result.data;
  } else {
    return {}
  }
}

export async function getCategoryDetailsbyUrlKeyFxn(languages: string, urlKey: string) {
  let result: any = await getCategoryDetailsbyUrlKey(languages, urlKey, siteConfig.pageSize);
  if (result && result.data && result.data.items && result.data.items.length > 0 && result.data.items[0].custom_attributes && result.data.items[0].custom_attributes.length > 0) {
    return result.data;
  } else {
    return {}
  }
}

export async function getHomePageProductsFxn(languages: string, categoryId = '') {
  let products = [];

  let result: any = await getHomePageProducts(languages, siteConfig.pageSize, categoryId);
  let productResult = [];

  products['newInProducts'] = result && result.data && result.data.length > 0 ? result.data[0].newInProducts : [];
  products['bestSeller'] = result && result.data && result.data.length > 0 ? result.data[0].bestSellers : [];

  let user = await sessionService.loadUser().then(user => { return user }).catch(err => { // test 
  })

  if (user && user.cust_id) {
    let whishlist: any = await getWhishlistItemsForUser();
    let WhishlistData = whishlist.data;

    const mergeById = (a1, a2) =>
      a1.length > 0 && a1.map(itm => ({
        ...a2.find((item) => (parseInt(item.id) === parseInt(itm.id)) && item),
        ...itm
      }));

    productResult = mergeById(products['bestSeller'], WhishlistData);
    products['bestSeller'] = productResult;
    return (products);
  }
  return (products);
}


export async function handleCartFxn(id: number, sku: string) {
  let cartData = {};
  let cartSucces: any;
  let cartQuoteId = '';
  let user = await sessionService.loadUser().then(user => { return user }).catch(err => console.log(''))
  // console.log(user)
  const customerId = user ? user.cust_id : '';
  let cartQuoteIdLocal = localStorage.getItem('cartQuoteId');
  // console.log(cartQuoteIdLocal)
  if (customerId) {
    // console.log(customerId)
    let customerCart: any = await loginApi.genCartQuoteID(customerId)
    cartQuoteId = cartQuoteIdLocal
    if (customerCart.data !== parseInt(cartQuoteIdLocal)) {
      cartQuoteId = customerCart.data;
    }
  } else {
    let lang = getCookie('currentLanguage');
    if (!cartQuoteIdLocal) {
      let guestToken: any = await createGuestToken();
      localStorage.setItem('cartQuoteToken', guestToken.data);
      let result: any = await getGuestCart(lang);
      cartQuoteId = result && result.data && result.data.id ? result.data.id : 0;
    } else {
      let result: any = await getGuestCart(lang);
      cartQuoteId = result && result.data && result.data.id ? result.data.id : 0;
    }

  }
  localStorage.setItem('cartQuoteId', cartQuoteId);
  cartData = {
    "cartItem": {
      "sku": sku,
      "qty": 1,
      "quote_id": cartQuoteId
    }
  }


  if (customerId) {
    cartSucces = await addToCartApi(cartData)
  } else {
    cartSucces = await addToCartApiGuest(cartData)
  }

  return cartSucces.data;
}