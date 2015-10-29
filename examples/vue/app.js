Vue.config.debug = true;

var Home = Vue.extend({
	template : "#thread_list",
	route : {
		data : function() {
			return 	reqwest({
				url : "http://api.threaditjs.com/threads",
				crossOrigin: true
			})
			.then(function(data) {
				return {threads: data.data};
			});
		}
	},
	props: ["threads", "responseText"],
	methods : {
		handleSubmit : function() {
			var self = this;
			reqwest({
				url : "http://api.threaditjs.com/threads/create",
				method : "post",
				crossOrigin: true,
				data : {
					text : this.responseText,
				}
			})
			.then(function(response) {
				self.threads.push(response.data);
				self.responseText = "";
			});
		}
	}
});

Vue.filter("trimThreadTitle", function(str) {
	if(str.length>120) {
		str = str.substr(0, 120) + "...";
	}

	return str;
});


var transformResponse = function(comments) {
	var lookup = {};

	var root;
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
	return root;
}


var Comment = Vue.component("comment", {
	template : "#comment",
	route : {
		data : function(transition) {
			return 	reqwest({
				url : "http://api.threaditjs.com/comments/" + transition.to.params.id,
				crossOrigin: true
			})
			.then(function(data) {
				return transformResponse(data.data);
			});
		}
	},
	props: ["text", "children", "id", "comment_count", "replying", "responseText"],
	methods : {
		startReplying : function() {
			this.replying=true;
		},
		handleSubmit : function() {
			var self = this;
			reqwest({
				url : "http://api.threaditjs.com/comments/create",
				method : "post",
				crossOrigin: true,
				data : {
					text : this.responseText,
					parent : this.id
				}
			})
			.then(function(response) {
				self.children.push(response.data);
				self.responseText = "";
				self.replying = false;
			});
		}
	}
});

var Threadit = Vue.extend({
	template : "#threadit"
});

var router = new VueRouter({
	hashbang : false,
	history: true,
	saveScrollPosition : true
}); 

router.map({
	"/" : {
		component : Home
	},
	"/thread/:id" : {
		name: 'thread',
		component : Comment
	}
});


router.start(Threadit, "#app");