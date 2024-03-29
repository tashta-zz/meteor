// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

var randomize = function () {
  return Math.floor(Random.fraction()*10)*5;
};

if (Meteor.isClient) {

  Template.leaderboard.players = function () {
    Session.setDefault("sortToggle", "score");
    if (Session.get("sortToggle") === "score"){
      return Players.find({}, {sort: {name: 1, score: -1}});
    } else {
      return Players.find({}, {sort: {score: -1, name: 1}});
    }
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.sortingParameter = function () {
    return Session.get("sortToggle");
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.sort': function() {
      if (Session.get("sortToggle")==="name"){
        Session.set("sortToggle", "score");
      } else {
        Session.set("sortToggle", "name");
      }
    },
    'click input.random': function () {
      Players.update(Session.get("selected_player"),  {$set: {score: randomize()}});
    },
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: randomize()});
    }
  });
}
