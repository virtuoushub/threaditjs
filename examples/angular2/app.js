var AppComponent = ng.core.Component({selector: "my-app"})
.View({
	directives: [ng.common.CORE_DIRECTIVES],
	templateUrl: 'template.html'
})
.Class({
	constructor: function() {
		this.update()
	},
	update: function() {
		var self = this

	},
	ngAfterViewChecked: function() {

	},
})

document.addEventListener("DOMContentLoaded", function() {
	ng.core.enableProdMode()
	ng.platform.browser.bootstrap(AppComponent)
})
