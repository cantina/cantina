/**
 * Test controller: fruit.js.
 *
 * Uses a routing table.
 */

var fruitController = module.exports = {
  name: 'fruitController',
  description: 'A test controller: fruit.'
};

fruitController.routes = {
  '/apple': { get: apple },
  '/orange': { get: orange },
  '/harvest': { post: harvest }
};

function apple() {
  this.res.end('Hey, you picked an apple!');
}

function orange() {
  this.res.end('Hey, you picked an orange!');
}

function harvest() {
  this.res.end('Hey, you posted to harvest!');
}
