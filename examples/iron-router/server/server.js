(function () {
  "use strict";


  Meteor.startup(function () {

    _.each([Listings, Meteor.users], function (collection) {
      collection.allow({
        insert: function() {
          return true;
        },
        update: function() {
          return true;
        },
        remove: function() {
          return true;
        },
        fetch: []
      });
    });

    if (Listings.find().fetch().length === 0) {
      Listings.insert({address:"ec2 password: apple2", agent:"sdifj"});
      Listings.insert({address:"domain registration pw: apple3", agent:"sdfjsijf"});
    }

    if (Meteor.users.find().fetch().length === 0) {
      console.log('Creating users: ');
      var users = [
        {name:"Normal User",email:"normal@example.com",roles:[]},
        {name:"View-listings User",email:"view@example.com",roles:['view-listings']},
        {name:"Manage-Users User",email:"manage@example.com",roles:['manage-users']},
        {name:"Admin User",email:"admin@example.com",roles:['admin']}
      ];
      _.each(users, function (userData) {
        var id;
        console.log(userData);
        id = Accounts.createUser({
          email: userData.email,
          password: "apple1",
          profile: { name: userData.name }
        });
        Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});
        Roles.addUsersToRoles(id, userData.roles);
      });
    }

    Accounts.validateNewUser(function (user) {
      var loggedInUser = Meteor.user();
      if (Roles.userIsInRole(loggedInUser, ['admin','manage-users'])) {
        return true;
      }
      throw new Meteor.Error(403, "Not authorized to create new users");
    });
  });

  Meteor.publish("listings", function () {
    var user = Meteor.users.findOne({_id:this.userId});
    if (Roles.userIsInRole(user, ["admin","view-listings"])) {
      console.log('publishing listings', this.userId);
      return Listings.find();
    }
    this.stop();
  });

  Meteor.publish("users", function () {
    var user = Meteor.users.findOne({_id:this.userId});
    if (Roles.userIsInRole(user, ["admin","manage-users"])) {
      console.log('publishing users', this.userId);
      return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}});
    }
    this.stop();
  });

  Meteor.methods({
    editUser: function(userData) {
      check(userData, UserSchema);
      var id = userData.id;
      Meteor.users.update({_id: id}, {$set:{'emails.0.address': userData.email}});
      Accounts.setPassword(id, userData.password);
      var fn = userData.isAdmin ? Roles.addUsersToRoles : Roles.removeUsersFromRoles;
      fn(id, 'admin');
    }
  });
})();