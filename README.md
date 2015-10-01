# ThreaditJS

It's harder than ever to keep track of Javascript tools  As our ideas as to how to structure strong client web apps have changed, so too must our means of evaluating them.  

This is an attempt at a newer tool for side-by-side comparison of SPA technologies.  

* [Threaditjs.com](http://threaditjs.com)
* [Blog post](http://koglerjs.com/verbiage/threadit)

##General idea

An API is provided for a basic thread-based discussion forum.  An implementation is the Javascript code that interacts with the API to display the list of threads, display comment trees, and allow users to post text.  

##The API

The server holds the comment threads in memory, dumping them and creating new ones every 5 minutes.  There's also a rate limit in place.  I've done my best to sanitize user input.  

There are four endpoints.  

* /threads

Provides a list of top level threads.  

* /comments/:id

Provides a list of all descendants of the comment with the given id.  (Threads are really just comments that are stored in the top level list, which I understand is actually not too far off of Reddit's design where everything is a 'thing.')

* /threads/create

POST an object to create a new thread.

    { text : "vote up if you violate intergalactic law" }

* /comments/create

POST an object to respond to another comment or thread; you need text and the id of the object to which you're responding.  

    { id: "abcxyz", text : "this." }

###Error rates

In order to encourage error handling in your SPA, every endpoint will randomly fail some percent of the time.  Sometimes the API will even give an error when the request went through successfully!  

It's not a very well programmed API, apparently.  

---

##Contributing

###Adding your implementation

Create a folder containing your implementation's files in the `examples` directory.  Files here will be served statically at foldername.threaditjs.com.

I'm still trying to figure out how much leeway to give implementations when it comes to their setup.  My inclination is to require the project to be checked in as it is to be provided to browsers.  

This is out of a certain suspicion towards front page applications that develop their own build tools as well as a certain cynicism for solutions that pretend to move away from what is still going to be, at heart, a static file server.  

Still, I might allow a single `npm install` run at some point down the line.  

###Development 

If you just want to develop a SPA for your framework of choice, you can develop against api.threadit.com directly, as the ACAH have been set to ~~kill~~ allow all.  

I went to a bit of trouble to give every SPA control of its url space past the domain name.  If you want to run the whole project, you'll probably want to add the hosts in hosts.snippet to the /etc/hosts, and `touch .local` will put the application in development mode.  Then running 'sudo node index.js' will allow you to see yourfolder at yourfolder.local.threaditjs.com.  

I'm not entirely sure I'm explaining all of this clearly, if you have any questions try [@koglerjs](http://twitter.com/koglerjs).  