T.time("Setup");

var api = {
	fetchThreads: function(done) {
		T.timeEnd("Setup");
		var oReq = new XMLHttpRequest();
		oReq.onload = function() {
			switch (oReq.status) {
				case 500:
					this.Element.innerHTML = '<h2>Error!  Try refreshing.</h2';
					break;
				case 404:
					this.Element.innerHTML = "<h2>Not found!  Don't try refreshing!</h2";
					break;
				case 200:
					this.threads = JSON.parse(oReq.responseText).data;
					done();
					break;
			}
		}.bind(this);
		oReq.open("GET", T.apiUrl + "/threads/", true);
		oReq.send();		
	},
	fetchThread: function(done) {
		T.timeEnd("Setup");
		var id = this.Route.params.id;
		var oReq = new XMLHttpRequest();
		oReq.onload = function() {
			switch (oReq.status) {
				case 500:
					this.Element.innerHTML = '<h2>Error!  Try refreshing.</h2';
					break;
				case 404:
					this.Element.innerHTML = "<h2>Not found!  Don't try refreshing!</h2";
					break;
				case 200:
					var thread = JSON.parse(oReq.responseText);
					this.thread = T.transformResponse(thread);
					done();
					break;
			}			
		}.bind(this);
		oReq.open("GET", T.apiUrl + "/comments/" + id, true);
		oReq.send();	
	},
	newThread: function(text, done) {
		var formData = 'text=' + text;
		console.log(text);
		var oReq = new XMLHttpRequest();
		oReq.onload = function() {
			if (oReq.status !== 200) return;
			var thread = JSON.parse(oReq.responseText).data;
			this.threads.push(thread);
			done();

		}.bind(this);
		oReq.open("POST", T.apiUrl + "/threads/create", true);
		oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		oReq.send(formData);
	},
	newComment: function(text, parent, done) {
		var comment = this.newTomment;
		var formData = 'text=' + text + '&parent=' + parent;

		var oReq = new XMLHttpRequest();
		oReq.onload = function() {
			if (oReq.status !== 200) return;
			var comment = JSON.parse(oReq.responseText).data;
			done(comment);
			
		}.bind(this);
		oReq.open("POST", T.apiUrl + "/comments/create", true);
		oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		oReq.send(formData);
	},
};

var components = {
	threads: function(el) {
		el.innerHTML = '';

		var renderThread = function(thread) {
			var p = document.createElement('p');
				var a = document.createElement('a');
				a.href = '/#/thread/' + thread.id;
				a.innerHTML = T.trimTitle(thread.text);
				p.appendChild(a);

			el.appendChild(p);

			var p_comment_count = document.createElement('p');
			p_comment_count.className = 'comment_count';
			p_comment_count.textContent = thread.comment_count + " comment" + (thread.comment_count > 1 ? 's' : '');
			el.appendChild(p_comment_count);

			var hr = document.createElement('hr');
			el.appendChild(hr);
		};

		this.threads.forEach(renderThread, this);
	},
	newThread: function(el, render) {
		el.onsubmit = function(e) {
			e.preventDefault();
			var text = el.text.value.trim();
			if (text === '') return;
			render(function(done) {
				api.newThread.call(this, text, function() {
					el.text.value = '';
					done();
				});
			});

		};
	},
	thread: function(el, render) {
		var thread = this.thread;

		var renderComment = function(parentEl, node) {
			var div = document.createElement('div');
			div.className = 'comment';

				var p = document.createElement('p');
				p.innerHTML = node.text;
				div.appendChild(p);

				var reply = document.createElement('div');
				reply.className = 'reply';
					var form = document.createElement('form');
					form.style.display = 'none';
					form.onsubmit = function(e) {
						e.preventDefault();
						var text = textarea.value.trim();
						if (text === '') return;
 						render(function(done) {
							var parent = node.id;
							api.newComment.call(this, text, parent, function(comment) {
								node.children.push(comment);
								textarea.value = '';
								done();
							});
						});

					};
						var textarea = document.createElement('textarea');
						textarea.oninput = function(e) {
							preview.innerHTML = T.previewComment(e.target.value);
						};
						form.appendChild(textarea);

						var input = document.createElement('input');
						input.type = 'submit';
						input.value = 'Reply!';
						form.appendChild(input);

						var preview = document.createElement('div');
						preview.className = 'preview';
						form.appendChild(preview);

					reply.appendChild(form);

					var a = document.createElement('a');
					a.textContent = 'Reply!';
					a.onclick = function(e) {
						e.preventDefault();
						form.style.display = '';
						a.style.display = 'none';
					};
					reply.appendChild(a);


				div.appendChild(reply);

				var children = document.createElement('div');
				children.className = 'children';
				
					node.children.forEach(function(child) {
						renderComment(children, child);
					});

				div.appendChild(children);

			parentEl.appendChild(div);
		};

		el.innerHTML = '';
		T.time("Thread render");
		renderComment(el, thread.root);
		T.timeEnd("Thread render");
	},
};

var templates = {
	home: document.querySelector('script#home').innerHTML,
	thread: document.querySelector('script#thread').innerHTML,
};

var loading = function() {
	this.Element.innerHTML = '<h2>Loading</h2>';
};

var routes = [
	{
		name: 'home',
		path: '/',
		fn: [
			loading,
			api.fetchThreads,
			function() {
				document.title = "ThreaditJS: Azalea | Home";
				this.Element.innerHTML = templates.home;
			},
		]
	},
	{
		name: 'thread',
		path: '/thread/:id',
		fn: [
			loading,
			api.fetchThread,
			function() {
				document.title = "ThreaditJS: Azalea | " + T.trimTitle(this.thread.root.text);
				this.Element.innerHTML = templates.thread;
			},
		]
	},	
];

var context = {
	threads: [],
	thread: null,
};

azalea.call(context, components, routes);