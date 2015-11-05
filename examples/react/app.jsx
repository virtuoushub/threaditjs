var Home = React.createClass({
	getInitialState : function() {
		return {threads : []};
	},
	componentDidMount : function() {
		var self = this;
		document.title = "ThreaditJS: React | Home";
		reqwest({
			url : T.apiUrl + "/threads",
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
			url : T.apiUrl + "/threads/create",
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
	snip : T.trimTitle
});

threadsData = {};
var store = {
	loadThread : function(id) {
		var promise = reqwest({
			url : T.apiUrl + "/comments/" + id,
			crossOrigin: true
		})
		.then(function(response){
			var lookup = T.transformResponse(response).lookup;
			response.data.forEach(function(comment) {
				threadsData[comment.id] = lookup[comment.id];
			});
		});

		return promise;
	}
}


//View store, keyed on thread id
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

		//What a silly place for this.  
		document.title = "ThreaditJS: React | " + T.trimTitle(comment.text);

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
			url : T.apiUrl + "/comments/create",
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

//Router and 'Link' component
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
