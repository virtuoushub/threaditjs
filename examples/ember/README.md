# Ember

---

I've realized that there is no point in criticizing Ember, because at this point criticisn of Ember isn't new to those not working with Ember, and those who _are_ working with Ember are already stuck.  

I'll therefore try to keep my comments minimal.  I may not do a very good job; I find Ember is extremely frustrating to work with, and I'm going to at least describe how.  

If you're in the Ember world and it's working for you, that's fine.  I don't mean to suggest that it was never a good idea to use Ember.  This is just one guy's experience.  

But I'm _evaluating_ these frameworks, I'm not a cheerleader.  

---

# Performance

Under no circumstance can you claim to care about mobile performance and use Ember.  On my Samsung Galaxy S3, there's an automatic 1.1 second penalty between page load and before the user sees anything under the **best case** (with successful cache hits): 600 ms to **parse/execute** ember.min.js and jquery.min.js, and 500 ms for the initialization.  

You can run these tests yourself: go [here](http://ember.threaditjs.com/depload.html) to see how long it takes for dependencies to load on your machine.  Note how the first visit is expensive; subsequent visits will use the cache.  

And check the console in the [Ember implementation](http://ember.threaditjs.com) to see setup time.  (On Android you can put about:debug into the address bar to access the console.)

In the worst case scenario, it took 1.7 seconds for my phone to download (4G) and parse the dependencies.  I also commonly saw a whole second for initialization time.  

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

(It also defaulted to installing jQuery 1.11.1 instead of 1.11.3, but that's a little less pressing in my mind.  Although, in a codebase the size of Ember's, just how confident are you in upgrading to a newer version of jQuery on your own?)

(The answer is, you should feel comfortable bringing any problems you have to the Ember community, and maybe you'll even be able to contribute a solution!)

(That's how they get you.)  

As a consequence of moving everything to ember-cli, the basics of declaring a Helper seem to have gotten lost.  With ember-cli you just run a command and the file is generated and automatically called in the right way.  Since (for reasons discussed elsewhere) I was committed to not using ember-cli, I was left to declare it manually.  

I got to Ember.Helper.helper (which has shifted [mechanisms](http://www.thegreatcodeadventure.com/writing-a-handlebars-helper-for-ember-js/) at [least](https://www.codehive.io/boards/lI27GF4) three [times](http://stackoverflow.com/questions/28624800/how-to-write-helpers-in-htmlbars)) and couldn't get it to work.  

Apparently this is where I'm just deficient: I have no idea how anyone thinks Ember's documentation is good, and I love Angular's documentation.  

Someone very helpfully improved my Ember code to its current state, and of course I was supposed to store what Ember.Helper.helper returned on my application to make it available to the template.  That's easy.  With Ember, everything is easy... _once you know how to do it_.  The documentation is great, _once you know it very well_.  

But look at those three instructions, above, on creating a helper.  Would you have guessed that?  I even tried to find how ember-cli's generators declared Helpers internally and couldn't quite do it.  

So ember-cli actively obstructs how to do common tasks with Ember, trying to push _even more_ into the mystery of its abyssal fold.  

## Ember Data is never going to be sensible.

I tried with Ember Data, I really did.  In my frustration I put the Ember implementation away to work on the Angular one, and guess what?  

Angular's data services are phenomenal.  

Ember Data has no excuse at this late stage of its existence.  From what I hear, within Ember no one wants to work on Ember Data.  

# Bottom Line

Ember is an active treadmill of code for code's sake without any direction or restraint.  And Ember has wasted enough of my time.  I included it out of a nod to the 2.0 release and to prove I gave it as fair an evaluation as I can give it.  

---

Believe it or not, the above was all written prior to the main performance article.   

### A few further reflections having completed the [preliminary performance](https://koglerjs.com/verbiage/performance) review.  

I don't see what value I'm supposed to get from Ember's mass.  Mithril is a framework: it is a one-stop solution for everything an SPA needs.  I'm not even sure I like Mithril that much, with all the nested m() calls.  It just seems to do the least amount of needless handwaving of any solution out there right now.  

### Not all bytes of code are created equal.  

What am I not making use of that a single page application needs?  

Every bit of code does something for someone.  This may be technically true.  I simply do not believe that this is so.  Some programs are more efficient than others.  Computer science is full of these lessons.  

If you want to convince me Ember has merit, you're going to have to point to something ThreaditJS should be doing that it isn't currently.  What could an SPA be getting out of Ember's massive constantly changing codebase that I'm currently not using?  

What I mean by specifying what an SPA could get out of Ember: something like 'server side rendering' is not an answer I'll accept here.  What does Ember, the SPA technology, provide that I'm not utilizing?  

While I'm thinking about it, though, Mithril could render once on the server so it has something to show while it **regenerates everything entirely on the client** before Ember would even be done _running its minified dependencies_.  The most straightforward blunt implementation of server-side rendering with Mithril would be a performance improvement over Ember.  

---

## HTMLBars in the client and ember-cli

As said elsewhere: this should affect only the initialization time I believe, there's no reason for it to affect the render pipeline.  

I would be a little curious to see how an ember-cli generated application would perform.  However, Vue, Backbone, and Angular all parse their templates in the client.  Pre-processing Ember's templates would have to be _incredbly_ efficient in order to take the initialization time to even Angular's 300 milliseconds.  

It's possible that this is unfair to Ember and Ember suffers from this (in my view) reasonable but admittedly arbitrary restriction more than the other solutions.  

But is it unfair _enough_?  

Ember's benefits may be entirely social, which cold heartless milliseconds cannot measure.  You might accuse me of coming into this with a bias against kilobytes.  

Maybe I'm thus biased, coming from a Backbone perspective where things are small and not magically linked, and my inability to see much of the benefit of being on the other side of the fence is a downside.  I can certainly understand the concept that Ember has provided a permanence that is of value to a long-term thinking entity like a corporation.  

But there's also the possibility that the other side of the fence has its own biases, and this should be considered a friendly but pointed ping back from my side of the fence, a side focused on basic performance and simplicity.  

I'm not trying to be mean.  I really enjoy playing with Javascript tech and believe it's certainly possible that Ember has been the right decision for some teams in some circumstances.  

But revisiting all of this, my conclusion remains the same: **you cannot use Ember and claim to care about mobile performance**.  