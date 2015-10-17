var threaditApp = angular.module('threaditApp', [
	"ngRoute",
	"threaditControllers",
	"commentServices"
]);

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

			$locationProvider.html5Mode(true);
	}]);


var threaditControllers = angular.module("threaditControllers", []);

threaditControllers.controller("ThreadListCtrl", ["$scope", "Home", 
	function($scope, Home) {
		$scope.threads = Home.query();
		$scope.trimTitle = function(str) {
			if(str.length>120) {
				return str.substr(0, 120) + "...";
			}
			return str;
		}

		$scope.create = function(post) {
			var request = Home.save({text: post.text})

			request.$promise.then(function(data){
				$scope.newpost.text = "";
				$scope.threads.push(data.data);
			});
		};
	}
]);

var dumb;


threaditControllers.controller("CommentsCtrl", ["$scope", "$routeParams", "Comment", 
	function($scope, $routeParams, Comment) {
		$scope.comment = Comment.query({id: $routeParams.id});

		dumb = $scope;

		$scope.createResponseOn = function(node) {
			var request=Comment.save({
				parent: node.id,
				text: node.reply_text
			});

			request.$promise.then(function(data) {
				node.reply_text = "";
				node.replying = false;
				$scope.addComment(data.data)
			});
		};

		$scope.addComment = function(comment) {
			$scope.comment.nodes[comment.parent_id].children.push(comment);
			$scope.comment.nodes[comment.id] = comment;
		}
	}
]);

var commentServices = angular.module("commentServices", ["ngResource"]);

commentServices.factory("Home", ["$resource", 
	function($resource) {
		return $resource("http://api.local.threaditjs.com/threads",
			{},
			{
				query: {
					isArray: true,
				transformResponse : function(data) {
					data = angular.fromJson(data);

					return data.data;
				}
			},
			save : {
				url : "http://api.local.threaditjs.com/threads/create",
				method: "POST"
			}
			}
		);
	}
]);


commentServices.factory("Comment", ["$resource",
	function($resource) {
		return $resource("http://api.local.threaditjs.com/comments/:id",
			{},
			{
				query: {
					isArray: false,
				transformResponse : function(data) {
					comments = angular.fromJson(data).data;

					var map = {};

					var root;
					for(var i = 0; i < comments.length; i++) {
						map[comments[i].id] = comments[i];
						if(!comments[i].parent_id) {
							root = comments[i];
						}
					}

					var ids;
					for(var i = 0; i < comments.length; i++) {
						ids = comments[i].children;
						comments[i].children = [];
						for(var j = 0; j < ids.length; j++) {
							comments[i].children.push(map[ids[j]]);
						}
					}

					return {nodes: map, tree: [root]};
				}
			},
			save : {
				url : "http://api.local.threaditjs.com/comments/create",
				method: "POST"
			}
			}
		);
	}
]);

