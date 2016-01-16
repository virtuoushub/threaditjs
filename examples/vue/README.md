# Vue

---

Vue has an interesting place in the SPA world.  More than anything it feels like an evolution of Angular, one that avoids a few of Angular's mistakes, and one in the direction of a more composable library than an all-encompassing solution.  

It test-drove pretty well, acted mostly how I expected it to, and has my favorite Router.  

---

# Performance

Vue is similar to Backbone in download and parsing on my Samsung GS3: 500ms for a full load and parse, 200 or so to parse.  It has a slightly longer initialization time, hovering around 60 or 70ms.  

## Large thread render

Vue.nextTick doesn't do quite what I thought it would; it clearly fires well before the large thread is rendered.  

When I first announced the project (before I had performance metrics), Vue had a significant delay on larger threads, and I said it was the slowest at rendering large threads.  By coincidence, an updated version of Vue came out and seems to have improved performance significantly.  

On large threads it has roughly similar performance to React's development build: 15 or so seconds.  

Update mid-January: instead of nextTick, the 'ready' function and a basic lock sufficed for a post-render hook.  

---

## vue-router

I just love that it tries to keep track of the scroll position in the history for you.  Caveat; it worked on Chrome, but not on Firefox.  

Everything else about the Router is well designed, too, especially the care and consideration for transitions.  

---

## Quick gotcha

If you render into 'body' you'll nuke all your templates if you're putting them in your index.html, leading to a confusing series of errors as you try to figure out where they went.  