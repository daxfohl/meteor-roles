"use strict";

Meteor.navigateTo = function (path) {
  // ...over-ridden in routing.js
};

App.signout = function () {
  console.log('logging out...');
  Meteor.logout(function () {
    console.log('...done');
    Meteor.navigateTo('/');
  });
};

// stubs for IE
if (!window.console) {
  window.console = {}
}
if (!window.console.log) {
  window.console.log = function (msg) {
    $('#log').append('<br /><p>' + msg + '</p>')
  };
}

// fix bootstrap dropdown unclickable issue on iOS
// https://github.com/twitter/bootstrap/issues/4550
$(document).on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) {
  e.stopPropagation();
});

Deps.autorun(function () {
  // register dependency on user so subscriptions
  // will update once user has logged in
  var user = Meteor.user();
  // listings
  Meteor.subscribe('listings');
  // users, for manage-users page
  Meteor.subscribe('users');
});

AutoForm.addHooks(['createListingForm', 'editListingForm', 'removeListingForm'], {
  onSuccess: function() {
    Router.go(Router.routes['listings'].path());
  }
});

AutoForm.addHooks(['userChangePwdForm'], {
  onSubmit: function (formData) {
    var template = this.template;
    Accounts.changePassword(formData.oldPassword, formData.newPassword, function(error) {
      if (error == null) {
        Router.go(Router.routes['listings'].path());
      }
      template.find('#error').innerText = error;
    });
    return false;
  }
});

AutoForm.addHooks(['createUserForm', 'editUserForm', 'deleteUserForm', 'adminChangePwdForm'], {
  onSuccess: function() {
    Router.go(Router.routes['manage'].path());
  }
});

Template.signin.rendered = function () {
  // auto-trigger accounts-ui login form dropdown
  Accounts._loginButtonsSession.set('dropdownVisible', true);
};

Template.header.events({
  // template data, if any, is available in 'this'
  'click .btn-navbar' : openCloseNav
});

Template.header.helpers({
  displayName: function () {
    return displayName();
  }
});

Template.editListing.helpers({
  listing: function () {
    return Listings.findOne({_id: Session.get("currentListingId")});
  }
});

Template.removeListing.helpers({
  listing: function () {
    return Listings.findOne({_id: Session.get("currentListingId")});
  }
});

Template.editUser.helpers({
  user: function () {
    var user = Meteor.users.findOne({_id: Session.get("currentUserId")});
    console.log(user.emails[0].address);
    return {
      id: user._id,
      email: user.emails[0].address,
      isAdmin: Roles.userIsInRole(user, 'admin')
    };
  }
});

Template.deleteUser.helpers({
  user: function () {
    var user = Meteor.users.findOne({_id: Session.get("currentUserId")});
    console.log(user.emails[0].address);
    return {
      id: user._id,
      email: user.emails[0].address
    };
  }
});

Template.adminChangePwd.helpers({
  user: function () {
    var user = Meteor.users.findOne({_id: Session.get("currentUserId")});
    console.log(user.emails[0].address);
    return {
      userId: user._id,
      userEmail: user.emails[0].address
    };
  }
});

Template.manage.helpers({
  users: function () {
    return Meteor.users.find();
  },
  email: function () {
    return this.emails[0].address;
  },
  roles: function () {
    if (!this.roles) return '<none>';
    return this.roles.join(',');
  }
});

function displayName (user) {
  var name;
  if (!user) {
    user = Meteor.user();
  }
  if (!user) return "<missing user>";
  if (user.profile) {
    name = user.profile.name;
  }
  if ('string' === typeof name) {
    name = name.trim();
  } else {
    name = null;
  }
  if (!name && user.emails && user.emails.length > 0) {
    name = user.emails[0].address;
  }
  return name || "<missing name>";
}


// insta-open/close nav rather than animate collapse.
// this improves UX on mobile devices
function openCloseNav (e) {
  // Select .nav-collapse within same .navbar as current button
  var nav = $(e.target).closest('.navbar').find('.nav-collapse');
  if (nav.height() != 0) {
    // If it has a height, hide it
    nav.height(0);
  } else {
    // If it's collapsed, show it
    nav.height('auto');
  }
}

//noinspection JSUnusedGlobalSymbols
var ListingsFilter = new Meteor.FilterCollections(Listings, {
  name: 'listings',
  template: 'listings',
  sort: {
    order: ['desc', 'asc'],
    defaults: [
      ['agent', 'desc'],
      ['address', 'desc']
    ]
  },
  pager: {
    options: [100, 50, 25, 10, 5],
    itemsPerPage: 5,
    currentPage: 1,
    showPages: 5,
  },
  filters: {
    "agent": {
      title: 'Agent',
      operator: ['$regex', 'i'],
      condition: '$or',
      searchable: 'required'
    },
    "address": {
      title: 'Address',
      operator: ['$regex', 'i'],
      condition: '$or',
      searchable: 'required'
    }
  }
});
