export function formatprice(price) {
  return parseFloat(price).toFixed(2)
}
export function capitalize(str) {
  console.log(str)
  //  return str.charAt(0).toUpperCase() + str.slice(1);

}

export function removeEmptySpace(key: string) {
  let string = key.replace(/ /g, '-');
  return string.toLowerCase();
}

export function addEmptySpace(key: string) {
  let string = key.replace(/-/g, ' ');
  return string;
}