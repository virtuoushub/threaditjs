T.time("Setup");

var threadit = Ember.Application.create();

//Use the HTML5 History API for URLs
threadit.Router.reopen({location: "history"});

//Index route is implied.
threadit.Router.map(function() {
	this.route("thread", {path: "/thread/:id"});
});

function ajax(method, url, data) {
	data = data || {};
	return new Ember.RSVP.Promise(function(resolve, reject) {
		$.ajax(url, {
			data : data,
			method : method,
			failure : Ember.run.bind(null, reject),
			success : Ember.run.bind(null, resolve)
		});
	});
}

threadit.ApiService = Ember.Service.extend({
	fetchThreads : function() {
		T.timeEnd("Setup");
		return ajax('GET', T.apiUrl + "/threads/");
	},
	createThread : function(newText) {
		return ajax('POST', T.apiUrl + "/threads/create", {
			text: newText
		});
	},
	fetchComments : function(id) {
		return $.getJSON(T.apiUrl + "/comments/" + id);
	},
	createComment : function(data) {
		return ajax('POST', T.apiUrl + "/comments/create", data);
	}
});

threadit.TrimHelper = Ember.Helper.helper(function(params) {
	return T.trimTitle(params[0]);
});

threadit.TrustHelper = Ember.Helper.helper(function(params) {
	return new Ember.Handlebars.SafeString(params[0]);
});

threadit.MarkedHelper = Ember.Helper.helper(function(params) {
	var str = params[0] || "";
	return new Ember.Handlebars.SafeString(T.previewComment(str));
});

threadit.IndexRoute = Ember.Route.extend({
	api : Ember.inject.service(),
	model : function() {
		return this.get('api').fetchThreads()
			.then(function(data) {
				return {
					threads: data.data
				};
			});
	},
	afterModel : function(model) {
		//It's unfair to criticize Ember for this, no framework handles the document title well.
		document.title = "ThreaditjS: Ember | Home";
	}
});

threadit.IndexController = Ember.Controller.extend({
	api : Ember.inject.service(),
	actions : {
		newThread : function() {
			var controller = this;
			var newText = this.get('newText');
			this.get('api').createThread(newText)
			.then(function(response) {
				controller.set('newText', '');
				controller.get('model.threads').pushObject(response.data);
			});
		}
	},
});

threadit.ThreadRoute = Ember.Route.extend({
	api : Ember.inject.service(),
	model : function(params) {
		return this.get('api').fetchComments(params.id)
			.then(T.transformResponse);
	},
	afterModel : function(model) {
		T.time("Thread render");
		//It seems to be a safe assumption that Ember doesn't give up controlf the thread until after rendering.
		//In any case, I'm not sure where else to attempt to capture the end of the render.  
		setTimeout(function() {
			T.timeEnd("Thread render")
		}, 0);
		document.title = "ThreaditJS: Ember | " + T.trimTitle(model.root.text, 80);
	}
});

threadit.ThreadItemComponent = Ember.Component.extend({
	api : Ember.inject.service(),
	actions : {
		showReply : function() {
			this.set('isReplying', true);
		},
		newComment : function(node) {
			var component = this;
			this.get('api').createComment({
				text : component.get('newText'),
				parent : node.id
			})
			.then(function(response) {
				//Reset the form state.
				component.set('isReplying', false);
				component.set('newText', '');
				//Create a new object with the new comment.
				component.get('model.children').pushObject(response.data);
			});
		}
	},
});