(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('underscore'), require('backbone'), require('backbone.eventrouter'), require('backbone.marionette'), require('marionette.toolkit')) : typeof define === 'function' && define.amd ? define(['underscore', 'backbone', 'backbone.eventrouter', 'backbone.marionette', 'marionette.toolkit'], factory) : global.Marionette.Toolkit.RouterApp = factory(global._, global.Backbone, global.EventRouter, global.Marionette, global.Toolkit);
})(this, function (_, Backbone, EventRouter, Marionette, Toolkit) {
  'use strict';

  var RouterApp = Marionette.Toolkit.RouterApp = Toolkit.App.extend({
    constructor: function constructor() {
      this.configRoutes();

      this.router = new this.EventRouter({
        routeTriggers: this._routeTriggers
      });

      this.bindRouteEvents();

      // if the app does not handle a given route, stop
      this.listenTo(this.router, 'noMatch', this.stop);

      Toolkit.App.apply(this, arguments);
    },

    // attaches parentRoutes and childRoutes
    // for each route in the hash creates a routeTriggers hash
    configRoutes: function configRoutes() {
      this._eventRoutes = _.extend({}, _.result(this, 'eventRoutes'));

      this._routeTriggers = _.mapObject(this._eventRoutes, function (val, key, list) {
        if (val.route) {
          return val.route;
        }
        // if no route is given this key is not a routeTrigger
        list[key] = null;
      });
    },

    // backbone.eventrouter
    // override with custom eventrouter
    EventRouter: Backbone.EventRouter,

    // handle route events
    // accepts a hash of 'some:event' : 'actionFunction'
    // listens to the router channel and calls the appropriate
    // action via the routeAction handler
    bindRouteEvents: function bindRouteEvents() {
      var channel = this.router.getChannel();
      _.each(this._eventRoutes, function (action, event) {
        //handle eventRoute definitions
        if (action.action) {
          action = action.action;
        }
        this.listenTo(channel, event, _.partial(this.routeAction, event, action));
      }, this);
    },

    // applys the route's action
    // starts this routerapp if necessary
    // triggers before and after events
    routeAction: function routeAction(event, action) {
      var eventArgs = _.tail(arguments, 2);

      if (!this.isRunning()) {
        this.start();
      }

      this.triggerMethod('before:route', event, eventArgs);

      if (!_.isFunction(action)) {
        action = this[action];
      }

      if (action) {
        action.apply(this, eventArgs);
      }

      this.triggerMethod('route', event, eventArgs);
    },

    // handler that ensures one running app per type
    startApp: function startApp(appName, options) {
      options = _.extend({}, _.result(this, 'routeOptions'), options);

      this.stopCurrent();

      var app = this.getChildApp(appName).start(options);

      this.setCurrent(app);

      return app;
    },

    setCurrent: function setCurrent(app) {
      this._current = app;
    },

    getCurrent: function getCurrent() {
      return this._current;
    },

    stopCurrent: function stopCurrent() {
      if (this._current) {
        this._current.stop();
      }
      return this;
    },

    // takes an event and translates data into the applicable url fragment
    translateEvent: function translateEvent(event) {
      var route = this.router.getDefaultRoute(event);

      return this.router.translateRoute(route, _.drop(arguments, 0));
    },

    // takes an event and changes the URL without triggering or adding to the history
    replaceRoute: function replaceRoute() {
      var url = this.translateEvent.apply(this, arguments);

      Backbone.history.navigate(url, { trigger: false, replace: true });
    }
  });

  var routerapp = RouterApp;

  return routerapp;
});
//# sourceMappingURL=./marionette.toolkit.routerapp.js.map