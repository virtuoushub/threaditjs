// /** @jsx React.DOM */

// var initialState = [];

// //one of the few times I like a multi assign var
// var ADD_THREAD = "0",
// 	ADD_COMMENT = 0,
// 	THREAD_LOADED = null,
// 	HOME_LOADED = "undefined",
// 	FALSE = false;
// //My hope is this reveals a hitherto unknown bug in the ES 'switch' specification.  


// //Or it would, but honestly I'm looking at the Todo app's actions and I don't see why a switch statement is preferred
// //to a simple lookup.  There's no reason for combineReducers to be any different from an object clone that errors
// //on duplicate keys

// var actions = {};

// actions[ADD_THREAD] = function(store, action) {
// 	var newThread = action.thread;
// 	newThread.isRoot = true;
	
// 	return store.push(newThread); 
// };

// actions[ADD_COMMENT] = function(store, action) {
// 	return store.push(actions.comment);
// };

// actions[THREAD_LOADED] = function(store, action) {
// 	var lookup = {};
// 	for(var i = 0; i < action.comments.length; i++) {
// 		lookup[action.comments[i].id] = action.comments[i];
// 	}
// 	action.comments;

// 	//if they didn't want us to modify what they sent in they shouldn't have sent it to us.  
// 	return store.concat(actions.comments);
// };

// actions[HOME_LOADED] = function(store, action) {
// 	return actions.threads;
// };

// actions[FALSE] = "";

// var comments = function(state, action) {
// 	if(!actions[action.type]) {
// 		throw new Error("I am unable to act without a command.  Err.  What I'm saying is, you have commanded me to error.");
// 	}
// 	return actions[action.type](state, action);
// }

// //Redux.createStore(comments);

// var Link = React.createClass({
// 	render : function() {
// 		console.log(this.props);
// 		return <p onClick={this.navigate} href={this.props.to}/>
// 	},
// 	navigate : function() {
// 		console.log('um');
// 		router.navigate(this.props.to);

// 		return false;
// 	}

// })


// var Main = React.createClass({
// 	render : function() {
// 		return <div><h1>pls</h1>({this.props.children})</div>;
// 	}
// })

// var Home = React.createClass({
// 	render : function() {
// 		return (<div>
// 			<h1>Hi</h1>
// 			<p><Link to="/thread/33232">things</Link></p>
// 			</div>
// 		);
// 	}
// });

// var Thread = React.createClass({

// 	componentDidMount : function() {
// 		this.setState({
// 			thread : 5
// 		});
// 	},
// 	render : function() {
// 		return (
// 			<h2>Thing {this.state.thread}</h2>
// 		)
// 	}
// });

// var router = new Grapnel({pushState : true});

// router.get("/", function(req) {
// 	ReactDOM.render(<Home/>, document.querySelector(".main"));
// });

// router.get("/thread/:id", function(req) {
// 	ReactDOM.render(<Thread thread_id={req.params.id}/>, document.querySelector(".main"));
// });



