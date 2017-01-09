var ThreadComment = (function () { 'use strict';

var template = (function () {
	return {
		components: {
			ThreadComment
		}
	}
}());

function renderMainFragment ( root, component, target ) {
	var div = document.createElement( 'div' );
	div.className = "comment";
	
	var p = document.createElement( 'p' );
	
	var text = document.createTextNode( root.comment.text );
	p.appendChild( text );
	
	div.appendChild( p )
	
	div.appendChild( document.createTextNode( "\n\n\t" ) );
	
	var div1 = document.createElement( 'div' );
	div1.className = "reply";
	
	var a = document.createElement( 'a' );
	a.href = "javascript:void(0)";
	
	a.appendChild( document.createTextNode( "Reply" ) );
	
	div1.appendChild( a )
	
	div.appendChild( div1 )
	
	div.appendChild( document.createTextNode( "\n\n\t" ) );
	
	var div2 = document.createElement( 'div' );
	div2.className = "children";
	
	var eachBlock_0_anchor = document.createComment( "#each comment.children" );
	div2.appendChild( eachBlock_0_anchor );
	
	var eachBlock_0_value = root.comment.children;
	var eachBlock_0_fragment = document.createDocumentFragment();
	var eachBlock_0_iterations = [];
	
	for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
		eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
	}
	
	eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
	
	div.appendChild( div2 )
	
	target.appendChild( div )

	return {
		update: function ( changed, root ) {
			text.data = root.comment.text;
			
			var eachBlock_0_value = root.comment.children;
			
			for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
				if ( !eachBlock_0_iterations[i] ) {
					eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
				} else {
					eachBlock_0_iterations[i].update( changed, root, eachBlock_0_value, eachBlock_0_value[i], i );
				}
			}
			
			for ( var i = eachBlock_0_value.length; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( true );
			}
			
			eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
			eachBlock_0_iterations.length = eachBlock_0_value.length;
		},

		teardown: function ( detach ) {
			if ( detach ) div.parentNode.removeChild( div );
			
			
			
			
			
			
			
			
			
			for ( var i = 0; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( false );
			}
		}
	};
}

function renderEachBlock_0 ( root, eachBlock_0_value, child, child__index, component, target ) {
	var threadComment_initialData = {
		comment: child
	};
	
	var threadComment = new template.components.ThreadComment({
		target: target,
		parent: component,
		data: threadComment_initialData
	});

	return {
		update: function ( changed, root, eachBlock_0_value, child, child__index ) {
			var child = eachBlock_0_value[child__index];
			
			var threadComment_changes = {};
			
			if ( 'undefined' in changed ) threadComment_changes.comment = child;
			
			if ( Object.keys( threadComment_changes ).length ) threadComment.set( threadComment_changes );
		},

		teardown: function ( detach ) {
			threadComment.teardown( true );
		}
	};
}

function ThreadComment ( options ) {
	var component = this;
	var state = options.data || {};

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	var callbacks = Object.create( null );

	function dispatchObservers ( group, newState, oldState ) {
		for ( var key in group ) {
			if ( !( key in newState ) ) continue;

			var newValue = newState[ key ];
			var oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}

	this.fire = function fire ( eventName, data ) {
		var handlers = eventName in callbacks && callbacks[ eventName ].slice();
		if ( !handlers ) return;

		for ( var i = 0; i < handlers.length; i += 1 ) {
			handlers[i].call( this, data );
		}
	};

	this.get = function get ( key ) {
		return key ? state[ key ] : state;
	};

	this.set = function set ( newState ) {
		var oldState = state;
		state = Object.assign( {}, oldState, newState );
		
		dispatchObservers( observers.immediate, newState, oldState );
		if ( mainFragment ) mainFragment.update( newState, state );
		dispatchObservers( observers.deferred, newState, oldState );
		
		while ( this.__renderHooks.length ) {
			var hook = this.__renderHooks.pop();
			hook.fn.call( hook.context );
		}
	};

	this.observe = function ( key, callback, options ) {
		var group = ( options && options.defer ) ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );

		if ( !options || options.init !== false ) {
			callback.__calling = true;
			callback.call( component, state[ key ] );
			callback.__calling = false;
		}

		return {
			cancel: function () {
				var index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	this.on = function on ( eventName, handler ) {
		var handlers = callbacks[ eventName ] || ( callbacks[ eventName ] = [] );
		handlers.push( handler );

		return {
			cancel: function () {
				var index = handlers.indexOf( handler );
				if ( ~index ) handlers.splice( index, 1 );
			}
		};
	};

	this.teardown = function teardown ( detach ) {
		this.fire( 'teardown' );

		mainFragment.teardown( detach !== false );
		mainFragment = null;

		state = {};
	};

	this.__renderHooks = [];
	
	var mainFragment = renderMainFragment( state, this, options.target );
	
	while ( this.__renderHooks.length ) {
		var hook = this.__renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

return ThreadComment;

}());