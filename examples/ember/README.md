## Ember

I've realized that there is no point in criticizing Ember, because at this point criticisn of Ember isn't new to those not working with Ember, and those who _are_ working with Ember are already stuck.  

I'll therefore try to keep my comments minimal.  I may not do a very good job; Ember is extremely frustrating to work with, and I guess I'm going to point out how.  

If you're in the Ember world and it's working for you, that's fine.  I don't mean to suggest that it was never a good idea to use Ember.  This is just one guy's experience.  

But I'm _evaluating_ these frameworks, I'm not a cheerleader.  

---

# Performance

Under no circumstance can you claim to care about mobile performance and use Ember.  On my Samsung Galaxy S3, there's an automatic 1.3 second penalty between page load and before the user sees anything under the **best case** with successful cache hits. 

600 ms to **parse** ember.min.js and jquery, and 700 ms for the initialization.  

You can run these tests yourself!  Go [here](http://ember.threaditjs.com/depload.html) to see how long it takes for dependencies to load on your machine.  Note how the first hit is expensive and shows 

And check the console in the [Ember implementation](http://ember.threaditjs.com) to see setup time.  (On Android you can put about:debug into the address bar to access the console.)

In the worst case scenario, it took 1.7 seconds for my phone to download (4G) and parse the dependencies.  I also commonly saw 2 seconds of initialization time.  

**Under no circumstance can you use Ember and also claim to care about mobile performance.**

---

# Less objective criticisms.  

In declining order of rigor.  

## Bloat

Two years ago I wrote: 

>> But are we ever going to see a release where Ember's codebase _decreases_ by 2000 lines or so?  

Much to my surprise, [they _kindof_ accomplished this](http://iao.fi/ember-size/) with 2.0.0.  But it bears mentioning that:

* Most of that was just reversing the spike in June 2015
* At the time of my writing, Ember was only ('only') 36,000 lines of code, and now it's over 50,000.  
* It's since resumed its steady increase.  

## Documentation.  

It's true that the documentation is kept rigorously tagged with version numbers.  Sometimes, however, links for one version are just not valid in the newest version, so whatever question you have that might be resolved by the earlier documentation is left unanswered, and you have to roll the dice and see if following old advice works.  

Everything is changing, all the time.  And it's even worse than the first time I looked at Ember over two years ago, because now even more of the scattered informal information on Ember is out of date.  

## Implied code isn't a good idea.  

You still have to keep the automatically generated controllers/routes/ in your head anyway.  It _might as well_ be written explicitly.  

If anyone is impressed with how short Ember's implementation is compared to the others, they need to think long and hard about how it's possible for that implementation to be the largest and worst performing overall.  

## ember-cli

ember-cli is the recommended way to manage an Ember app.  It wasn't even installing 2.1.0 (released October 4th) until November 10th.  

(It also defaults to installing jQuery 1.11.1 instead of 1.11.3, but that's a little less pressing in my mind.  Although, in a codebase the size of Ember's, just how confident are you in upgrading to a newer version of jQuery on your own?)

(The answer is, you should feel comfortable bringing any problems you have to the Ember community, and maybe you'll even be able to contribute a solution!)

(That's how they get you.)  

As a consequence of moving everything to ember-cli, the basics of declaring a Helper seem to have gotten lost.  I got to Ember.Helper.helper (which has shifted [mechanisms](http://www.thegreatcodeadventure.com/writing-a-handlebars-helper-for-ember-js/) at [least](https://www.codehive.io/boards/lI27GF4) three [times](http://stackoverflow.com/questions/28624800/how-to-write-helpers-in-htmlbars)) and couldn't get it to work.  

Apparently this is where I'm just deficient: I have no idea how anyone thinks Ember's documentation is good, and I love Angular's documentation.  

Someone very helpfully improved my Ember code to its current state, and of course I was supposed to store what Ember.Helper.helper returned on my application to make it available to the template.  That's easy.  With Ember, everything is easy... _once you know how to do it_.  The documentation is great, _once you know it very well_.  

## Ember Data is never going to be sensible.

I tried with Ember Data, I really did.  In my frustration I put the Ember implementation away to work on the Angular one, and guess what?  

Angular's data services are phenomenal.  

Ember Data has no excuse at this late stage of its existence.  From what I hear, within Ember no one wants to work on Ember Data.  

# Bottom Line

Ember is an active treadmill of code for code's sake without any direction or restraint.  And Ember has wasted enough of my time.  I included it out of a nod to the 2.0 release and to prove I gave it as fair an evaluation as I can give it.  