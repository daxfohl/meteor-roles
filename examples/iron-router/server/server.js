Meteor.FilterCollections.publish(Listings, {
  name: 'listings',
  callbacks: {/*...*/}
});

Meteor.publish("users", function () {
  var user = Meteor.users.findOne({_id:this.userId});
  if (Roles.userIsInRole(user, 'admin')) {
    console.log('publishing users', this.userId);
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}});
  }
  this.stop();
});

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

  //noinspection JSUnusedLocalSymbols
  Accounts.validateNewUser(function (user) {
    var loggedInUser = Meteor.user();
    if (Roles.userIsInRole(loggedInUser, 'admin')) {
      return true;
    }
    throw new Meteor.Error(403, "Not authorized to create new users");
  });
});

//noinspection JSUnusedGlobalSymbols
Meteor.methods({
  newUser: function(formData) {
    check(formData, NewUserSchema);
    var id = Accounts.createUser({
      email: formData.email,
      password: formData.password
    });
    if (formData.isAdmin) {
      Roles.addUsersToRoles(id, 'admin');
    }
  },
  deleteUser: function(formData) {
    check(formData, DeleteUserSchema);
    Meteor.users.remove(formData.id);
  },
  editUser: function(formData) {
    check(formData, EditUserSchema);
    var id = formData.id;
    Meteor.users.update({_id: id}, {$set:{'emails.0.address': formData.email}});
    var fn = formData.isAdmin ? Roles.addUsersToRoles : Roles.removeUsersFromRoles;
    fn(id, 'admin');
  },
  adminChangePwd: function(formData) {
    check(formData, AdminChangePasswordSchema);
    Accounts.setPassword(formData.userId, formData.newPassword);
  }
});