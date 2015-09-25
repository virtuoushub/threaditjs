var limiter = require("express-rate-limit")({
	delayMs : 100,
	global: true
});


var threads = require("./threads.js");
threads.reset();

setInterval(function(){
	threads.reset();
}, 300000);


failChance = .05;
var fail = function() {
	return Math.random()<failChance;
}
var serverError = function(res) { 
	res.status(500).json({
		error: "insufficient success"
	});
};



var express = require("express");
var app = express();

app.use(limiter);

app.get("/threads/", function(req, res){
	if(fail()) {
		serverError(res);
		return;
	}
	res.json(threads.threads());
});

app.get("/comments/", function(req, res) {
	var id = req.params["id"];

	if(fail()) {
		serverError(res);
		return;
	}
	res.json(threads.comments(id));
});

app.post("/create/thread/", function(req, res) {
	var text = req.params["text"];

	if(fail()) {
		serverError(res);
		return;
	}

	var newThread = threads.newThread(text);

	if(!newThread || fail()) {
		serverError(res);
		return;
	}
});

app.post("/create/comment/", function(req, res) {
	var parent = req.params["parent"];
	var text = req.params["text"];

	if(fail()) {
		serverError(res);
		return;
	}
	threads.newComment(parent, text);
	
	if(fail()) {
		serverError(res);
		return;
	}

	res.status(200);
});

module.exports = app;