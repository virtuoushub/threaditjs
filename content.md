### A comprehensive example application for SPA libraries/frameworks.  

This page collects implementations of a thread-based discussion application all interacting with the same API.  The intent is to provide side-by-side comparisons for tasks every ES2015 client application will necessarily complete.  

The main application shows a list of threads similar to a well known Internet discussion forum.  The user can create a new thread, display a thread's comments, and respond to a specific comment.  [This is a baseline implementation](http://backbone.threaditjs.com).

## Goals

Much respect is intended for TodoMVC.  But even TodoMVC talks about MV* instead of MVC, and a theoretical design pattern label isn't a good descriptor for the problems we're trying to solve with modern web applications.  

Implementing ThreaditJS with a framework involves: 

* Interacting with a backend that maintains its own state
* More comprehensive use of routing
* A more revealing use case for DOM manipulation

The goal is to have an application with roughly similar simplicity while providing an example that lets you see how a framework will help you do the things you'll actually be doing.  

(And yes, I know that some TodoMVC implementations toy with having a router or a more complex backend, but it isn't a basic component of the project.)  

## The ThreaditJS API

All implementations will use the same API, located at http://api.threaditjs.com.  Arguably someone could even come up with a native mobile consumer implementation.  

## Examples

Currently, I only have:

* [Backbone](http://backbone.threaditjs.com)

---

## Contributing

See the [Github page](http://github.com/koglerjs/threaditjs)!

---

A longer look at the motivations for this project can be found [here](https://koglerjs.com/verbiage/threadit).  
