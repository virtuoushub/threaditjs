# ThreaditJS

This is an attempt at a newer tool for side-by-side comparison of SPA technologies.  

[Main site.](http://threaditjs.com)

## General idea

An API is provided for a basic thread-based discussion forum.  An implementation is the Javascript code that interacts with the API to display the list of threads, display comment trees, and allow users to post text.  

## The API

The server holds the comment threads in memory, dumping them and creating new ones every 5 minutes.  There's also a rate limit in place.  I've done my best to sanitize user input.  

There are four endpoints.  Some rudimentary docs are available at [api.threaditjs.com](http://api.threaditjs.com).  

* /threads

Provides a list of top level threads.  

* /comments/:id

Provides a list of all descendants of the comment with the given id.  (Threads are really just comments that are stored in the top level list, which I understand is actually not too far off of Reddit's design where everything is a 'thing.')

* /threads/create

POST an object to create a new thread.  The text will be sanitized and passed through a Markdown library.  

    { text : "vote up if you violate intergalactic law" }

* /comments/create

POST an object to respond to another comment or thread; you need text and the id of the object to which you're responding.  The text will be sanitized and passed through a Markdown library.  

    { parent: "abcxyz", text : "this." }

### Error rates

In order to encourage error handling in your SPA, every endpoint will randomly fail some percent of the time.  Sometimes the API will even give an error when the request went through successfully!  

It's not a very well programmed API, apparently.  

---

## Contributing

### Adding your implementation

Create a folder containing your implementation's files in the `examples` directory.  Files here will be served statically at foldername.threaditjs.com.

I'm still trying to figure out how much leeway to give implementations when it comes to their setup.  My inclination is to require the project to be checked in as it is to be provided to browsers.  

This is out of a certain suspicion towards front page applications that develop their own build tools as well as a certain cynicism for solutions that pretend to move away from what is still going to be, at heart, a static file server.  

Still, I might allow a single `npm install` run at some point down the line.  

### Shared.js

Include http://threaditjs.com/shared.js makes the T object available.  Implementations should use T.trimTitle to shorten the title on the home page.  T.transformResponse is a convenience function for transforming the array of comments from the API into a linked tree of comments.  And finally, T.apiUrl should be used as the root string for all of your requests.  

### Shared.css

You should include http://threaditjs.com/shared.css.  You should also have a colors.css file in your project; try to pick something appropriate.  

### favicon

I liked having a different color favicon per implementation, too.  The favicon.xcf contains the image I used to generate the favicons for the current implementations.  

### Niceties checklist

In addition to showing the threads, showing comment trees, allowing the user to create threads and comments, I'll be looking to see how your solution accomplishes or doesn't accomplish the following:

* Handling document.title
* Handling 404s from the API
* Handling an error state
* Losing the ugly hash in the URL
* Trimming the title
* Pluralizing the comment count text (0 comments, 1 comment, n comments)

Note that not every current implementation is successful in all of these things; for instance, only Angular made pluralization easy.  

### Development 

If you just want to develop a SPA for your framework of choice, you can develop against api.threadit.com directly, as the ACAH have been set to ~~kill~~ allow all.  

I went to a bit of trouble to give every SPA control of its url space past the domain name.  If you want to run the whole project, `touch .local` will put the application in development mode.  Then running 'sudo node index.js' will allow you to see yourfolder at yourfolder.local.threaditjs.com.  

I'm not entirely sure I'm explaining all of this clearly, if you have any questions try [@koglerjs](http://twitter.com/koglerjs).  

### Eventual plans

Automatic generation of at least the size calculations would be great.  A page comparing individual implementations' modules (the Router) would also be nice.  

---

### Acknowledgments

Thanks to:

* [mixonic](https://github.com/mixonic) for his work on the Ember implementation.
* [ArthurClemens](https://github.com/ArthurClemens) for giving me good advice on the Mithril implementation over gitter.  
* [/u/theillustratedlife](http://reddit.com/u/theillustratedlife) for some tips on React.  
* [Pat Cavit](https://twitter.com/tivac) for a great DNS tweak that simply hadn't occurred to me.  

And finally, thanks to [PDXJS](http://www.meetup.com/Portland-JavaScript-Admirers/) for encouragement and sound advice.  
