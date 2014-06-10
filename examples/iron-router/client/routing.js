(function () {
  "use strict";

  Meteor.navigateTo = function (path) {
    Router.go(path);
  };

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
      onBeforeAction: filters.authenticate
    });

    this.route('start', {
      onBeforeAction: filters.authenticate
    });

    this.route('signin');

    this.route('listings', {
      onBeforeAction: filters.authenticate
    });

    this.route('createListing', {
      path: '/listings/create',
      onBeforeAction: filters.authenticate
    });

    this.route('editListing', {
      path: '/listings/:id/edit',
      onBeforeAction: [filters.authenticate, function(){
        Session.set("currentListingId", this.params.id);
        console.log(Session.get("currentListingId"));
      }]
    });

    this.route('removeListing', {
      path: '/listings/:id/delete',
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
})();