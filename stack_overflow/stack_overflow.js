Questions = new Meteor.Collection("questions");
Answers = new Meteor.Collection("answers");

if (Meteor.isClient) {

  Template.app.events({

    'click input.nameBut' : function () {
      var insName = $(".nameBox").val();
      $(".nameBox").val('');
      if (insName){
        Session.set("username", insName);
      }
    },

    'click input.logOut' : function () {
      Session.set("username", undefined);
    },

    'click input.questionBut' : function () {
      var newQues = $(".questionBox").val();
      $(".questionBox").val('');
      var curUs = Session.get("username");
      Questions.insert({name:curUs, question:newQues, createdAt:new Date()});
    },

    'click' : function(){
      Session.set("questionChosen",this._id);
    }

  });

  Template.question.events({

    'submit form.writeAnswer' : function(e){
      e.preventDefault();
      var ques = this._id;
      var ans = $(e.target[0]).val();
      $(e.target[0]).val('');
      var curUs = Session.get("username");
      console.log({name:curUs, question:ques, answer:ans, createdAt: new Date()});
      Answers.insert({name:curUs, question:ques, answer:ans, createdAt: new Date()});
    },

  });

  Template.app.questions = function(){
    return Questions.find({}, {sort: {createdAt:-1}});
  };

  Template.app.username_inserted = function(){
    return !Session.equals("username", undefined);
  };

  Template.app.sel_name = function(){
    return Session.get("username");
  };

  Template.app.ques_chos = function(){
    return Session.get("questionChosen");
  };

  Template.question.username_inserted = function(){
    return !Session.equals("username", undefined);
  };

  Template.question.answers = function(){
    var ques = this._id;
    return Answers.find({ question : ques }, {sort: {createdAt:-1}});
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.Router.add({
      '/':"app",
      '/questions/:id':function(id){
        Session.set('questionChosen', id);
        return 'showQuestion';
      }
    })

    // Meteor.Router.add('/questions/:id.xml', 'GET', function(id){
    //   return constructXMLFofId(Questions.findOne(id));
    // });

  });
}














