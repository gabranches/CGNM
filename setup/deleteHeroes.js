var Heroes = require('../models/model.js').Maps;
var heroes = require('./heroes.js');

Heroes.remove({}, function(err) { 
   console.log('collection removed');
   process.exit()
});

