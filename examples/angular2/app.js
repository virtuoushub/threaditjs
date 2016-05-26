var Thread = ng.core.Class({
	constructor: function(id, text, children, commentCount) {
		this.id = id
		this.text = text
		// this.children = children
		this.commentCount = commentCount
	}
})

var ThreadList = [
	new Thread(1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', [], 1234),
	new Thread(2, 'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,', [], 2345),
	new Thread(3, 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo', [], 3456),
	new Thread(4, 'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse', [], 4567),
	new Thread(5, 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non', [], 5678),
	new Thread(6, 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', [], 6789)
]

var AppComponent = ng.core.Component({selector: "my-app"})
.View({
	directives: [ng.common.CORE_DIRECTIVES],
	templateUrl: 'template.html'
})
.Class({
	constructor: function() {
		this.threads = ThreadList
		this.trimTitle = T.trimTitle;
	},
	ngAfterViewChecked: function() {

	}
})

document.addEventListener("DOMContentLoaded", function() {
	ng.core.enableProdMode()
	ng.platform.browser.bootstrap(AppComponent)
})

