# Marionette.Toolkit.RouterApp
[![Travis build status](http://img.shields.io/travis/RoundingWellOS/marionette.toolkit.routerapp.svg?style=flat)](https://travis-ci.org/RoundingWellOS/marionette.toolkit.routerapp)
[![Code Climate](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit.routerapp/badges/gpa.svg)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit.routerapp)
[![Test Coverage](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit.routerapp/badges/coverage.svg)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit.routerapp)
[![Dependency Status](https://david-dm.org/RoundingWellOS/marionette.toolkit.routerapp.svg)](https://david-dm.org/RoundingWell/RouterApp)

Coupling [`backbone.eventrouter`](https://github.com/RoundingWellOS/backbone.eventrouter) with a [`marionette.toolkit.app`](https://github.com/RoundingWellOS/marionette.toolkit)


## Example
```js
var RouterApp = Marionette.Toolkit.RouterApp.extend({
  eventRoutes:{
    'foo:event' : {
      action : 'showFoo',
      route  : 'foo/list'
    },
    'bar:event': {
      action : 'showBar',
      route  : 'bar/:id'
    }
  },

  childApps: function(){
    return {
      foo: FooToolkitApp,
      bar: BarToolkitApp
    };
  },

  showFoo: function() {
    this.startApp('foo');
  },

  showBar: function(id){
    this.startApp('bar', { id : id });
  }
});
```
