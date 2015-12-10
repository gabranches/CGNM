//-- Globals --//

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var path = require('path');
global.appRoot = path.resolve(__dirname);
var Map = require('./models/model');
var bodyParser = require('body-parser');
var db = require('./lib/dbTransactions')();

var recentVotes = [];
var recentNades = [];
var maps = ['dust2', 'cbble', 'cache', 'inferno', 'mirage', 'overpass', 'train'];


// Session variables

var expressSession = require('express-session');
var session = expressSession({
    secret: "cookie_secret",
    cookie: { maxAge: (60000 * 24 * 30)},
    resave: true,
    saveUninitialized: true
});

app.use(session);


//-- App Config --//

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));


// Front page
app.get('/', function (request, response) {
    Map.find({}, 'tag name', {sort: 'name'},  function (err, doc) {
        response.render('pages/index', {maps: doc});
    });
});

// Map page
app.get('/maps/:map', function (request, response) {
	var map = request.params.map.toLowerCase();

	// Get map data and render page
	Map.find({tag: map}, function (err, doc) {
	    if (err) throw err;
	    response.render('pages/map', {map: doc, session: request.session.id});
	});

});


// New nade
app.post('/ajax/newnade', function (request, response) {
    var data = request.body;
    var ip = request.header('x-forwarded-for') || request.connection.remoteAddress;
	console.log(data);

    // Check if user recently added a link
    if(recentNades.indexOf(request.session.id) > -1) {
        // Send error
        response.end('{"error" : "Please wait before submitting again.", "status" : 200}');
    } else {
        // Add link
        recentNades.push(request.session.id);
        Map.findOne({tag: data.map}, function (err, doc) {
        	
        	doc.nades.push(
    			{
                    ip: ip,
            		box: data.box,
            		type: data.type,
            		team: data.team,
            		link: data.link,
            		title: data.title,
            		rating: 0,
                    removed: 0,
                    creator: request.session.id
            	}
        	);

        	doc.save(function(err) {
                if (err) throw err;
                response.end('{"success" : "Updated Successfully", "status" : 200}');
            });

        });

    }
    
});


// Vote
app.post('/ajax/vote', function (request, response) {
    var data = request.body;
    console.log(data);

    // Check if user has already voted
    if(recentVotes.indexOf(request.session.id + data.id + data.choice) > -1) {
        // Send error
        response.end('{"error" : "You have already voted.", "status" : 200}');
    } else {
        

        // Write vote
        Map.findOne({ tag: data.map }, function (err, doc) {
            if (err) throw err;
            var nade = db.getElement(doc['nades'], '_id', data.id);
            console.log(nade);
            if (data.choice == 'up') {
                nade.rating++;
                // Find the equivalent downvote if it exists
                var index = recentVotes.indexOf(request.session.id + data.id + 'down');


            } else {
                nade.rating--;
                if (nade.rating == -5) {
                    nade.removed = 1;
                }
                // Find the equivalent upvote if it exists
                var index = recentVotes.indexOf(request.session.id + data.id + 'up');
            }

            // Remove opposite from recentVotes
            if (index > -1) {
                recentVotes.splice(index, 1);
            } else {
                // Add to recent votes
                recentVotes.push(request.session.id + data.id + data.choice);
            }

            doc.save(function(err) {
                if (err) throw err;
                response.end('{"success" : "Vote Successful", "status" : 200, "rating": "'+nade.rating+'"}');
            });
        });

    }
});

// Remove nade
app.post('/ajax/remove', function (request, response) {
    var data = request.body;
    console.log(data);

    // Check if session ids match
    if(data.sessionID == request.session.id) {

        console.log(data.id);
        console.log(data.map);

        Map.findOne({ tag: data.map }, function (err, doc) {
            if (err) throw err;
            var nade = db.getElement(doc['nades'], '_id', data.id);
            console.log(nade);
            nade.removed = 1;

            doc.save(function(err) {
                if (err) throw err;
                response.end('{"success" : "Nade removed", "status" : 200}');
            });
        });
    } 
});



setInterval(function() {
    recentNades = [];
}, 10000);


app.listen(app.get('port'), function () {
    console.log('Node app is running.');
});
