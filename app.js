//-- Globals --//

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var path = require('path');
global.appRoot = path.resolve(__dirname);
var Map = require('./models/model');
var bodyParser = require('body-parser');

//-- App Config --//

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));


// Front page
app.get('/', function (request, response) {
    response.render('pages/index');
});

// Map page
app.get('/maps/:map', function (request, response) {
	var map = request.params.map.toLowerCase();

	// Get map data and render page
	Map.find({tag: map}, function (err, doc) {
	    if (err) throw err;
	    response.render('pages/map', {map: doc});
	});

});


// New nade
app.post('/ajax/newnade', function (request, response) {
    var data = request.body;

    Map.findOne({tag: data.map}, function (err, doc) {
    	if (err) throw err;
    	console.log(doc);
    	doc.nades.push(
			{
        		box: data.box,
        		type: data.type,
        		team: data.team,
        		description: data.description,
        		link: data.link
        	}
    	);

    	doc.save(function(err) {
            if (err) console.log(err);
        });
    });

    response.end('{"success" : "Updated Successfully", "status" : 200}');
    
});



app.listen(app.get('port'), function () {
    console.log('Node app is running.');
});
