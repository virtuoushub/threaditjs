var header = function() {
	return [m("p.head_links", [
			m("a", {href: "https://github.com/koglerjs/threaditjs/tree/master/examples/mithril"}, "Source"),
			" | ", 
			m("a", {href: "http://threaditjs.com"}, "ThreaditJS Home")]),

			m("h2", 
				[m("a", {href: "/", config:m.route}, "ThreaditJS: Mithril")]
			)];
}

var trimTitle = function(str) {
	if(str.length>120) {
		str = str.substr(0, 120) + "...";
	}
	return str;
}

var newThread = function() {
	return m("form", {onsubmit: home.vm.newThread}, [
		m("textarea"),
		m("input", {type:"submit", value: "Post!"})
	]);
}

var home = {
	controller : function() {
		home.vm.init();
	},
	view : function() {
		return [
			header(),
			m("div.main", 
				[home.vm.threads().map(function(thread){
					return [
						m("p", [m("a", {href : "/thread/" + thread.id, config:m.route}, trimTitle(thread.text))]),
						m("p.comment_count", thread.comment_count + " comment(s)"),
						m("hr") 
					];
				}),
				newThread()]
			)
		];
	},
	vm : {
		init : function() {
			home.vm.threads = m.request({method : "GET", url : "http://api.threaditjs.com/threads"})
				.then(function(data) {
					return data.data
				});;
		},
		newThread : function(event) {
			event.preventDefault();
			m.request({
				method: "POST", 
				url : "http://api.threaditjs.com/threads/create",
				data : { text: this[0].value }

			})
			.then(function(response) {
				var newThreads = home.vm.threads();
				newThreads.push(response.data);
				home.vm.threads(newThreads);
			});
			
		}
	}
}

var nodeView = function(node) {
	var reply;
	if(node.replying) {
		reply = m("form", {onsubmit : thread.vm.newComment.bind(node)}, [
			m("textarea", {
				value:node.newComment,
				onchange : function(e) {
					node.newComment = e.currentTarget.value;
				}
			}),
			m("input", {type:"submit", value: "Reply!"})
		]);
	}
	else {
		reply = m("a",{onclick: thread.vm.showReplying.bind(node)}, "Reply!");
	}


	return m("div.comment", [		
		m("p", node.text),
		m("div.reply", [reply]),
		m("div.children", [
			node.children.map(
				function(child) {
					return nodeView(child);
				}
			)
		])
	]);
}

var thread = {
	controller : function(){
		thread.vm.init(m.route.param("id"));
	},
	view : function(node) {
		node = thread.vm.thread().tree;
		return [header(), m("div.main", nodeView(node))];
	},
	vm : {
		init: function(id) {
			thread.vm.thread = m.request({
				method : "GET",
				url : "http://api.threaditjs.com/comments/" + id
			}).then(function(data) {
				var comments = data.data;
				var lookup = {};
				for(var i = 0; i < comments.length; i++) {
					lookup[comments[i].id] = comments[i];
					if(!comments[i].parent_id) {
						root = comments[i];
					}
				}

				var ids;
				for(var i = 0; i < comments.length; i++) {
					ids = comments[i].children;
					comments[i].children = [];
					for(var j = 0; j < ids.length; j++) {
						comments[i].children.push(lookup[ids[j]]);
					}
				}

				return { lookup : lookup , tree : root}
			});
		},
		showReplying : function(event) {
			this.replying = true;
			this.newComment = "";
			event.preventDefault();
		},
		newComment : function(event) {
			var self = this;

			m.request({
				url : "http://api.threaditjs.com/comments/create", 
				method : "POST",
				data : {
					text : this.newComment,
					parent : this.id
				}
			})
			.then(function(response) {
				self.replying = false;
				self.children.push(response.data);
			});

			event.preventDefault();
		}
	}
}


m.route.mode = "pathname";
m.route(document.body, "", {
	"/thread/:id" : thread,
	"" : home
});