# Backbone

---

Backbone isn't the prettiest implementation, taking up 400 lines or so of code, much of which has the feel of boilerplate.  But it performs well and you wouldn't use Backbone without Marionette or something nowadays anyway.  

Backbone is one of my favorite libraries; my background in SPAs has a lot of Backbone in it.  But I wouldn't use Backbone to start a project from scratch, and I'm not sure how I feel about any of the multitude of Backbone extensions.  

---

# Performance

This Backbone implementation has pretty good performance; parsing its dependencies took around 200ms, and its setup time tended to lie around 40ms.  

With the extremely large thread, Backbone took a full 4 seconds to render.  The more moderately sized thread took about a half second.  Note that this is an extremely naive render, subject to easy optimization: the most obvious is waiting to put the elements in the DOM until after the full tree is rendered.  

With Backbone, you're free to make this kind of optimization, in a way you are not if you're tied to Angular or Ember.  If/when I try creating a Marionette example I'll also see what I can do about the thread render time.  

---

# Style

I deliberately coded this without any helper library; it's vanilla Backbone, done with Underscore templates, which I've never ever used in production.  

---

# Bottom line

If you've got an old Backbone application, you probably don't have performance problems, but you might have maintenance issues.  