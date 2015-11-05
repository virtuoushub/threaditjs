### ThreaditJS is an example application for SPA libraries/frameworks.  

This page collects implementations of a thread-based discussion application all interacting with the same API.  The intent is to provide side-by-side comparisons for tasks every ES2015 client application will necessarily complete.  It should be considered a friendly competitor to TodoMVC.  

Currently, I have:

* [Backbone](http://backbone.threaditjs.com)
* [Ember](http://ember.threaditjs.com)
* [Angular](http://angular.threaditjs.com)
* [Mithril](http://mithril.threaditjs.com)
* [React](http://react.threaditjs.com)
* [Vue](http://vue.threaditjs.com)

The main application shows a list of threads similar to a well known Internet discussion forum.  The user can create a new thread, display a thread's comments, and respond to a specific comment.  

## Goals

Much respect is intended for TodoMVC.  But even TodoMVC talks about MV* instead of MVC, and a theoretical design pattern label isn't a good descriptor for the problems we're trying to solve with modern web applications.  

Implementing ThreaditJS with a framework involves: 

* Interacting with a backend that maintains its own state
* More comprehensive use of routing
* A more revealing use case for DOM manipulation

The goal is to have an application with roughly similar simplicity while providing an example that lets you see how a framework will help you do the things you'll actually be doing.  

(And yes, I know that some TodoMVC implementations toy with having a router or a more complex backend, but it isn't a basic component of the project.)  

## The ThreaditJS API

All implementations will use the same API, located at api.threaditjs.com.  Arguably someone could even come up with a native mobile consumer implementation.  See the [Github page](http://github.com/koglerjs/threaditjs) for more on the API.  

---

## Contributing

See the [Github page](http://github.com/koglerjs/threaditjs)!

---

## Current Awards

Not a strict count of lines of code.  Also, eventually this'll be measured in bytes.  

### Shortest Application Code:

Ember, with 76 lines of javascript and 55 lines in templates.  Vue is a close second at 100 in js, 50 in html.  

### Longest Application Code:

Backbone, 380 app.js, 30 lines of templates

### Largest Overall Payload

Ember, with an astounding 85,000 lines of library code.  The next closest in size is React at around 35k if you count the JSX transformer, which you really shouldn't, or Angular, which is only around 30,000 lines of library code.  Ember is _so ridiculously heavy_.  

### Smallest Overall Payload

Mithril, with ~180 lines of app code and 1160 lines of library code: a charming 1300 or so.  

### Slowest at rendering large threads

Vue for some reason.  

### Worst at rendering large threads

Angular; it throws an error.  

---

More to come!  Follow me at [@koglerjs](http://twitter.com/koglerjs), I'll have a blog post up soon with some notes on the current implementations, or follow [@threaditjs](http://twitter.com/threaditjs) to find out when implementations are added or other updates occur!