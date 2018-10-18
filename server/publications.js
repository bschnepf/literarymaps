Meteor.publish("documents", function(){
     return Documents.find({
     $or:[
            {isPrivate:{$ne:true}},
            {owner:this.userId}
            ]
     });       
})

Meteor.publish("docsessions", function(){
    return Docsessions.find({
    $or:[
          {user1Id: this.userId},
          {user2Id: this.userId}
          ]
    });      
})

Meteor.publish("images", function(){
     return Images.find({});
})

Meteor.publish("editingUsers", function(){
     return EditingUsers.find({});
})

Meteor.publish("comments", function(){
     return Comments.find({});
})

Meteor.publish("stations", function(){
     return Stations.find({});     
})

Meteor.publish("spots", function(){
     return Spots.find({});
})

Meteor.publish("searchSpots", function(){
     return SearchSpots.find({});
})

Meteor.publish("expandSpots", function(){
     return ExpandSpots.find({});
})

Meteor.publish("markers", function(){
     return Markers.find({});
})
