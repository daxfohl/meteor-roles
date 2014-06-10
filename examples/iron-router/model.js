(function () {
  "use strict";

  Meteor.listings = new Meteor.Collection('listings', {
    schema: {
      agent: {
        type: String,
        label: "Agent",
        max: 200
      },
      address: {
        type: String,
        label: "Address"
      }
    }
  });
})();
