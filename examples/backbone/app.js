(function() {
	var ThreaditR = Backbone.Router.extend({
		routes : {
			"" : "home",
			"thread/:id" : "thread"
		},
		home : function() {
			store.loadHome();
		},
		thread : function(id) {
			store.loadThread(id);
		}
	});

	var CommentM = Backbone.Model.extend({
		children: null,
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
		addChild : function(m) {
			this.children.push(m);
		}
	});

	var CommentC = Backbone.Collection.extend({
		model : CommentM,
		initialize : function() {
			_.bindAll(this, "loadHome", "loadThread", "parseHome", "parseThread", "createComment", "createThread", "commentSuccess", "threadSuccess", "notifyError", "getHome");
		},
		home : null,
		loadHome : function() {
			this.trigger("homeLoading");

			$.get("http://api.local.threaditjs.com/threads")
				.then(this.parseHome)
				.fail(this.notifyError);
		},
		loadThread : function(id) {
			this.trigger("threadLoading");
			this.currentId = id;
			$.get("http://api.local.threaditjs.com/comments/" + id)
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

			this.trigger("threadLoaded");
		},
		createComment: function(id, text) {
			$.post("http://api.local.threaditjs.com/comments/create", {
				parent: id,
				text: text
			})
			.then(this.commentSuccess)
			.fail(this.notifyError);
		},
		commentSuccess : function(data) {
			var parent = data.data.parent_id;
			var newM = this.add(data.data);
			this.get(parent).addChild(
				newM
			);

			newM.linkChildren();
			
			this.trigger("threadLoaded");
		},
		createThread : function(text) {
			$.post("http://api.local.threaditjs.com/threads/create", {
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
			if(data.cond==404) {
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
	window.store = store;


	var ThreaditV = Backbone.View.extend({
		tpl : _.template($("#threadit").html()),
		events : {
			"click a" : "navigate"
		},
		initialize : function() {
			this.threadList = new ThreadListV();
			this.comments = new CommentsV();
			
			store.bind("homeLoading", this.showHome, this);
			store.bind("threadLoading", this.showThread, this);
			this.setElement($("body"));
			this.render();
		},
		showHome : function() {
			this.$el.find(".main").html(this.threadList.el);
			this.threadList.delegateEvents();
		},
		showThread : function() {			
			this.$el.find(".main").html(this.comments.el);
			this.comments.render();
		},
		navigate : function(ev) {
			var href = $(ev.currentTarget).attr('href');
			if(ev.ctrlKey||ev.shiftKey||ev.altKey||ev.metaKey) {
				return true;
			}

			//Middle click
			if(ev.button==4 || ev.which==2) {
				return true;
			}

			if(href.substring(0,11)=="javascript:") {
				return false;
			}

			//Off-site links
			if(href.substring(0,2)=='//'||href.substr(0,4)=='http') {
				return true;
			}

			if(href.substring(0,6)=="mailto") {
				return true;
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
		showLoading : function() {
			this.$el.html("Loading...");
		},
		showError : function() {
			this.$el.html("An error occurred!  Try refreshing!");
		},
		render : function() {
			if(store.models.length==0) {
				this.$el.html("No threads found.");
				return this;
			}

			var models = store.getHome();

			this.$el.empty();

			for(var i = 0; i < models.length; i++) {
				this.$el.append(
					this.tpl(
						models[i].toJSON()
				));
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
		}
	});

	var CommentV = Backbone.View.extend({
		tpl : _.template($("#comment").html()),
		replyTpl : _.template($("#comment_reply").html()),
		className : "comment",
		events : {
			"click .reply a" : "showReply",
			"submit" : "handleReply"
		},
		subviews : {},//It's not immediately obvious but this view store is shared by all copies of this class
		render : function() {
			this.$el.html(
				this.tpl(
					this.model.toJSON()
			));

			var children = this.model.getChildren();
			var id;

			var $children = this.$el.find(".children");

			for(var i = 0; i < children.length; i++) {
				id = children[i].get("id");
				if(!this.subviews[id]) {
					this.subviews[id] = new CommentV({model: children[i]});
				}

				$children.append(this.subviews[id].render().el);
				this.subviews[id].delegateEvents();
			}

			return this;
		},
		showReply : function(ev) {
			console.log(this);
			this.$el.find(".reply").first().html(this.replyTpl());
			return false;
		},
		handleReply : function(ev) {
			var text = this.$el.find("textarea").val();
			var id = this.model.id;
			store.createComment(id, text);

			return false;
		}

	});

	$(document).ready(function() {
		store = new CommentC();

		new ThreaditR();
		new ThreaditV();
		Backbone.history.start({pushState : true});
	});
})();