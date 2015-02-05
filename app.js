var express = require('express');
var path = require('path');
var logger = require('morgan');
var swig = require('swig');
var sass = require('node-sass-middleware');
var bodyParser = require('body-parser');

// set up server
var app = express();
app.engine('html', swig.renderFile);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	sass({
		src: __dirname + '/assets',
		dest: __dirname + '/public',
		debug: true
	})
);

// set up routes
var routes = require('./routes');
app.use('/', routes);


// error handlers
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(req, res, next) {
	res.status(err.status || 500);
	console.log({error: err});
	res.send();
	// res.render( // Fill this in with an error page
	// 	)
})

module.exports = app;