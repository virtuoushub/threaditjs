T.time("Setup");

//React views, which map given props to DOM state.  
var Home = React.createClass({
	render : function() {
		if(this.props.threads.length == 0) {
			return <h2>Loading...</h2>
		}

		return (<div className="thread_list">
			{this.props.threads.map(function(thread){
				return <ThreadListItem key={thread.id} {...thread}/>;
			})}
			<form onSubmit={this.handleSubmit}>
				<textarea ref="text"></textarea>
				<input type="submit" value="Post!"/>
			</form>
		</div>);
	},
	handleSubmit : function(event) {
		event.preventDefault();
		var text = this.refs.text.value;
		store.newThread(text);
		this.refs.text.value = "";
	}
});

var ThreadListItem = React.createClass({
	render : function() {
		return (
			<div key={this.props.id}>
				<p className="thread_title"><Link to={"/thread/" + this.props.id}>{this.snip(this.props.text)}</Link></p>
				<p className="comment_count">{this.props.comment_count} comment(s)</p>
				<hr/>
			</div>
		);
	},
	snip : T.trimTitle
});

var Thread = React.createClass({
	getInitialState : function() {
		return {
			replying: false
		};
	},
	render : function() {
		var comment = this.props.comment;		

		var children = comment.children.map(function(child) {
			return <Thread key={child.id} comment={child}/>			
		});
		return (
			<div className="comment">
				<p dangerouslySetInnerHTML={{__html: comment.text}}></p>
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
		
		store.newComment(this.props.comment.id, text)
		.then(function(response) {
			self.refs.text.value = "";
			self.setState({
				replying : false
			});
		});
	},
	componentDidMount : function() {
		if(this.props.root) {				
			//http://stackoverflow.com/questions/26556436/react-after-render-code
			window.requestAnimationFrame(function(){
				T.timeEnd("Thread render");
			});
		}
	}
});

//The following code is not related to React code, and in fact constitutes a somewhat awkward attempt to
//keep this solely a React example, showing off React the view layer.  

//Any of my arguably poor decisions here should not count against React.  

//For instance, instead of doing a Redux-style dispatch when telling React to 'render' (really, telling 
//React to engage its diff and paint if necessary), a global render method is called.  While React does
//have a philosophy encouraging this re-rendering, it could be accomplished in a more elegant fashion.

//For instance, one can imagine the Backbone Collection standing in for this store code very easily, triggering renders
//on Collection events.  
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

var Loading = React.createClass({
	render : function() {
		return <h2>Loading... </h2>
	}
});

var Error = React.createClass({
	render : function() {
		return <h2>Error!  Try refreshing!</h2>
	}
});

//Router and 'Link' component
var router = new Grapnel({pushState : true});

var Link = React.createClass({
	render : function() {
		//the href allows those mobile browsers that aren't getting onclick events to at least see threads.
		return <a href={this.props.to} onClick={this.navigate} {...this.props}/>
	},
	navigate : function(event) {
		event.preventDefault();
		router.navigate(this.props.to);
	}
});

var showError = function() {
	ReactDOM.render(<Error/>, document.querySelector(".main"));
}

var _currentView;
var _render = function() {
	ReactDOM.render(_currentView(), document.querySelector(".main"));
}
router.get("/", function(req) {
	document.title = "ThreaditJS : React | Home";
	ReactDOM.render(<Loading/>, document.querySelector(".main"));
	T.timeEnd("Setup");

	store.loadHome()
	.then(function(){
		_currentView = function() {
			return <Home threads={store.home}/>
		}
		_render();
	})
	.fail(showError);;
});

var threads = {};

router.get("/thread/:id", function(req) {
	ReactDOM.render(<Loading/>, document.querySelector(".main"));
	T.timeEnd("Setup");
	
	var id = req.params.id;	
	
	store.loadThread(req.params.id)
	.then(function() {
		document.title = "ThreaditJS: React | " + T.trimTitle(
			store.threadsData[store.currentRoot].text
		);
		T.time("Thread render");
		_currentView = function() {
			return <Thread comment={store.threadsData[store.currentRoot]} root="true"/>;
		}
		_render();
	})
	.fail(showError);
});