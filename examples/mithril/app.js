var home = {
	controller : function() {
		home.vm.init();
	},
	view : function() {
		return m("div.main", 
			[home.vm.threads().map(function(thread){
				return m("p", [m("a[href='/thread/"+ thread.id + "']",thread.text)]);
			})
		]);
	},
	vm : {
		init : function() {
			home.vm.threads = m.request({method : "GET", url : "http://api.threaditjs.com/threads"})
				.then(function(data) {
					return data.data
				});;
		}
	}
}

var thread = {
	controller : function(){
		thread.vm.init(m.route.param("id"));
	},
	view : function(node) {
		if(!node.text) {
			node = thread.vm.thread().tree;
		}
		return m("div.comment", [
			m("p", node.text),
			m("div.reply", [m("a[href='javascript:void(0)']", "Reply")]),
			m("div.children", [
				node.children.map(
					function(child) {
						return thread.view(child);
					}
				)
			])
		]);
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
		}
	}
}


m.route.mode = "pathname";
m.route(document.body, "", {
	"/thread/:id" : thread,
	"" : home
});