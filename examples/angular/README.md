# Angular

I'll say this about Angular: it aged _quite well_.  

I don't think anyone reading this will need me to dissuade them from starting a project with Angular now that Angular 2 is [reportedly close to beta release](https://splintercode.github.io/is-angular-2-ready/).  Angular is included in this project partly out of nostalgia and partly to pay respect to its mindshare.  

I still think putting this much power in templates is a bad idea.  Angular is the only implementation that technically fails the test; the $digest cycle limitation means that it won't render any thread trees deeper than 10 comments.  

But everything about doing the Angular implementation was fun.  Part of that is because I was coming from Ember, but even Vue and Mithril didn't quite capture the Angular magic.  

---

# Performance

Angular's dependencies (about 56kb after gzip) get parsed by my phone in 150-200 ms; a full download and parse takes 750 ms or so.  Initialization time is usually between 200 ms and 300 ms but it occasionally spiked to a full second.  

## Render performance

If any Angular experts can help me out here, I'd appreciate it.  I can't find a good way to measure when a thread has been fully rendered, particularly if it's hit the $digest limit.  

For the uninitiated, the way you code an Angular app is, you write all of your changes to $scope and then Angular whirs and buzzes violently until it has magically taken care of updating everything, forever, or at least until you change $scope again.  

Angular does not let you know when it's done.  That isn't the Angular way: you shouldn't _want_ to do anything after the DOM has settled down.  You should just write what you want to happen to $scope **whenever and however you want**, even if it's to create a self-modifying $scope, even if it's in a closure five times removed from the original creation of that $scope, and Angular will take care of it for you.    

It's an exhilarating style of coding, but if you want to do something simple like figure out how long Angular's been $digesting it won't help you.  

I tried looking at the flame charts as [suggested here](http://stackoverflow.com/questions/23066422/how-do-i-measure-the-performance-of-my-angularjs-apps-digest-cycle), but that seemed like little more than taking out a stopwatch.  That's what I did for the XL thread test.  

It takes Angular 25 or so seconds to (fail to) render the XL thread.  For the moderate thread, I'll wait until I can get some actual numbers.  

---

# Angular Resource

By far my favorite part of coming back to Angular was specifying the calls I'd be making with angular-resource.  $resource doesn't make any assumptions about the idiosyncrasies of the API you're working with.  It makes assumptions about the type of idiosyncrasies that are possible to have with an API, and so coding a $resource is simply a matter of specifying those idiosyncrasies.  

---

# Other notes

### Being unable to load a template made the app crash hard.  

As in, possibly crashing the browser.  If for some reason you start an Angular app now, and if for some reason you're not using its template compilation procedure, take note.  I could argue that this should be more robust, and maybe it could be, but it's not exactly worrisome.  

### You can inspect any $scope at any time by assigning it to a global variable

I was irritated because a nice thing Ember provides is {{log myVar}}, and Angular wants you to use fancy-pants injection just to get to a $log variable.  

Instead, though, you can always write window.dumb = $scope for the $scope you want to examine, and then you've got the variable right in the console!  