var renderStage = 0

var AppComponent = ng.core.Component({selector: "my-app"})
.View({
	directives: [ng.common.CORE_DIRECTIVES],
	templateUrl: 'template.html'
})
.Class({
	constructor: function() {
		this.databases = []
		this.update()
	},
	update: function() {
		var self = this

		if (renderStage === 0) {
			renderStage = 1
		}
	},
	ngAfterViewChecked: function() {
		if (renderStage === 1) {
			renderStage = 0
		}
	},
})

document.addEventListener("DOMContentLoaded", function() {
	ng.core.enableProdMode()
	ng.platform.browser.bootstrap(AppComponent)
})
