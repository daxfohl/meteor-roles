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