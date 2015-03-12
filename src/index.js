/* Copyright (c) 2015;
 * Licensed under the MIT license */
(function(exportName) {
  'use strict';

  var IS_MOBILE = /android|iphone|ipad|ipod|iphone|mobile|tablet/i.test(navigator.userAgent);
  var eventsRegister = {};

  /**
   * Get the final event type depending on the current platform
   * @param {String} type Event type
   * @return {String} Final event type
   */
  function getFinalEventType(type) {
    var finalType;

    switch (type) {
      case 'vclick':
        finalType = IS_MOBILE ? 'touchend' : 'click';
        break;

      case 'vmousedown':
        finalType = IS_MOBILE ? 'touchstart' : 'mousedown';
        break;

      case 'vmouseup':
        finalType = IS_MOBILE ? 'touchend' : 'mouseup';
        break;

      case 'vmousemove':
        finalType = IS_MOBILE ? 'touchmove' : 'mousemove';
        break;

      case 'vmouseenter':
        finalType = IS_MOBILE ? 'touchenter' : 'mouseover';
        break;

      case 'vmouseleave':
        finalType = IS_MOBILE ? 'touchleave' : 'mouseout';
        break;

      case 'rclick':
        finalType = 'mousedown';
        break;

      default:
        finalType = type;
        break;
    }

    return finalType;
  }

  /**
   * @constructor
   * Events manager
   * @param {HTMLElement} eventTarget
   */
  function VentsManager(eventTarget) {
    this.eventTarget = typeof eventTarget === 'string' ? document.querySelectorAll(eventTarget) : [eventTarget];
  }

  /**
   * Register a listener on a Dom element.
   * @param {String} type The event type to listen for
   * @param {Function} listener Function fired when the event occurs
   */
  VentsManager.prototype.add = function(type, listener) {
    var i, eventFn, allType, eventTarget, finalType;

    if (type === 'rclick') {
      eventFn = function(e) {
        if (e.which === 3) {
          listener.call(eventTarget, e);
        }

        e.stopPropagation();
        e.cancelBubble = true;

        return false;
      };
    } else {
      eventFn = function(e) {
        if (listener) {
          listener.call(eventTarget, e);
        }
      };
    }

    for (i = 0; i < this.eventTarget.length; i += 1) {
      eventTarget = this.eventTarget[i];

      // Case of many events binded
      if (/\,/.test(type)) {
        allType = type.split(',');

        for (i = 0; i < allType.length; i += 1) {
          this.add(allType[i].trim(), listener);
        }
      } else {
        finalType = getFinalEventType(type);
        if (type === 'rclick') {
          // Disable default context menu
          eventTarget.oncontextmenu = function() {
            return false;
          };
        }

        if (!eventsRegister[type]) {
          eventsRegister[type] = [];
        }

        eventsRegister[type].push({
          target: eventTarget,
          listener: listener,
          eventFn: eventFn
        });

        eventTarget.addEventListener(finalType, eventFn);
      }
    }
  };

  /**
   * Register a listener on a Dom element.
   * @param {String} type The event type to listen for
   * @param {Function} listener Event listener function to be remove
   */
  VentsManager.prototype.remove = function(type, listener) {
    var count, register, registerItem, finalType;

    finalType = getFinalEventType(type);
    register = this.get(type);

    if (register) {
      count = register.length;

      while (count--) {
        registerItem = register[count];

        if (listener === registerItem.listener || listener === undefined) {
          registerItem.target.removeEventListener(finalType, registerItem.eventFn);
          register.splice(count, 1);
        }
      }
    }
  };

  /**
   * Execute the event
   * @param {String} type The event type to execute
   */
  VentsManager.prototype.trigger = function(type) {
    var i, register;

    register = this.get(type);

    if (register) {
      for (i = 0; i < register.length; i += 1) {
        register[i].eventFn.call();
      }
    }
  };

  /**
   * @private
   * Return the list of event listeners for a type of event of an eventTarget
   * @param {String} type The event type to listen for
   * @param {Object} eventTarget The event target
   */
  VentsManager.prototype.get = function(type) {
    return type ? eventsRegister[type] : eventsRegister;
  };

  window[exportName] = VentsManager;

})('Vents');
