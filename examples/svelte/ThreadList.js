var ThreadList = (function () { 'use strict';

var template = (function () {
	return {
		components: {
			ThreadItem
		}
	};
}());

function renderMainFragment ( root, component, target ) {
	var eachBlock_0_anchor = document.createComment( "#each threads" );
	target.appendChild( eachBlock_0_anchor );
	
	var eachBlock_0_value = root.threads;
	var eachBlock_0_fragment = document.createDocumentFragment();
	var eachBlock_0_iterations = [];
	
	for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
		eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
	}
	
	eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
	
	var text = document.createTextNode( "\n\n" );
	target.appendChild( text );
	
	var form = document.createElement( 'form' );
	
	var textarea = document.createElement( 'textarea' );
	
	form.appendChild( textarea )
	
	form.appendChild( document.createTextNode( "\n\t" ) );
	
	var input = document.createElement( 'input' );
	input.type = "submit";
	input.value = "Post!";
	
	form.appendChild( input )
	
	target.appendChild( form )

	return {
		update: function ( changed, root ) {
			var eachBlock_0_value = root.threads;
			
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
			if ( detach ) eachBlock_0_anchor.parentNode.removeChild( eachBlock_0_anchor );
			
			for ( var i = 0; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( detach );
			}
			
			if ( detach ) text.parentNode.removeChild( text );
			
			if ( detach ) form.parentNode.removeChild( form );
			
			
			
			
		}
	};
}

function renderEachBlock_0 ( root, eachBlock_0_value, thread, thread__index, component, target ) {
	var threadItem_initialData = {
		thread: thread
	};
	
	var threadItem = new template.components.ThreadItem({
		target: target,
		parent: component,
		data: threadItem_initialData
	});

	return {
		update: function ( changed, root, eachBlock_0_value, thread, thread__index ) {
			var thread = eachBlock_0_value[thread__index];
			
			var threadItem_changes = {};
			
			if ( 'threads' in changed ) threadItem_changes.thread = thread;
			
			if ( Object.keys( threadItem_changes ).length ) threadItem.set( threadItem_changes );
		},

		teardown: function ( detach ) {
			threadItem.teardown( true );
		}
	};
}

function ThreadList ( options ) {
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

return ThreadList;

}());