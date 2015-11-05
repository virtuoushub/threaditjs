threadit = Ember.Application.create();
//Activate no # mode.  
threadit.Router.reopen({location: "auto"});

//Index route is implied.  
threadit.Router.map(function() {
	this.route("thread", {path: "/thread/:id"});
});

//as are controllers.

threadit.IndexRoute = Ember.Route.extend({
	model : function() {
		return $.getJSON(T.apiUrl + "/threads/")
			.then(function(data) {
				var str;
				//Rant about being nuable to define helpers without ember-cli is referring
				//to this.
				for(var i = 0; i < data.data.length; i++) {
					data.data[i].text = T.trimTitle(data.data[i].text);
				}
				return {
					threads: data.data
				};
			});
	},
	actions : {
		newThread : function() {
			var model = this.currentModel;
			$.post(T.apiUrl + "/threads/create",{
				text: model.newText
			})
			.then(function(response) {
				//Ember.set tracks what needs to be redrawn.  
				Ember.set(model, "newText", "");
				var newList = model.threads.slice();
				newList.push(response.data);
				Ember.set(model, "threads", newList);
			});
		}
	},
	afterModel : function(model) {
		//It's unfair to criticize Ember for this, no framework handles the document title well.
		document.title = "ThreaditjS: Ember | Home";
	}
});

threadit.ThreadRoute = Ember.Route.extend({
	model : function(params) {
		return $.getJSON(T.apiUrl + "/comments/" + params.id)
			.then(T.transformResponse);
	},
	actions : {
		showReply : function(node) { 
			Ember.set(node, "replying", true);
		},
		newComment : function(node) {
			$.post(T.apiUrl + "/comments/create", {
				text : node.newText,
				parent : node.id
			})
			.then(function(response) {
				//Reset the form state.
				Ember.set(node, "replying", false);
				Ember.set(node, "newText", "");
				//Create a new object with the new comment.
				var newChildren = node.children.slice();
				newChildren.push(response.data);
				Ember.set(node, "children", newChildren);
			});
		}
	},
	afterModel : function(model) {
		document.title = "ThreaditJS: Ember | " + T.trimTitle(model.root.text, 80);
	}
});