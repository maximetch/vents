"use strict";

var Vents = {
  /**
   * Register a listener on a Dom element.
   * @param {String} type The event type to listen for
   * @param {Object} eventTarget The event target
   * @param {Function} listener Function fired when the event occurs
   */
  add: function Vents_add(type, eventTarget, listener) {
    var i, comp, eventFn, allType, eventTargets, target, finalType;

    eventTargets = this._getElements(eventTarget);

    for (i = 0; i < eventTargets.length; i += 1) {
      target = eventTargets[i];

      // Case of many events binded
      if (/\,/.test(type)) {
        allType = type.split(',');

        for (i = 0; i < allType.length; i += 1) {
          Vents.add(allType[i].trim(), eventTarget, listener);
        }
      } else {
        finalType = this._getFinalEventType(type);
        if (type === 'rclick') {
          eventFn = function(e) {
            if (e.which === 3) {
              listener.call(el, e);
            }

            e.stopPropagation();
            e.cancelBubble = true;

            return false;
          };

          // Disable default context menu
          target.oncontextmenu = function() {
            return false;
          };
        }

        if (!eventFn) {
          eventFn = function(e) {
            if (listener) {
              listener.call(target, e);
            }
          };
        }

        if (!target._eventsListeners) {
          target._eventsListeners = {};
        }

        if (!target._eventsListeners[type]) {
          target._eventsListeners[type] = [];
        }

        target._eventsListeners[type].push({
          listener: listener,
          eventFn: eventFn
        });

        target.addEventListener(finalType, eventFn);
      }
    }
  },

  /**
   * Register a listener on a Dom element.
   * @param {String} type The event type to listen for
   * @param {Object} eventTarget The event target
   * @param {Function} listener Event listener function to be remove
   */
  remove: function Vents_remove(type, eventTarget, listener) {
    var i, j, listeners, listener, defaultFn, eventTargets, target, finalType;

    eventTargets = this._getElements(eventTarget);
    finalType = this._getFinalEventType(type);

    for (i = 0; i < eventTargets.length; i += 1) {
      target = eventTargets[i];
      listeners = this._getEventListeners(type, target);
      j = listeners.length;

      while (j--) {
        listener = listeners[j];

        if (listener === listener.listener || listener === undefined) {
          target.removeEventListener(finalType, listener.eventFn);
          listeners.splice(j, 1);
        }
      }
    }
  },

  /**
   * Execute the event
   * @param {String} type The event type to execute
   * @param {Object} eventTarget The event target
   */
  trigger: function Vents_trigger(type, eventTarget) {
    var i, j, listeners, args, eventTargets, target;

    args = [];
    eventTargets = this._getElements(eventTarget);

    for (i = 0; i < eventTargets.length; i += 1) {
      target = eventTargets[i];
      listeners = this._getEventListeners(type, target);

      for (j = 0; j < arguments.length; j += 1) {
        if (j === 0) {
          type = arguments[j];
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
   * @private
   * Return the list of event listeners for a type of event of an eventTarget
   * @param {String} type The event type to listen for
   * @param {Object} eventTarget The event target
   */
  _getEventListeners: function _Vents_getEventListeners(type, eventTarget) {
    var listeners, result, target;

    target = this._getElements(eventTarget);
    listeners = target._eventsListeners;

    if (listeners && type) {
      result = target._eventsListeners[type];
    } else if (listeners) {
      result = target._eventsListeners;
    } else {
      result = [];
    }

    return result;
  },

  /**
   * @private
   * @return {Object} Elements
   */
  _getElements: function _Vents_getElements() {
    var arg = arguments[0];

    return typeof arg === 'string' ? document.querySelectorAll(arg) : arg;
  },

  /**
   * @private
   * Check the platform
   * @param {String} type Platform type to check
   * @return {Boolean}
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

  /**
   * @private
   * Get the final event type depending on the current platform
   * @param {String} type Event type
   * @return {String} Final event type
   */
  _getFinalEventType: function _Vents_getFinalEventType(type) {
    var isMobile, finalType;

    isMobile = this._isMobile();

    switch (type) {
      case 'vclick':
        finalType = isMobile ? 'touchend' : 'click';
        break;

      case 'vmousedown':
        finalType = isMobile ? 'touchstart' : 'mousedown';
        break;

      case 'vmouseup':
        finalType = isMobile ? 'touchend' : 'mouseup';
        break;

      case 'vmousemove':
        finalType = isMobile ? 'touchmove' : 'mousemove';
        break;

      case 'mouseenter':
      case 'mouseleave':
        finalType = type === 'mouseenter' ? 'mouseover' : 'mouseout';
        break;

      case 'rclick':
        finalType = 'mousedown';
        break;

      default:
        finalType = type;
        break;
    }

    return finalType;
  },
};