# React

Of the implementations, the React one was my worst work; it wasn't particularly idiomatic and has several known React anti-patterns.  Initially, the React implementation used Redux, but that got scrapped in favor of just getting it done.  

That has changed somewhat.  The View code has been cleaned up and is now as idiomatic as I can manage.  

## But I'm keeping this implementation React only.  

I don't really know how to deal with React's identity problem, and I would vaguely question that it even _has_ one except for the grumblings I hear about the React ecosystem that I quickly sympathize with.  

When trying to incorporate Redux, it bothered me a lot that I was trying to essentially create a Facebook example instead of a React example.  I can't personally tie together an idiomatic Facebook Relay-Redux-React implementation because I don't think that such a thing necessarily exists.  I was struggling with too many disconnected concepts.  

As I'm still very interested in Redux, look for a Redux implementation in the near future.  

And I would _absolutely_ welcome a facebook.threaditjs.com example.  You'd be making, in effect, a pretty daring argument about what the Facebook Contestant looks like, unofficially.  That's the nice thing about Angular and Ember; they're definite coherent visions of the future of web development.  

For this implementation, however: if we're to buy React's claim that it's just the view layer, we cannot get entangled in this anomie about a unified Facebook design.  Yes, Redux + React is hot right now.  Yes, react-router is an accepted addition to the React stack, such as it is.  

This example is React only, even if somem of the following reactions touch on this hypothetical Facebook implementation as well.  

## Performance

Using the production version of React makes a significant difference in render performance.  Development mode it takes 15 seconds on the large fixture; production mode only 4.  This is the difference between Vue and Backbone, roughly.  

The medium fixture takes 400ms to render, and it takes about 300ms to parse/execute react.min.js.  

None of my performance measures the overhead of JSXTransformer.  It wouldn't really be correct to craft an implementation using React.DOM calls only, as that's not the intended use of React.  

---

## JSX still leads to some weirdness.   

I'm not talking about the philosophical objections I have with putting HTML in Javascript (though let's be honest: as much as React proponents repeat the fact that JSX is optional, it's not the intended use and it has only gotten harder to do).  

I'm talking about how every React library wants to put its stuff in JSX, regardless of whether or not it matters to the DOM.  [React Ajax](https://github.com/yuanyan/react-ajax):

    var Ajax = require('react-ajax');

    <Ajax url="data.json" onResponse={this.responseHandler} />

[React Router:](https://github.com/rackt/react-router)

    render((
      <Router>
        <Route path="/" component={App}>
          <Route path="about" component={About}/>
          <Route path="users" component={Users}>
            <Route path="/user/:userId" component={User}/>
          </Route>
          <Route path="*" component={NoMatch}/>
        </Route>
      </Router>
    ), document.body)


This is insane.  I mean, I get it a little with the Ajax library: you've got to do _something_ to make your Ajax library necessarily React-like and differentiate it from the dozens of generic Ajax libraries.  

But you're making the HTML your favored programming language here for no real reason.  The Routes have **nothing to do with the DOM**.  If you're going to have an XML config file for your Routes, _do that_.  

It's exactly the kind of misbehavior that I expected from the decision to make JSX standard.  But I ended up not using the React Router anyway.  

## React Router

I started out using React's recommendation for the Router and gave up.  I suspect that it's because I was using a version off of a CDN instead of packaging it up with a build tool, but honestly I don't know why I couldn't get much to work.  I'll accept the criticism that I just don't understand the React Way.  

### Adding ?_k=hash

This is a feature that I didn't know I didn't want until I couldn't turn it off.  It's funny reading the Router devs [react coldly to people that don't want it.](https://github.com/rackt/react-router/issues/1967)  

What, you mean you didn't want unexpected garbage in your URL?  That's such a 'small detail.'  Why would we mention it in the upgrade guide?  

So I honestly don't understand what the point is.  I mean, I get that it's [to mimic the HTML5 history API in older browsers](http://rackt.org/history/stable/HashHistoryCaveats.html) (see also [this link](https://github.com/rackt/react-router/blob/master/docs/guides/basics/Histories.md#what-is-that-_kckuvup-junk-in-the-url)), but this is the only router I've ever seen that tries this.  Why doesn't it only try it on older browsers by default?  Why is this suddenly a problem at all?  

And as I said, for whatever reason I couldn't turn it off.  And then it wasn't working well anyway, and I was tired of looking through documentation to find the right way to make it work.  

And you know what, I don't think you need 4600 lines of code (+ 2600 for History.js) to create a routing library.  I just don't.  That's 75k bytes minified, 20k gzipped; it's not like it's huge, but it's just bigger, by far, than it needs to be.  

>>React Router was initially inspired by Ember's fantastic router.  

I see.  That explains a lot.  

So I plopped Grapnel in, created my own 10-line <Link> implementation, and had everything working in about two minutes.  I suspect that this wouldn't work for a larger application, but I would rather manage it myself than leave it to React Router: your mileage may vary.  

---

## Bottom Line

The current reigning champion in our hearts and minds, but it bothers me that React is just about as fast as Backbone (though much prettier, even, I admit, _with_ JSX).  