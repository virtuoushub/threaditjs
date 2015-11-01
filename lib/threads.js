//Generate ids from integers
var hashids = require("hashids");
hashids = new hashids("transliteration alliteration", 6);

//Strip user input of code hopefully
var entities = new (require('html-entities').XmlEntities)();

////////////////////////////////////////////////////
//Initial data state generation

var randomWord = require("random-word");

//constants/configuraiton for generation of comments
//theoretical future expansion is to read these from a file, but the more I've worked on this
//the more I think prepopulating the dataset is a bit of a waste of time
//(Can't even test the empty state of the app right now!)

//On the other hand having large threads around to test shows that Angular is broken right off the bat.
var c = {
	initialCount : 10,
	responseChance : 0.53,
	maxCommentResponses : 10,
	maxRecursionDepth : 20,
	minCommentWords : 4,
	maxCommentWords : 80,
	punctuationChance : 0.1
};

var punctuation = ",.?;:";

//Generate a comment string
var generateText = function() {
	var length = Math.random() * c.maxCommentWords + c.minCommentWords;

	var str = "";

	for(var i = 0; i < length; i++) {
		str += randomWord();

		if(Math.random()<c.punctuationChance) {
			str += punctuation[Math.floor(Math.random()*punctuation.length)];
		}

		str += " ";
	}

	return str;

};

//Generate and return a full comment tree
var generateThread = function(depth) {
	var rtrn = {};
	
	depth = depth || 1;

	var responseCount = 0;

	commentCount++;
	rtrn.id = hashids.encode(commentCount);
	rtrn.text = generateText();
	rtrn.children = [];
	rtrn.comment_count = 0;

	store[rtrn.id] = rtrn;

	while(depth<c.maxRecursionDepth && responseCount < c.maxCommentResponses && Math.random()<c.responseChance) {
		responseCount++;
		var child = generateThread(depth+1);

		rtrn.children.push(child.id);
		rtrn.comment_count += child.comment_count + 1;
		child.parent_id = rtrn.id;
	}


	return rtrn;
};

//This is a constant for user-accepted input, so it is not part of the config object intended
//for fake dataset generation
var maxCommentLength = 4000;

//Convenience function, used to increment children count attribute
var traverseUp = function(id, fn) {
	var comment = store[id];
	fn(comment);
	if(comment.parent_id) {
		traverseUp(comment.parent_id, fn);
	}
};

//private storage variables; 'database'
var commentCount = 0;
var store = {};
var threadList = [];

//Externally exposed functions
var threads = module.exports = {
	//Discard everything and generate an initialCount number of threads
	reset : function() {
		threadList = [];
		store = {};
		for(var i = 0; i < c.initialCount; i++) {
			threadList.push(generateThread().id);
		}
	},
	//theoretically pass in the generation configuration
	configure : function(obj) {
		c = obj;
	},
	//return the Home page list of threads only
	threads : function() {
		var rtrn = [];
		for(var i = 0; i < threadList.length; i++) {
			rtrn.push(store[threadList[i]]);
		}
		return rtrn;
	},
	//Return a commend id and all of its children only
	comments : function(id) {
		var rtrn = [];

		var comment = store[id];

		if(!comment) {
			return null;
		}

		rtrn.push(comment);

		for(var i = 0; i < comment.children.length; i++) {
			//todo make this not create/discard arrays so pointlessly
			rtrn = rtrn.concat(threads.comments(comment.children[i]));
		}

		return rtrn;  
	},
	//Create a new comment and return it
	newComment : function(id, text) {
		//Handle user-submitted input
		text = entities.encode(text);
		if(text.length>maxCommentLength) {
			text = text.substring(0, maxCommentLength);
		}
		
		var parent = store[id];

		//can't respond to no one
		if(!parent) {
			return null; 
		}
		
		commentCount++;

		//defaults which would be usefully abstracted elsewhere
		var comment = {
			id : hashids.encode(commentCount),
			text : text,
			children : [],
			comment_count : 0,
			parent_id : id
		};

		//Write to the 'database'!
		
		parent.children.push(comment.id);

		//as this is a new comment it hopefully doesn't have any children; 
		//the count only needs to be updated above the tree from here
		traverseUp(id, function(comment) {
			comment.comment_count++;
		});

		//COMMIT TRANSACTION
		store[comment.id] = comment;
		return comment;
	},
	newThread : function(text) {
		//Handle user input
		text = entities.encode(text);
		if(text.length>maxCommentLength) {
			text = text.substring(0, maxCommentLength);
		}
		
		commentCount++;

		//...defaults which would be usefully abstracted elsewhere
		var thread = {
			id : hashids.encode(commentCount),
			text : text,
			children : [],
			comment_count : 0
		};

		//And modify data
		store[thread.id] = thread;
		threadList.push(thread.id);

		return thread;
	}
};