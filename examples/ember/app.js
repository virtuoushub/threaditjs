threadit = Ember.Application.create();

threadit.Router.reopen({location: 'auto'});

//Index route is implied.  
threadit.Router.map(function() {
	this.route("thread", {path: "/thread/:id"});
});

threadit.IndexRoute = Ember.Route.extend({
	model : function() {
		return $.getJSON("http://api.threaditjs.com/threads/")
			.then(function(data) {
				var str;
				for(var i = 0; i < data.data.length; i++) {
					str = data.data[i].text;
					if(str.length>120) {
						str = str.substr(0,120) + "...";
					}
					data.data[i].text = str;
				}
				return {threads: data.data};
			});
	},
	actions : {
		newThread : function() {
			var model = this.currentModel;
			$.post("http://api.threaditjs.com/threads/create",{
				text: model.newText
			})
			.then(function(response){
				Ember.set(model, "newText", "");
				var newList = model.threads.slice();
				newList.push(response.data);
				Ember.set(model, "threads", newList);
			});
		}
	}
});

threadit.ThreadRoute = Ember.Route.extend({
	model : function(params) {
		return $.getJSON("http://api.threaditjs.com/comments/" + params.id)
			.then(function(data) {
				var comments = data.data;

				var map = {};

				var root;
				for(var i = 0; i < comments.length; i++) {
					map[comments[i].id] = comments[i];
					if(!comments[i].parent_id) {
						root = comments[i];
					}
				}

				var ids;
				for(var i = 0; i < comments.length; i++) {
					ids = comments[i].children;
					comments[i].children = [];
					for(var j = 0; j < ids.length; j++) {
						comments[i].children.push(map[ids[j]]);
					}
				}

				return {root: root};
			});
	},
	actions : {
		showReply : function(node) { 
			Ember.set(node, "replying", true);
		},
		newComment : function(node) {
			$.post("http://api.threaditjs.com/comments/create", {
				text : node.newText,
				parent : node.id
			})
			.then(function(response) {
				Ember.set(node, "replying", false);
				Ember.set(node, "newText", "");
				var newChildren = node.children.slice();
				newChildren.push(response.data);
				Ember.set(node, "children", newChildren);
			});
		}
	}
});