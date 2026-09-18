// Lib/Utils/Sanitizer.js
class Sanitizer {
  // Extrae únicamente las llaves permitidas de un objeto
  static only(data, allowedFields) {
    return allowedFields.reduce((obj, key) => {
      if (data && Object.prototype.hasOwnProperty.call(data, key)) {
        obj[key] = data[key];
      }
      return obj;
    }, {});
  }
}

module.exports = Sanitizer;