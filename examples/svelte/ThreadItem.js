var ThreadItem = (function () { 'use strict';

var template = (function () {
	return {
		helpers: {
			trimTitle: T.trimTitle
		}
	};
}());

function renderMainFragment ( root, component, target ) {
	var p = document.createElement( 'p' );
	
	var a = document.createElement( 'a' );
	a.href = "/thread/" + ( root.thread.id );
	
	var text = document.createTextNode( template.helpers.trimTitle(root.thread.text) );
	a.appendChild( text );
	
	p.appendChild( a )
	
	target.appendChild( p )
	
	var text1 = document.createTextNode( "\n" );
	target.appendChild( text1 );
	
	var p1 = document.createElement( 'p' );
	p1.className = "comment_count";
	
	var text2 = document.createTextNode( root.thread.comment_count );
	p1.appendChild( text2 );
	
	p1.appendChild( document.createTextNode( " comment(s)" ) );
	
	target.appendChild( p1 )
	
	var text4 = document.createTextNode( "\n" );
	target.appendChild( text4 );
	
	var hr = document.createElement( 'hr' );
	
	target.appendChild( hr )

	return {
		update: function ( changed, root ) {
			a.href = "/thread/" + ( root.thread.id );
			
			text.data = template.helpers.trimTitle(root.thread.text);
			
			text2.data = root.thread.comment_count;
		},

		teardown: function ( detach ) {
			if ( detach ) p.parentNode.removeChild( p );
			
			
			
			if ( detach ) text1.parentNode.removeChild( text1 );
			
			if ( detach ) p1.parentNode.removeChild( p1 );
			
			if ( detach ) text4.parentNode.removeChild( text4 );
			
			if ( detach ) hr.parentNode.removeChild( hr );
		}
	};
}

function ThreadItem ( options ) {
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

	var mainFragment = renderMainFragment( state, this, options.target );
}

return ThreadItem;

}());