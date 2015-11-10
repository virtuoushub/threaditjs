//Welcome to the basic Backbone application, where _.bindAll is a necessary part of initialization,
//where delegateEvents has to be invoked on certain redraws, and where `this` has to be passed as a third
//parameter for event subscription.

//Modern brand new Backbone environments generally use additional libraries for a very good reason.

//Still, I thought it sensible to present what I consider to be classical Backbone style as a starting point.  

//Time to first ajax call
T.time("Setup");

(function() {

	//The Router directs the data layer; the Views determine what should be active
	//based on the state of the data layer.  
	var ThreaditR = Backbone.Router.extend({
		initialize : function() {
			store.bind("threadLoaded", this.setTitle, this);
			store.bind("homeLoaded", this.setTitle, this);
			this.setTitle();
		},
		routes : {
			"" : "home",
			"thread/:id" : "thread"
		},
		home : function() {
			store.loadHome();
		},
		thread : function(id) {
			store.loadThread(id);
		},
		setTitle : function(str) {
			var current = store.getCurrent();
			if(str && typeof str == "string") {
				$("title").html("ThreaditJS: Backbone | " + str);
			}
			else if(current){
				$("title").html("ThreaditJS: Backbone | " + T.trimTitle(current.get("text")));
			}
			else {
				$("title").html("ThreaditJS: Backbone | Home");
			}
		}

	});

	var CommentM = Backbone.Model.extend({
		children: null,
		//After the response is received and the models are added, the model
		//still needs to collect actual references to fill in the basic IDs it has.
		linkChildren : function() {
			this.children = [];
			ids = this.get("children");

			for(var i = 0; i < ids.length; i++) {
				this.children.push(
					this.collection.get(ids[i])
				);
			}
		},
		getChildren : function() {
			return this.children;
		},
		//Update when a comment has been added by the user.  
		addChild : function(m) {
			this.children.push(m);
		}
	});

	//
	var CommentC = Backbone.Collection.extend({
		model : CommentM,
		initialize : function() {
			//The more clear thinking method is to list what you want bound, knowing that if this is not provided many
			//extraneous functions on Backbone.Collection will be bound.  

			//Note that this is for functions passed to promises.  
			_.bindAll(this, "parseHome", "parseThread", "commentSuccess", "threadSuccess", "notifyError");
		},
		home : null,
		//We eschew the Collection fetch/parse methods entirely for clarity and to make the Collection
		//a simple store of all the comments we have, regardless of where we navigate.  
		loadHome : function() {
			T.timeEnd("Setup");
			this.trigger("homeLoading");
			this.currentId = null;

			$.get(T.apiUrl + "/threads")
				.then(this.parseHome)
				.fail(this.notifyError);
		},
		loadThread : function(id) {
			this.trigger("threadLoading");
			this.currentId = id;
			$.get(T.apiUrl + "/comments/" + id)
				.then(this.parseThread)
				.fail(this.notifyError);
		},
		parseHome : function(data) {
			var models = this.add(data.data);
			this.home = models;
			this.trigger("homeLoaded");
		},
		parseThread : function(data) {
			var models = this.add(data.data);

			for(var i = 0; i < models.length; i++) {
				models[i].linkChildren();
			}

			//Backbone's events are synchronous.
			T.time("Thread render");
			this.trigger("threadLoaded");
			T.timeEnd("Thread render");
		},
		createComment: function(id, text) {
			$.post(T.apiUrl + "/comments/create", {
				parent: id,
				text: text
			})
			.then(this.commentSuccess)
			.fail(this.notifyError);
		},
		commentSuccess : function(data) {
			var parent = data.data.parent_id;
			var newM = this.add(data.data);

			//Link the parent to its new child
			this.get(parent).addChild(
				newM
			);

			newM.linkChildren();
			
			this.trigger("threadLoaded");
		},
		createThread : function(text) {
			$.post(T.apiUrl + "/threads/create", {
				text: text
			})
			.then(this.threadSuccess)
			.fail(this.notifyError);
		},
		threadSuccess : function(data) {
			this.home.push(
				this.add(data.data)
			);

			this.trigger("homeLoaded");
		},
		notifyError : function(data) {
			if(data.status==404) {
				this.trigger("notFound");
				return;
			}

			this.trigger("error", data);
		},
		getHome : function() {
			return this.home;
		},
		getCurrent : function() {
			return this.get(this.currentId);
		}
	});

	var store;

	var ThreaditV = Backbone.View.extend({
		tpl : _.template($("#threadit").html()),
		//The SPA must intercept every navigation attempt.  
		events : {
			"click a" : "navigate"
		},
		initialize : function() {
			this.threadList = new ThreadListV();
			this.comments = new CommentsV();
			
			store.bind("homeLoading", this.showHome, this);
			store.bind("threadLoading", this.showThread, this);

			//Take the page!
			this.setElement($("body"));
			this.render();
		},
		showHome : function() {
			this.$el.find(".main").html(this.threadList.el);
			this.threadList.delegateEvents();
		},
		showThread : function() {			
			this.$el.find(".main").html(this.comments.el);
			this.comments.delegateEvents();
		},
		navigate : function(ev) {
			//First we determine if there's a reason to use the default behavior
			var href = $(ev.currentTarget).attr("href");
			if(ev.ctrlKey||ev.shiftKey||ev.altKey||ev.metaKey) {
				return true;
			}

			//Middle click
			if(ev.button==4 || ev.which==2) {
				return true;
			}

			//Off-site links
			if(href.substring(0,2)=="//"||href.substr(0,4)=="http") {
				return true;
			}

			if(href.substring(0,6)=="mailto") {
				return true;
			}
			
			if(href.substring(0,11)=="javascript:") {
				return false;
			}

			ev.preventDefault();
			Backbone.history.navigate(href, {trigger:true});
			window.scrollTo(0, 0);
		},
		render : function() {
			this.$el.html(
				this.tpl()
			);

			return this;
		}
	});

	var ThreadListV = Backbone.View.extend({
		className:"thread_list",
		tpl : _.template($("#thread_item").html()),
		newThreadTpl : _.template($("#new_thread").html()),
		events : {
			"submit" : "handlePost"
		},
		initialize : function() {
			store.bind("homeLoading", this.showLoading, this);
			store.bind("homeLoaded", this.render, this);
			store.bind("error", this.showError, this);
		},
		format : function(obj) {

			obj.text = T.trimTitle(obj.text);

			return obj;
		},
		showLoading : function() {
			this.$el.html("Loading...");
		},
		showError : function() {
			this.$el.html("An error occurred!  Try refreshing!");
		},
		render : function() {
			if(store.models.length===0) {
				this.$el.html("No threads found.");
				return this;
			}

			var models = store.getHome();

			this.$el.empty();

			for(var i = 0; i < models.length; i++) {
				this.$el.append(
					this.tpl(
						this.format(
							models[i].toJSON()
				)));
			}

			this.$el.append(
				this.newThreadTpl()
			);

			return this;
		},
		handlePost : function(ev) {
			var text = this.$el.find("textarea").val();
			store.createThread(text);
			return false;
		}
	});

	
	var CommentsV = Backbone.View.extend({
		className : "comments",
		initialize : function() {
			store.bind("threadLoading", this.showLoading, this);
			store.bind("threadLoaded", this.render, this);
			store.bind("error", this.showError, this);
			store.bind("notFound", this.notFound, this);
			this.subviews = {};
		},
		subviews : {},
		showLoading : function() {
			this.$el.html("Loading...");
		},
		showError : function() {
			this.$el.html("An error occurred!  Try refreshing!");
		},
		notFound : function() {
			this.$el.html("Not found!  Don't try refreshing!");
		},
		render : function() {
			var top = store.getCurrent();
			var currentThread = this.subviews[top.id];
			if(!currentThread) {
				currentThread = this.subviews[top.id] = new CommentV({model:top});
			}

			this.$el.html(currentThread.el);
			currentThread.render();

			return this;
		},
		delegateEvents : function() {
			for(var v in this.subviews) {
				this.subviews[v].render();
			}
		}
	});

	var CommentV = Backbone.View.extend({
		tpl : _.template($("#comment").html()),
		replyTpl : _.template($("#comment_reply").html()),
		className : "comment",
		events : {
			"click .reply a" : "showReply",
			"submit" : "handleReply",
			"keyup textarea" : "showPreview" 
		},
		subviews : {}, //It's not immediately obvious but this view store is shared by all copies of this class
		format : function(obj) {
			return obj;
		},
		render : function() {
			this.$el.html(
				this.tpl(
					this.format(
						this.model.toJSON()
			)));

			var children = this.model.getChildren();
			var id;

			var $children = this.$el.find(".children");

			for(var i = 0; i < children.length; i++) {
				id = children[i].get("id");
				if(!this.subviews[id]) {
					this.subviews[id] = new CommentV({model: children[i]});
				}

				$children.append(this.subviews[id].render().el);
			}

			this.delegateEvents();
			return this;
		},
		showReply : function(ev) {
			this.$el.find(".reply").first().html(this.replyTpl());
			return false;
		},
		handleReply : function(ev) {
			var text = this.$el.find("textarea").val();
			var id = this.model.id;
			store.createComment(id, text);

			return false;
		},
		showPreview : _.throttle(function(ev) {
			var text = this.$el.find("textarea").val();
			this.$el.find(".preview").first().html(
				T.previewComment(text)
			);
		},160)

	});

	$(document).ready(function() {
		store = new CommentC();

		new ThreaditR();
		new ThreaditV();

		Backbone.history.start({pushState : true});
	});
})();