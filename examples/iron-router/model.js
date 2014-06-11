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

NewUserSchema = new SimpleSchema({
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
  }
});

EditUserSchema = new SimpleSchema({
  id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  isAdmin: {
    type: Boolean
  }
});

AdminChangePasswordSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  userEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  newPassword: {
    type: String
  },
  confirmPassword: {
    type: String,
    custom: function() {
      if (this.value !== this.field('newPassword').value) {
        return "newPasswordMismatch";
      }
    }
  }
});

UserChangePasswordSchema = new SimpleSchema({
  oldPassword: {
    type: String
  },
  newPassword: {
    type: String
  },
  confirmPassword: {
    type: String,
    custom: function() {
      if (this.value !== this.field('newPassword').value) {
        return "newPasswordMismatch";
      }
    }
  }
});

SimpleSchema.messages({
  passwordMismatch: "[label] does not match Password",
  newPasswordMismatch: "[label] does not match New Password"
})