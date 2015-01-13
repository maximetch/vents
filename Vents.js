"use strict";

var Vents = {
  _utils: {
    getElement: function _Vents_utils_getElement() {
      var arg = arguments[0];

      return typeof arg === 'string' ? document.querySelector(arg) : arg;
    },

    isMobile: {
      Android: function isMobile_Android() {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function isMobile_BlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function isMobile_iOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function isMobile_Opera() {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function isMobile_Windows() {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function isMobile_any() {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
      }
    }
  },

  /**
   *
   */
  add: function Vents_add(name, el, callback) {
    var i, comp, eventFn, names, namesLen, isMobile;

    isMobile = this._utils.isMobile.any();
    el = this._utils.getElement(el);

    // Case of many events binded
    if (/\,/.test(name)) {
      names = name.split(',');
      namesLen = names.length;

      for (i = 0; i < namesLen; i += 1) {
        Vents.add(el, names[i].trim(), callback);
      }
    } else {
      switch (name) {
        case 'vclick':
          name = isMobile ? 'touchstart' : 'click';
          break;

        case 'vmousedown':
          name = isMobile ? 'touchstart' : 'mousedown';
          break;

        case 'vmouseup':
          name = isMobile ? 'touchend' : 'mouseup';
          break;

        case 'vmousemove':
          name = isMobile ? 'touchmove' : 'mousemove';
          break;

        case 'mouseenter':
        case 'mouseleave':
          name = name === 'mouseenter' ? 'mouseover' : 'mouseout';

          eventFn = function(e) {
            var parent = e.relatedTarget;

            while (parent && parent != el) {
              try {
                parent = parent.parentNode;
              } catch (e) {
                break;
              }
            }

            if (parent != node) {
              callback.call(el, e);
            }
          };

          break;

        case 'rclick':
          name = 'mousedown';

          eventFn = function(e) {
            if (e.which === 3) {
              callback.call(el, e);
            }

            e.stopPropagation();
            e.cancelBubble = true;

            return false;
          };

          // Disable default context menu
          el.oncontextmenu = function() {
            return false;
          };

          break;

        default:
          break;
      }

      if (!eventFn) {
        eventFn = function(e) {
          var returnRslt = true;

          if (callback) {
            returnRslt = callback.call(el, e);
          }
        };
      }

      if (!el._eventsListeners) {
        el._eventsListeners = {};
      }

      if (!el._eventsListeners[name]) {
        el._eventsListeners[name] = [];
      }

      el._eventsListeners[name].push({
        callback: callback,
        eventFn: eventFn
      });

      el.addEventListener(name, eventFn);
    }

    return this;
  },

  /**
   *
   */
  remove: function Vents_remove(name, el, fn) {
    var i, listeners, listenersLen, listener, defaultFn;

    el = this._utils.getElement(el);
    listeners = this.get(name, el);

    for (i = 0; i < listeners.length; i += 1) {
      listener = listeners[i];

      if (fn === listener.callback || fn === undefined) {
        el.removeEventListener(name, listener.eventFn);
        listeners.splice(i, 1);
      }
    }

    return this;
  },

  /**
   *
   */
  trigger: function Vents_trigger(name, el) {
    var i, listeners, listenersLen, listener, name, args;

    args = [];
    el = this._utils.getElement(el);
    listeners = this.get(name, el);

    for (i = 0; i < arguments.length; i += 1) {
      if (i === 0) {
        name = arguments[i];
      } else {
        args.push(arguments[i]);
      }
    }

    // Call listener load event
    for (i = 0, listenersLen = listeners.length; i < listenersLen; i += 1) {
      listener = listeners[i];
      listener.eventFn.apply(this, args);
    }

    return this;
  },

  /**
   *
   */
  get: function Vents_get(name, el) {
    var result;

    el = this._utils.getElement(el);

    if (name) {
      result = el._eventsListeners[name];
    } else {
      result = el._eventsListeners;
    }

    return result;
  }
};