# Vents
[Vents.js](https://github.com/maximetch/Vents) is a cross platform events listener allowing to manage natives, virtuals or customs events.

## Getting Started

Let's say we have an element with 'myElement' id.

### Add an event on a HTML element

```html
var myVents = new Vents('#myElement');
myVents.add('vclick', function() {
  alert('Hello World');
});
```
_Nb: You use selector syntax ('#myElement) or DOM element object (document.querySelector('#myElement'))_.

---

### Remove an event from a DOM element

```html
myVents.remove('vclick');
```

---

### Trigger an event

```html
myVents.trigger('vclick');
```

---

### Remove a specific event from a DOM element

```html
var myVents = new Vents('#myElement');
var myListener = function() {
  alert('Hello World');
};

myVents.add('vclick', myListener);
...
myVents.remove('vclick', myListener);
```

---

### Same callback for many events
```html
var myVents = new Vents('#myElement');
myVents.add('vclick, rclick', function() {
  alert('Hello World');
});
```

---

## Virtual events
Virtual events allow the user to bind cross platform events

- __vclick__: [touchend](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) on mobile / [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) on desktop
- __vmousedown__: [touchstart](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) on mobile / [mousedown](https://developer.mozilla.org/en-US/docs/Web/Events/mousedown) on desktop
- __vmouseup__: [touchend](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) on mobile / [mouseup](https://developer.mozilla.org/en-US/docs/Web/Events/mouseup) on desktop
- __vmousemove__: [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) on mobile / [mousemove](https://developer.mozilla.org/en-US/docs/Web/Events/mousemove) on desktop

---

## Custom events
Custom events are events that are not natively supported by the browsers (to complete)

- __rclick__: Desktop only
