var fs = require("fs");

var express = require("express");
var vhost = require("vhost");

//Get the list of directories in the example directory
//so we know where to direct requests
var apps = fs.readdirSync("./examples/");

//Are we running locally?
var local = fs.existsSync("./.local");

//Set url string handlers appropriately
var homeString = "threaditjs.com";
if(local) {
	homeString = "local." + homeString;
}

//////////////////////////////////////
////Handlers

var app = express();

//Load and serve the api
var api = require("./lib/api.js");
app.use(vhost("api." + homeString, api));

//Create a static handler for each SPA we wish to serve
var staticHandler;

apps.forEach(function(str) {
	staticHandler = express();
	staticHandler.use(express.static(__dirname + "/examples/" + str));

	staticHandler.get("/*", function(req, res) {
		res.sendFile(__dirname + "/examples/" + str + "/index.html");
	});

	app.use(vhost(str + "." + homeString, staticHandler));
});


var perfDir;

apps.forEach(function(str) {
	if(fs.existsSync("./examples/" + str + "/perf/")) {
		perfDir = __dirname + "/examples/" + str + "/perf";
	}
	else {
		perfDir = __dirname + "/examples/" + str;
	}
	staticHandler = express();
	staticHandler.use(express.static(perfDir));
	staticHandler.get("/*", function(req, res) {
		res.sendFile(perfDir + "/index.html");
	});

	app.use(vhost(str + ".perf." + homeString, staticHandler));

});



//Serve the main ThreaditJS.com site
app.use(express.static(__dirname + "/site"));

//And go.
app.listen(80);