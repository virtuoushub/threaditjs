# Mithril

Long a favorite of mine, Mithril really shines in these metrics.  

---

## Performance

The shortest download+parse time (~200ms), the shortest parse time (80-100ms), the shortest initialization time (almost negligible at 10ms), the best performance on the XL thread (1.3 seconds!), and the best performance on the moderate thread (200ms).  

---

## Frustrations

### Render functions feel a little messy

Mithril transforms your render functions/'templates' into a mass of parentheses and rectangle brackets.  

I haven't used [MSX](https://github.com/insin/msx), but I would likely do so, and I'd likely incorporate it into a build system that includes a template manager (that is, no inline MSX for me).  

### Weird thennables

Mithril thennables take [two functions as optional parameters](https://lhorie.github.io/mithril/mithril.request.html#binding-errors), success and error.  Fortunately, enough people have been after them saying "Please just do promises like everyone else does" that an upcoming version of Mithril will have fixed this.  

---

## Just Javascript

A Mithril application is Just Javascript, and that feels really nice.  If you liked how Backbone always felt like it wasn't doing anything you were supposed to accept as magical, you'll like Mithril.  

--- 

## Quick Gotcha

If you are rendering into document.body with the router, you'll want to put your script tags in the body tag.  I forget why exactly, but it has to do with document.ready and is amusingly the exact opposite of what you might experience with Vue.  