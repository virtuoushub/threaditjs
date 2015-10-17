threadit = Ember.Application.create();


threadit.Router.reopen({location: 'auto'});

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
					if(str.length>100) {
						str = str.substr(0,100) + "...";
					}
					data.data[i].text = str;
				}
				return {threads: data.data};
			});
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
	}
});