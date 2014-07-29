module.exports = function (app) {
  app.loaded.push('zplugin');
};
module.exports.weight = -999;