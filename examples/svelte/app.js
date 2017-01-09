T.time("Setup");

var store = {
	loadThread : function(id) {
		store.currentRoot = id;

		if(store.promises[id]) {
			return store.promises[id];
		}
		store.promises[id] = reqwest({
			url : T.apiUrl + "/comments/" + id,
			crossOrigin: true
		})
		.then(function(response){
			var obj = T.transformResponse(response);
			response.data.forEach(function(comment) {
				store.threadsData[comment.id] = obj.lookup[comment.id];
			});
			return obj;
		});

		return store.promises[id];
	},
	loadHome : function() {
		var rtrn = reqwest({
			url : T.apiUrl + "/threads",
			crossOrigin: true
		}).then(function(response) {
			store.home = response.data;
			return response;
		});
		return rtrn;
	},
	newThread : function(text) {
		reqwest({
			url : T.apiUrl + "/threads/create",
			method : "post",
			crossOrigin: true,
			data : {
				text : text
			}
		})
		.then(function(response) {
			store.home.push(response.data);
			_render();
		});
	},
	newComment : function(id, text) {
		var rtrn = reqwest({
			url : T.apiUrl + "/comments/create",
			method : "post",
			crossOrigin: true,
			data : {
				text : text,
				parent : id
			}
		}).then(function(response){
			store.threadsData[id].children.push(response.data);
			_render();
		});

		return rtrn;
	},
	home : [],
	threadsData : {},
	promises : {},
	currentRoot : null
}


//Router and 'Link' component
var router = new Grapnel({pushState : true});


router.get("/", function(req) {
	document.title = "ThreaditJS: Svelte | Home";
	// ReactDOM.render(<Loading/>, document.querySelector(".main"));
	T.timeEnd("Setup");

	store.loadHome()
	.then(function(){
		new ThreadList({
			target: document.querySelector(".main"),
			data: {
				threads: store.home
			}
		});
	});
});

var threads = {};

router.get("/thread/:id", function(req) {
	// ReactDOM.render(<Loading/>, document.querySelector(".main"));
	T.timeEnd("Setup");
	
	var id = req.params.id;	
	
	store.loadThread(req.params.id)
	.then(function() {
		document.title = "ThreaditJS: Svelte | " + T.trimTitle(
			store.threadsData[store.currentRoot].text
		);
		T.timeComments("Thread render", store.threadsData[store.currentRoot].comment_count);
		new ThreadComment({
			target: document.querySelector(".main"),
			data: {
				comment: store.threadsData[store.currentRoot]
			}
		});
	});
});