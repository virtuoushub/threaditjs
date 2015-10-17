var threadit = {};




threadit.controller = function() {
	threadit.vm.init();
}

threadit.view = function() {

}

var Comment = function(data) {
	this.id = m.prop(data.id)
	this.text = m.prop(data.text);
	this.children = m.prop(
}

Comment.home = function(data) {
	return m.request({method : "GET", url : "http://api.threaditjs.com/threads", data: data});
}

Comment.makeThread = function(data) {
	return m.request({method: "POST", url: "http://api.threaditjs.com/threads/create", data: data});
}

m.route(document.body, "/" {
	"/" : home,
	"/thread/:id" : thread
});