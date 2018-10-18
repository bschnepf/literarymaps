// routing

Router.configure({
   layoutTemplate: 'ApplicationLayout'
   });
   


Router.route('/', function() {
          this.render('welcome', {to: "main"}); 
});


/*
  this.render('Home', {
    data: function () { return Items.findOne({_id: this.params._id}); }
  });
*/
Router.route('/main2', function() {
          this.render('main2', {to: "main"});
});


Router.route('/images', function() {
          this.render('navbar', {to:"navbar"});  
          this.render('images', {to:"main"})
       
});



Router.route('/image/:_id', function() {
          this.render('navbar', {to: "navbar"})
          this.render('image',  {
          to:"main", 
             data:function() {
                return Images.findOne({_id:this.params._id});
                }
             });
});

Router.route('/main_user_page', function() {
          this.render('navbar', {to:"navbar"});  
          this.render('main_user_page', {to:"main"})
       
});

//Router.route('/', function () {
//  this.render("navbar", {to:"header"});
//  this.render("docList", {to:"main"});  
//});

// individual document page
//Router.route('/documents/:_id', function () {
//  console.log("you hit /documents  "+this.params._id);
//  Session.set("docid", this.params._id);
//  this.render("navbar", {to:"navbar"});
//  this.render("image", {to:"main"});  
//});

Router.route('/documents/:_id', function () {
//  console.log("you hit /documents  "+this.params._id);
  console.log("documents");
  Session.set("docid", this.params._id);
  this.render("navbar", {to:"navbar"});
  this.render("image", {to:"main",
     docid: function(){
           return Documents.findOne({_id:this.params._id});
            }
     });        
   this.render("editor", {to:"image"});
});



Router.route('/docsession/:_id', function () {
    // the user they want to chat to has id equal to 
    // the id sent in after /chat/... 
    var otherUserId = this.params._id;
    console.log("I am here.");
    // find a chat that has two users that match current user id
    // and the requested user id
    var filter = {$or:[
                {user1Id:Meteor.userId(), user2Id:otherUserId}, 
                {user2Id:Meteor.userId(), user1Id:otherUserId}
                ]};
    var docsession = Docsessions.findOne(filter);
    if (!docsession){// no chat matching the filter - need to insert a new one
      docsessionId = Docsessions.insert({user1Id:Meteor.userId(), user2Id:otherUserId});
    }
    else {// there is a chat going already - use that. 
      docsessionId = docsession._id;
    }
    if (docsessionId){// looking good, save the id to the session
      Session.set("docsessionId",docsessionId);
    }
    this.render("navbar", {to:"header"});
    this.render("user_page", {to:"main"});  
  });




/*
Router.configure({
   layoutTemplate: 'ApplicationLayout'
   });
   
Router.route('/image/:_id', function() {
       this.render('navbar', {to:"navbar"})
       this.render('image', {
         data:function(){
           console.log(this.params._id);
           // var img=
           return Images.findOne({_id:this.params._id});
           },
        });
        // console.log(this.params._id);
    })
  
 */   

