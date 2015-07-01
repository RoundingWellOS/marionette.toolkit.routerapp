import _ from 'underscore';
import Backbone from 'backbone';
import EventRouter from 'backbone.eventrouter'; // eslint-disable-line
import Marionette from 'backbone.marionette';
import Toolkit from 'marionette.toolkit';

var RouterApp = Marionette.Toolkit.RouterApp = Toolkit.App.extend({
  constructor: function() {
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
  configRoutes: function() {
    this._eventRoutes = _.extend({}, _.result(this, 'eventRoutes'));

    this._routeTriggers = _.mapObject(this._eventRoutes, function(val, key, list) {
      if(val.route) {
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
  bindRouteEvents: function() {
    var channel = this.router.getChannel();
    _.each(this._eventRoutes, function(action, event) {
      //handle eventRoute definitions
      if(action.action) {
        action = action.action;
      }
      this.listenTo(channel, event, _.partial(this.routeAction, event, action));
    }, this);
  },

  // applys the route's action
  // starts this routerapp if necessary
  // triggers before and after events
  routeAction: function(event, action) {
    var eventArgs = _.tail(arguments, 2);

    if(!this.isRunning()) {
      this.start();
    }

    this.triggerMethod(`before:route`, event, eventArgs);

    if(!_.isFunction(action)) {
      action = this[action];
    }

    if(action) {
      action.apply(this, eventArgs);
    }

    this.triggerMethod('route', event, eventArgs);
  },

  // handler that ensures one running app per type
  startApp: function(appName, options) {
    options = _.extend({}, _.result(this, 'routeOptions'), options);

    this.stopCurrent();

    var app = this.getChildApp(appName).start(options);

    this.setCurrent(app);

    return app;
  },

  setCurrent: function(app){
    this._current = app;
  },

  getCurrent: function() {
    return this._current;
  },

  stopCurrent: function() {
    if(this._current) {
      this._current.stop();
    }
    return this;
  },

  // takes an event and translates data into the applicable url fragment
  translateEvent: function(event) {
    var route = this.router.getDefaultRoute(event);

    return this.router.translateRoute(route, _.drop(arguments, 0));
  },

  // takes an event and changes the URL without triggering or adding to the history
  replaceRoute: function() {
    var url = this.translateEvent.apply(this, arguments);

    Backbone.history.navigate(url, { trigger: false, replace: true });
  }
});


export default RouterApp;
