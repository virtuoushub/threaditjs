var assert = require("assert");

var threads = require("./threads");
threads.reset();

var fixtures = {
	newThreadText :"test post pls ignore",
	newCommentText :"<i>This is harmless I swear</i>",
	strippedText : "&lt;i&gt;This is harmless I swear&lt;/i&gt;"
}

describe("In-memory store tests", function() {
	describe("home", function() {
		it("should return an array of threads", function() {
			var arr = threads.threads();
			assert.equal(Array.isArray(arr), true);
			assert.equal(typeof arr[0].text, "string");
			assert.equal(typeof arr[0].id, "string");
			assert.equal(Array.isArray(arr[0].children), true);
			assert.equal(typeof arr[0].comment_count, "number");
		});

		it("should have a new thread in it after a thread is added, with the correct text", function() {
			threads.newThread(fixtures.newThreadText);
			var arr = threads.threads();

			var newThread = arr.filter(function(thread) {return thread.text==fixtures.newThreadText});

			assert.equal(newThread.length, 1);

		});

		it("should no longer have that thread in it after a reset", function() {
			threads.reset();
			var arr = threads.threads();

			assert.equal(arr.filter(function(thread) {
				return thread.text == fixtures.newThreadText;
			}).length, 0);
		});
	});

	describe("threads", function() {



		it("should be able to fetch a comment thread", function() {
			threads.reset();
			var home = threads.threads();
			
			var comments = threads.comments(home[0].id);

			assert.equal(Array.isArray(comments), true);
			assert.equal(typeof comments[0].text, "string");
			assert.equal(comments[0].id, home[0].id);
		});

		it("should be able to fetch another comment thread, and add a comment to it", function() {
			threads.reset();
			var home = threads.threads();
			var comments = threads.comments(home[1].id);

			assert.equal(comments[0].id, home[1].id);

			threads.newComment(comments[0].id, fixtures.newCommentText);

			comments = threads.comments(home[1].id);

			var newComment = comments.filter(function(comment) {
				return comment.text==fixtures.strippedText;
			});
			assert.equal(newComment.length, 1); 
			assert.equal(comments[0].id,newComment[0].parent_id); 
		});

		it("should have only the comments from one thread in the response", function() {
			threads.reset();
			var home = threads.threads();
			var comments = threads.comments(home[0].id);

			var lookup = {};

			for(var i = 0; i < comments.length; i++) {
				lookup[comments[i].id] = comments[i];
			}

			var allGoesToRoot = true;
			var current;
			for(var i = 0; i < comments.length; i++) {
				current = lookup[comments[i].parent_id];
				
				while(current && current.id != comments[i].id) {
					current = lookup[current.parent_id];
				}

				if(current) {
					allGoesToRoot = false;
				}
			}

			assert(allGoesToRoot, true);
		});

	});
})