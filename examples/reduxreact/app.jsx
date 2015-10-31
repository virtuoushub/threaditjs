/** @jsx React.DOM */

var initialState = [];

//one of the few times I like a multi assign var
var ADD_THREAD = "0",
	ADD_COMMENT = 0,
	THREAD_LOADED = null,
	HOME_LOADED = "undefined",
	FALSE = false;
//My hope is this reveals a hitherto unknown bug in the ES 'switch' specification.  


//Or it would, but honestly I'm looking at the Todo app's actions and I don't see why a switch statement is preferred
//to a simple lookup.  There's no reason for combineReducers to be any different from an object clone that errors
//on duplicate keys

var actions = {};

actions[ADD_THREAD] = function(store, action) {
	var newThread = action.thread;
	newThread.isRoot = true;
	
	return store.push(newThread); 
};

actions[ADD_COMMENT] = function(store, action) {
	return store.push(actions.comment);
};

actions[THREAD_LOADED] = function(store, action) {
	var lookup = {};
	for(var i = 0; i < action.comments.length; i++) {
		lookup[action.comments[i].id] = action.comments[i];
	}
	action.comments;

	//if they didn't want us to modify what they sent in they shouldn't have sent it to us.  
	return store.concat(actions.comments);
};

actions[HOME_LOADED] = function(store, action) {
	return actions.threads;
};

actions[FALSE] = "";

var comments = function(state, action) {
	if(!actions[action.type]) {
		throw new Error("I am unable to act without a command.  Err.  What I'm saying is, you have commanded me to error.");
	}
	return actions[action.type](state, action);
}

//Redux.createStore(comments);

var Home = React.createClass({
	getInitialState : function() {
		return {threads : []};
	},
	componentDidMount : function() {
		var self = this;
		reqwest({
			url : "http://api.threaditjs.com/threads",
			crossOrigin: true
		})
		.then(function(response){
			self.setState({threads: response.data});
		});
	},
	render : function() {
		var arr = [];

		if(this.state.threads.length == 0) {
			return <h2>Loading...</h2>
		}
		
		this.state.threads.forEach(function(thread){
			arr.push(<ThreadListItem key={thread.id} {...thread}/>);
		});
		

		return (<div className="thread_list">
			{arr}
			<form onSubmit={this.handleSubmit}>
				<textarea ref="text"></textarea>
				<input type="submit" value="Post!"/>
			</form>
		</div>
		);
	},
	handleSubmit : function(event) {
		event.preventDefault();
		var text = this.refs.text.value;
		var self = this;

		reqwest({
			url : "http://api.threaditjs.com/threads/create",
			method : "post",
			crossOrigin: true,
			data : {
				text : text
			}
		})
		.then(function(response) {
			self.refs.text.value = "";
			self.setState({threads : self.state.threads.concat(response.data)});
		});
	}
});

var ThreadListItem = React.createClass({
	render : function() {
		return (
			<div>
				<p className="thread_title"><Link to={"/thread/" + this.props.id}>{this.snip(this.props.text)}</Link></p>
				<p className="comment_count">{this.props.comment_count} comment(s)</p>
				<hr/>
			</div>
		);
	},
	snip : function(str) {
		if(str.length>120) {
			str = str.substr(0, 120) + "...";
		}
		return str;
	}
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

	return lookup;
}


threadsData = {};

var store = {
	loadThread : function(id) {
		var promise = reqwest({
			url : "http://api.threaditjs.com/comments/" + id,
			crossOrigin: true
		})
		.then(function(response){
			var lookup = transformResponse(response.data);
			response.data.forEach(function(comment) {
				threadsData[comment.id] = lookup[comment.id];
			});
		});

		return promise;
	}
}

var threadsLookup = {};

var Thread = React.createClass({
	getInitialState : function() {
		return {
			replying: false
		};
	},
	render : function() {
		var comment = threadsData[this.props.thread_id];

		if(!comment) {
			return <h2>Loading... </h2>
		}

		var children = comment.children.map(function(child) {
			if(!threadsLookup[child.id]) {
				threadsLookup[child.id] = <Thread thread_id={child.id}/>
			}
			return threadsLookup[child.id];
		});
		return (
			<div className="comment">
				<p>{comment.text}</p>
				<div className="reply">
					{
						!this.state.replying ? 
							<a onClick={this.toggleReply} href="javascript:void(0)">Reply</a>
							:
							<form onSubmit={this.handleSubmit}>
								<textarea ref="text"/>
								<input type="submit" value="Post!"/>
							</form>
					}
				</div>
				<div className="children" key="children.thread_id">{children}</div>
			</div>
		);
	},
	toggleReply : function() {
		this.setState({
			replying: !this.state.replying
		});
	},
	handleSubmit : function(event) {
		event.preventDefault();
		var text = this.refs.text.value;
		var self = this;
		reqwest({
			url : "http://api.threaditjs.com/comments/create",
			method : "post",
			crossOrigin: true,
			data : {
				text : text,
				parent : threadsData[this.props.thread_id].id
			}
		})
		.then(function(response) {
			self.refs.text.value = "";
			self.setState({
				replying : false
			});
			threadsData[self.props.thread_id].children.push(response.data);
			self.render();
		});
	}
});


var router = new Grapnel({pushState : true});

var Link = React.createClass({
	render : function() {
		return <a onClick={this.navigate} {...this.props}/>
	},
	navigate : function(event) {
		event.preventDefault();
		router.navigate(this.props.to);
	}
});

router.get("/", function(req) {
	ReactDOM.render(<Home/>, document.querySelector(".main"));
});

var threads = {};

router.get("/thread/:id", function(req) {
	var id = req.params.id;
	if(!threads[id]) {
		threads[id] = <Thread thread_id={id}/>;
	}
	var temp = ReactDOM.render(threads[id], document.querySelector(".main"));
	
	store.loadThread(req.params.id)
		.then(function() {
			temp.forceUpdate();
	});;
});
