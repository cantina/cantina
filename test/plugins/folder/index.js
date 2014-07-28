module.exports = function (app) {
  app.folderLoaded = true;

  // Load plugin's conf.
  app.load('conf');

  // Return some api or something.
  return 'something';
};