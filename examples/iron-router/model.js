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
  password1: {
    type: String
  },
  isAdmin: {
    type: Boolean
  },
  id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});