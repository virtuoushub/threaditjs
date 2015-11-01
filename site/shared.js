(function() {

	var titleTrimLength = 120;
	var apiRoot = "http://api.threaditjs.com";
	var exports = {
		trimTitle : function(str, optionalLength) {
			if(!optionalLength) {
				optionalLength = titleTrimLength;
			}
			if(str.length>optionalLength) {
				str = str.substr(0,optionalLength) + "...";
			}
			return str;
		},
		transformResponse : function(response) {
			comments = response.data;
			var lookup = {};

			var root;
			for(var i = 0; i < comments.length; i++) {
				lookup[comments[i].id] = comments[i];
				if(!comments[i].parent_id) {
					root = comments[i];
				}
			}

			var ids;
			for(i = 0; i < comments.length; i++) {
				ids = comments[i].children;
				comments[i].children = [];
				for(var j = 0; j < ids.length; j++) {
					comments[i].children.push(lookup[ids[j]]);
				}
			}
			return {root : root, lookup : lookup};
		},
		apiUrl : apiRoot,
		apiUrlSlash : apiRoot + "/"
	};

	//Intended for use only in the browser or, if you really wanted to for some reason, CommonJS
	if(typeof module === "undefined") {
		window.T = exports;
	}
	else {
		module.exports = exports;
	}

})();