var header = function() {
	return [m("p.head_links", [
			m("a", {href: "https://github.com/koglerjs/threaditjs/tree/master/examples/mithril"}, "Source"),
			" | ", 
			m("a", {href: "http://threaditjs.com"}, "ThreaditJS Home")]),

			m("h2", 
				[m("a", {href: "/", config:m.route}, "ThreaditJS: Mithril")]
			)];
};

var newThread = function() {
	return m("form", {onsubmit: home.vm.newThread}, [
		m("textarea"),
		m("input", {type:"submit", value: "Post!"})
	]);
};

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
						m("p", [m("a", {href : "/thread/" + thread.id, config:m.route}, T.trimTitle(thread.text))]),
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
			home.vm.threads = m.request({method : "GET", url : T.apiUrl + "/threads"})
				.then(function(response) {
					document.title = "ThreaditJS: Mithril | Home";
					return response.data;
				});
		},
		newThread : function(event) {
			event.preventDefault();
			m.request({
				method: "POST", 
				url : T.apiUrl + "/threads/create",
				data : { text: this[0].value }

			})
			.then(function(response) {
				var newThreads = home.vm.threads();
				newThreads.push(response.data);
				home.vm.threads(newThreads);
			});
			
		}
	}
};

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
};

var thread = {
	controller : function(){
		thread.vm.init(m.route.param("id"));
	},
	view : function(node) {
		node = thread.vm.thread().root;
		return [header(), m("div.main", nodeView(node))];
	},
	vm : {
		init: function(id) {
			thread.vm.thread = m.request({
				method : "GET",
				url : T.apiUrl + "/comments/" + id
			}).then(T.transformResponse)
			.then(function(obj) {
				document.title = "ThreaditJS: Mithril | " + T.trimTitle(obj.root.text);
				return obj;
			});;
		},
		showReplying : function(event) {
			this.replying = true;
			this.newComment = "";
			event.preventDefault();
		},
		newComment : function(event) {
			var self = this;

			m.request({
				url : T.apiUrl + "/comments/create", 
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
};


m.route.mode = "pathname";
m.route(document.body, "", {
	"/thread/:id" : thread,
	"" : home
});