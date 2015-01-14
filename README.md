# Vents
[Vents.js](https://github.com/maximetch/Vents) is a cross platform events listener allowing to manage natives, virtuals or customs events.

## Getting Started

Let's say we have an element with 'myElement' id.

### Add an event on a DOM element

```html
Vents.add('vclick', '#myElement', function() {
  alert('Hello World');
});
```

<i>Nb: You use selector syntax ('#myElement) or DOM element object (document.querySelector('#myElement'))</i>

### Remove an event from a DOM element

```html
Vents.remove('vclick', '#myElement');
```

### Trigger an event

```html
Vents.trigger('vclick', '#myElement');
```

### Remove a specific event from a DOM element

```html
var myFunction = function() {
  alert('Hello World');
};

Vents.add('vclick', '#myElement', myFunction);
...
Vents.remove('vclick', '#myElement', myFunction);
```

### Same callback for many events
```html
Vents.add('vclick, rclick', '#myElement', function() {
  alert('Hello World');
});
```

### Virtual events
Virtual events allow the user to bind cross platform events

- __vclick__: [touchend](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) on mobile / [click](https://developer.mozilla.org/en-US/docs/Web/Events/click) on desktop
- __vmousedown__: [touchstart](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) on mobile / [mousedown](https://developer.mozilla.org/en-US/docs/Web/Events/mousedown) on desktop
- __vmouseup__: [touchend](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) on mobile / [mouseup](https://developer.mozilla.org/en-US/docs/Web/Events/mouseup) on desktop
- __vmousemove__: [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) on mobile / [mousemove](https://developer.mozilla.org/en-US/docs/Web/Events/mousemove) on desktop

### Custom events
Custom events are events that are not natively supported by the browsers (to complete)

- __rclick__: Desktop only
