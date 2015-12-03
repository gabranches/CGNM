//-- Globals --//

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var path = require('path');
global.appRoot = path.resolve(__dirname);

//-- App Config --//

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


// Front page
app.get('/', function (request, response) {
    response.render('pages/index', {
    	heroes: heroes,
     	maps: halfMaps
     });
});


app.listen(app.get('port'), function () {
    console.log('Node app is running.');
});
