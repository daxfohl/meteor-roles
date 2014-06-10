"use strict";

Meteor.navigateTo = function (path) {
  Router.go(path);
};

function emailVerified (user) {
  return _.some(user.emails, function (email) {
    return email.verified;
  });
}

var filters = {
  authenticate: function (pause) {
    if (Meteor.loggingIn()) {
      console.log('filter: loading');
      this.render('loading');
      this.layout('layout_no_header');
      pause();
    } else {
      var user = Meteor.user();
      if (!user) {
        console.log('filter: signin');
        this.render('signin');
        this.layout('layout_no_header');
        pause();
      } else if (!emailVerified(user)) {
        console.log('filter: awaiting-verification');
        this.render('awaiting-verification');
        this.layout('layout');
      } else {
        console.log('filter: done');
        this.layout('layout');
      }
    }
  }
};

Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found'
});

Router.map(function () {
  this.route('start', {
    path: '/',
    onBeforeAction: [filters.authenticate, filters.testFilter]
  });

  this.route('start', {
    onBeforeAction: [filters.authenticate, filters.testFilter]
  });

  this.route('signin');

  this.route('secrets', {
    onBeforeAction: filters.authenticate
  });

  this.route('manage', {
    onBeforeAction: filters.authenticate
  });

  this.route('signout', {
    onBeforeAction: App.signout
  });

  this.route('*', {
    template: 'not_found'
  });
});