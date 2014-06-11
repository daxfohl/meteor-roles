Listings = new Meteor.Collection('listings', {
  schema: {
    agent: {
      type: String,
      label: "Agent"
    },
    address: {
      type: String,
      label: "Address",
      max: 200
    }
  }
});

UserSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: {
    type: String
  },
  confirmPassword: {
    type: String,
    custom: function() {
      if (this.value !== this.field('password').value) {
        return "passwordMismatch";
      }
    }
  },
  isAdmin: {
    type: Boolean
  },
  id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});
UserSchema.messages({
  passwordMismatch: "[label] does not match Password"
})