const logger = require("./logger");

const removeComma = (str, find, replace) => {
  logger.info(`STRING ${str}`)
  return str.replace(new RegExp(find, 'g'), replace);
}
const getLastNChars = (str, n) => {
  return str.slice(-n);
}
module.exports = {
  removeComma,
  getLastNChars
}