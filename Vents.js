"use strict";

var Vents = {
  /**
   *
   */
  add: function Vents_add(name, element, callback) {
    var i, comp, eventFn, names, namesLen, isMobile, els, el, finalName;

    isMobile = this._isMobile();
    els = this._getElements(element);

    for (i = 0; i < els.length; i += 1) {
      el = els[i];

      // Case of many events binded
      if (/\,/.test(name)) {
        names = name.split(',');
        namesLen = names.length;

        for (i = 0; i < namesLen; i += 1) {
          Vents.add(el, names[i].trim(), callback);
        }
      } else {
        finalName = this._getFinalEventName(name);
        if (name === 'rclick') {
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
        }

        if (!eventFn) {
          eventFn = function(e) {
            if (callback) {
              callback.call(el, e);
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

        el.addEventListener(finalName, eventFn);
      }
    }
  },

  /**
   *
   */
  remove: function Vents_remove(name, element, fn) {
    var i, j, listeners, listener, defaultFn, els, el, finalName;

    els = this._getElements(element);
    finalName = this._getFinalEventName(name);

    for (i = 0; i < els.length; i += 1) {
      el = els[i];
      listeners = this.get(name, el);
      j = listeners.length;

      while (j--) {
        listener = listeners[j];

        if (fn === listener.callback || fn === undefined) {
          el.removeEventListener(finalName, listener.eventFn);
          listeners.splice(j, 1);
        }
      }
    }
  },

  /**
   *
   */
  get: function Vents_get(name, element) {
    var listeners, result;

    element = this._getElements(element);
    listeners = element._eventsListeners;

    if (listeners && name) {
      result = element._eventsListeners[name];
    } else if (listeners) {
      result = element._eventsListeners;
    } else {
      result = [];
    }

    return result;
  },

  /**
   *
   */
  trigger: function Vents_trigger(name, element) {
    var i, j, listeners, args, els, el;

    args = [];
    els = this._getElements(element);

    for (i = 0; i < els.length; i += 1) {
      el = els[i];
      listeners = this.get(name, el);

      for (j = 0; j < arguments.length; j += 1) {
        if (j === 0) {
          name = arguments[j];
        } else {
          args.push(arguments[j]);
        }
      }

      // Call listener load event
      for (j = 0; j < listeners.length; j += 1) {
        listeners[j].eventFn.apply(this, args);
      }
    }
  },

  /**
   *
   */
  _getElements: function _Vents_getElements() {
    var arg = arguments[0];

    return typeof arg === 'string' ? document.querySelectorAll(arg) : arg;
  },

  /**
   *
   */
  _isMobile: function _Vents_isMobile(type) {
    var agents, agentCheck;

    agents = ['Android', 'BlackBerry', 'iPhone|iPad|iPod', 'Opera Mini', 'IEMobile'];

    switch (type) {
    case 'Android':
      agentCheck = agents[0];
      break;

    case 'BlackBerry':
      agentCheck = agents[1];
      break;

    case 'iOS':
      agentCheck = agents[2];
      break;

    case 'Opera':
      agentCheck = agents[3];
      break;

    case 'Windows':
      agentCheck = agents[4];
      break;

    default:
      agentCheck = agents.join('|');
      break;
    }

    return navigator.userAgent.match(new RegExp(agentCheck, 'i'));
  },

  _getFinalEventName: function(name) {
    var isMobile, finalName;

    isMobile = this._isMobile();

    switch (name) {
      case 'vclick':
        finalName = isMobile ? 'touchstart' : 'click';
        break;

      case 'vmousedown':
        finalName = isMobile ? 'touchstart' : 'mousedown';
        break;

      case 'vmouseup':
        finalName = isMobile ? 'touchend' : 'mouseup';
        break;

      case 'vmousemove':
        finalName = isMobile ? 'touchmove' : 'mousemove';
        break;

      case 'mouseenter':
      case 'mouseleave':
        finalName = name === 'mouseenter' ? 'mouseover' : 'mouseout';
        break;

      case 'rclick':
        finalName = 'mousedown';
        break;

      default:
        finalName = name;
        break;
    }

    return finalName;
  },
};