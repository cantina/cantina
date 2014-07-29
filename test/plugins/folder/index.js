module.exports = function (app) {
  app.loaded.push('folder');

  // Load plugin's conf.
  app.load('conf');

  // Return some api or something.
  return 'something';
};