//The definition of the application, and its submodules.
var threaditApp = angular.module("threaditApp", [
	"ngRoute",
	"threaditControllers",
	"commentServices"
]);

//The .when imitation of promise syntax is unique across SPA routers so far as I know.
threaditApp.config(["$routeProvider", "$locationProvider",
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when("/", {
				templateUrl : "thread-list.html",
				controller : "ThreadListCtrl"
			})
			.when("/thread/:id", {
				templateUrl : "comments.html",
				controller : "CommentsCtrl"
			})
			.otherwise({
				redirectTo: "/"
			});

			//No more # in the url
			$locationProvider.html5Mode(true);
	}
]);

//The last time I had touched Angular, it relied on controllers being global functions.  
//Now they're registered with angular.module calls.  Much improved.  
var threaditControllers = angular.module("threaditControllers", []);

threaditControllers.controller("ThreadListCtrl", ["$scope", "Home",
	function($scope, Home) {

		//Link to the resource.  
		$scope.threads = Home.query();

		//This makes the helper accessible in the template
		$scope.trimTitle = T.trimTitle;

		//The handler for the submit event
		$scope.create = function(post) {
			var request = Home.save({text: post.text});

			//Access the resolution of the async call
			request.$promise.then(function(data){
				$scope.newpost.text = "";//reset the form to an empty state
				$scope.threads.push(data.data);
			});
		};
	}
]);

threaditApp.filter("trust", ["$sce", function($sce) {
	return function(html) {
		return $sce.trustAsHtml(html);
	}
}]);

threaditControllers.controller("CommentsCtrl", ["$scope", "$routeParams", "Comment", 
	function($scope, $routeParams, Comment) {
		$scope.comment = Comment.query({id: $routeParams.id});

		$scope.previewComment = T.previewComment;


		//Handle submit event  
		//This time, note that the template is passing the actual object being responded to.  
		$scope.createResponseOn = function(node) {
			var request=Comment.save({
				parent: node.id,
				text: node.reply_text
			});
			
			//This is an unclean hack if you ask me.   
			request.$promise.then(function(data) {
				node.reply_text = "";
				node.replying = false;
				$scope.addComment(data.data);
			});
		};

		//Convenience function for above.  
		$scope.addComment = function(comment) {
			$scope.comment.lookup[comment.parent_id].children.push(comment);
			$scope.comment.lookup[comment.id] = comment;
		};
	}
]);

var commentServices = angular.module("commentServices", ["ngResource"]);

//For all the jokes about what a resource, a factory, and a service is, Angular allowed me to
// accomplish the configuration of my API so succintly
//that I'm still really confused why I ever bothered with Ember Data.  
commentServices.factory("Home", ["$resource", 
	function($resource) {
		return $resource(T.apiUrl + "/threads",
			{},//defaults
			{
				query: {
					isArray: true,
					transformResponse : function(data) {
						data = angular.fromJson(data);
						return data.data;
					}
				},
				save : {
					url : T.apiUrl + "/threads/create",
					method: "POST"
				}
			}
		);
	}
]);

commentServices.factory("Comment", ["$resource",
	function($resource) {
		return $resource(T.apiUrl + "/comments/:id",
			{},
			{
				query: {
					isArray: false,
					transformResponse : function(response) {
						comments = T.transformResponse(angular.fromJson(response));
						//Makes the root node look omre like a 'children' array
						comments.root = [comments.root];
						return comments;
					}
				},
				save : {
					url : T.apiUrl + "/comments/create",
					method: "POST"
				}
			}
		);
	}
]);