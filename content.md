### ThreaditJS is an example application for SPA libraries/frameworks.  

For news, please follow [@ThreaditJS](http://twitter.com/threaditjs).  

---

This page collects implementations of a thread-based discussion application all interacting with the same API.  The intent is to provide side-by-side comparisons for tasks every ES2015 client application will necessarily complete.  It should be considered a friendly competitor to TodoMVC.  

The main application shows a list of threads similar to a well known Internet discussion forum.  The user can create a new thread, display a thread's comments, and respond to a specific comment.  

---

## Current Mobile Performance Comparison

[See here](https://koglerjs.com/verbiage/performance) for some preliminary results.  

---

## Implementation list

Currently, I have:

* [Angular](http://angular.threaditjs.com) | [Source](https://github.com/koglerjs/threaditjs/tree/master/examples/angular)
* [Backbone](http://backbone.threaditjs.com) | [Source](https://github.com/koglerjs/threaditjs/tree/master/examples/backbone)
* [Ember](http://ember.threaditjs.com) | [Source](https://github.com/koglerjs/threaditjs/tree/master/examples/ember)
* [Mithril](http://mithril.threaditjs.com) | [Source](https://github.com/koglerjs/threaditjs/tree/master/examples/mithril)
* [React](http://react.threaditjs.com) | [Source](https://github.com/koglerjs/threaditjs/tree/master/examples/react)
* [Vue](http://vue.threaditjs.com) | [Source](https://github.com/koglerjs/threaditjs/tree/master/examples/vue)

I have also accepted pull requests for:

* [Azalea](http://azalea.threaditjs.com)
* [domvm](http://domvm.threaditjs.com)

---

## Contributing

See the [Github page](http://github.com/koglerjs/threaditjs)!

---

## Goals

Full post [here](https://koglerjs.com/verbiage/threadit).  

Much respect is intended for TodoMVC.  But even TodoMVC talks about MV* instead of MVC, and a theoretical design pattern label isn't a good descriptor for the problems we're trying to solve with modern web applications.  

Implementing ThreaditJS with a framework involves: 

* Interacting with a backend that maintains its own state
* More comprehensive use of routing
* A more revealing use case for DOM manipulation

The goal is to have an application with roughly similar simplicity while providing an example that lets you see how a framework will help you do the things you'll actually be doing.  

(And yes, I know that some TodoMVC implementations toy with having a router or a more complex backend, but it isn't a basic component of the project.)  

---

## The API

All implementations will use the same API, located at api.threaditjs.com.  Arguably someone could even come up with a native mobile consumer implementation.  See the [Github page](http://github.com/koglerjs/threaditjs) for more on the API.  

---

More to come!  Follow me at [@koglerjs](http://twitter.com/koglerjs) or follow [@ThreaditJS](http://twitter.com/threaditjs) to find out when implementations are added or other updates occur!