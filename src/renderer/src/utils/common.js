export const formatMoney = (value) => {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const capitalizeText = (string) =>
  string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

export const formatPhoneNumber = (input) => {
  if (!input || isNaN(input)) return;
  if (typeof input !== "string") input = input.toString();
  if (input.length === 10) {
    return input.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  } else if (input.length < 10) {
    return "was not supplied enough numbers please pass a 10 digit number";
  } else if (input.length > 10) {
    return "was supplied too many numbers please pass a 10 digit number";
  } else {
    return "something went wrong";
  }
};

export const getTotal = (list) => {
  return list.reduce((total, item) => (total += item.quantity), 0);
};
