export function formatprice(price) {
  return parseFloat(price).toFixed(2)
}
export function capitalize(str) {
  // console.log(str)
  return str.charAt(0).toUpperCase() + str.slice(1);

}

export function createBreadCrums(key: string) {
  let string = key.replace(/\//g, " ");
  return string.split(' ');
}
