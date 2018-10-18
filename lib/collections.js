
Images = new Mongo.Collection("images");
EditingUsers = new Mongo.Collection("editingUsers");
Stations = new Mongo.Collection("stations");
Comments = new Mongo.Collection("comments");
this.Documents = new Mongo.Collection("documents");
SearchSpots = new Mongo.Collection("searchSpots"); 
Spots = new Mongo.Collection("spots");
ExpandSpots = new Mongo.Collection("expandSpots");
OcrTextFiles = new Mongo.Collection("ocrTextFiles");
Markers = new Mongo.Collection('markers');  
Docsessions = new Mongo.Collection("docsessions");


console.log("count Images", Images.find().count());
console.log("count Documents", Documents.find().count());
console.log("count Users", Meteor.users.find().count());
console.log("count Stations", Stations.find().count());
console.log("count Comments", Comments.find().count());
console.log("count Spots", Spots.find().count());
console.log("count ExpandSpots", ExpandSpots.find().count());
console.log(OcrTextFiles.find().count());
console.log("neverending counting for you", Markers.find().count());



Images.allow({
	insert:function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	      console.log(doc);
	      //doc.createdBy = userId;
	      //console.log(doc);
	      if (userId != doc.createdBy){ //
	 //        return false; // user and image_owner are not the same
	           return false;
	      } else {
	         return true;   // user and image_owner are the same
	      }
	     } else {
	        return false;  // no user logged in 
	     }
	},
	
	remove:function(userId, doc){
	    return true;
	}


});



EditingUsers.allow({
    insert:	function(userId, doc){
	    return true;
	}
});

Stations.allow({
    insert: function(userID, doc){
        console.log("test securtity on insert-Stations");
        return true;
    }
});

//Comments.allow({
//    insert: function(userID, doc){
//        console.log("test securtity on insert-Comments");
//        return true;
//    }
//});

Comments.attachSchema(new SimpleSchema({
    title: {
       type: String,
       label: "Title",
       max: 200
    },
    body:{
       type: String,
       label: "Comment",
       max: 1000
    },
    docid: {
       type: String,
    },
}));


ExpandSpots.attachSchema(new SimpleSchema({
     expand_spot_address: {
          type: String, 
          label: "Name and address"
          },
     spot_history: {
         type: String,
         label: "Spot history"
         },
     spot_characteristic: {
          type: String,
          label: "Spot characteristic"
          },
     other_literature: {
          type: String,
          label: "Other literature"
          },
     spot_poem_author: {
          type: [String],
          label: "Author of spot poem",
          minCount: 1 
          },
     spot_poem_kanji: {
         type: [String],
         label: "Spot poem (日本語/漢字)",
         minCount: 1
    },
    spot_poem_romaji: {
         type: [String],
         label: "Spot poem (Romaji)",
         minCount: 1 
     },
     spot_poem_german: {
         type: [String],
         label: "Spot poem (German/English)",
         minCount: 1
     },   
     spot_poem_translator: {
         type: [String],
         label: "Translator of spot poem(s)" ,
         minCount: 1 
     },
    createdOn: {
         type: String
     }, 
    userId: {
         type: String
    },
    doc_id: {
         type: String
    },
    image_id: {
        type: String
    }    
}));

   

Spots.attachSchema(new SimpleSchema({
    travelstation: {
        type: String,
        label: "Geographical spot",
        min: 0
    },
   jap_travelstation: {
         type: String,
         label: "Geographical spot (日本語/漢字)"
     
    }, 
    rom_travelstation: {
         type: String,
         label: "Geographical spot (Romaji)"
         },
          
    travel_date: {
         type: Date,
         label: "Date (tt-mm-jjjj)"
        
    },
    jap_travel_date: {
         type: String,
         label: "Date (日本語/漢字: 年 月 日)"
        
    }, 
    weather: {
         type: String,
         label: "Weather"
        
    },
    special_feature: {
         type: String,
         label: "Features and characteristic tics of spot", 
         max: 400
    },

    poem_kanji: {
         type: [String],
         label: "Poem (日本語/漢字)",
         minCount: 1
    },
    poem_romaji: {
         type: [String],
         label: "Poem (Romaji)",
         minCount: 1
     },
    poem_german: {
         type: [String],
         label: "Poem (German/English)",
         minCount: 1
     },
    literary_allusions: {
         type: String,
         label: "Literary allusions"
     },
    createdOn: {
         type: String
     }, 
    userId: {
         type: String
    },
    latitude: {
        type: Number,
        min: -180.0,
        max: 180.0,
        decimal:true
    },
    longitude: {
        type: Number,
        min: -180.0,
        max: 180.0,
        decimal: true
    },
    image_id: {
        type: String
    }          
}));






Spots.allow({
	insert:function(userId, doc){
	   if (Meteor.user()){ 
	//   if (userId == doc.user1Id) {
	       return true;
	//     }
	//   if (userId == doc.user2Id){
	//       return true;
	//    } else {
	//       return false;
	//       } 
	      
        } 
   },
   update: function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	      //doc.createdBy = userId;
	      //console.log(doc);
//	      if (userId != doc.createdBy){ //
	 //        return false; // user and image_owner are not the same
//	           return false;
//	      } else {
	         return true;   // user and image_owner are the same
//	      }
//	     } else {
//	        return false;  // no user logged in 
	     }
	}
});     

ExpandSpots.allow({
	insert:function(userId, doc){
	   if (Meteor.user()){ 
	//   if (userId == doc.user1Id) {
	       return true;
	//     }
	//   if (userId == doc.user2Id){
	//       return true;
	//    } else {
	//       return false;
	//       } 
	      
        } 
   },
   update: function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	      //doc.createdBy = userId;
	      //console.log(doc);
//	      if (userId != doc.createdBy){ //
	 //        return false; // user and image_owner are not the same
//	           return false;
//	      } else {
	         return true;   // user and image_owner are the same
//	      }
//	     } else {
//	        return false;  // no user logged in 
	     }
	}
});     



SearchSpots.allow({
	insert:function(userId, doc){
	   if (Meteor.user()){ 
	//   if (userId == doc.user1Id) {
	       return true;
	//     }
	//   if (userId == doc.user2Id){
	//       return true;
	//    } else {
	//       return false;
	//       } 
	      
        } 
   },
     remove:function(userId, doc){
	    return true;
	}

});     



Docsessions.allow({
	insert:function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	   if (userId == doc.user1Id) {
	       return true;
	     }
	   if (userId == doc.user2Id){
	       return true;
	    } else {
	       return false;
	       } 
	      
  }
}
});


Documents.allow({
	insert:function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	      console.log(doc);
	      //doc.createdBy = userId;
	      //console.log(doc);
//	      if (userId != doc.createdBy){ //
	 //        return false; // user and image_owner are not the same
//	           return false;
//	      } else {
	         return true;   // user and image_owner are the same
//	      }
//	     } else {
//	        return false;  // no user logged in 
	     }
	},
	update: function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	      console.log(doc);
	      //doc.createdBy = userId;
	      //console.log(doc);
//	      if (userId != doc.createdBy){ //
	 //        return false; // user and image_owner are not the same
//	           return false;
//	      } else {
	         return true;   // user and image_owner are the same
//	      }
//	     } else {
//	        return false;  // no user logged in 
	     }
	},
	
	remove: function(userId, doc){
	   if (Meteor.user()){  // user logged in?
	      console.log(doc);
	      //doc.createdBy = userId;
	      //console.log(doc);
//	      if (userId != doc.createdBy){ //
	 //        return false; // user and image_owner are not the same
//	           return false;
//	      } else {
	         return true;   // user and image_owner are the same
//	      }
//	     } else {
//	        return false;  // no user logged in 
	     }
	}
});

OcrTextFiles.allow({
	insert:function(userId, doc){
	//   if (Meteor.user()){ 
	//   if (userId == doc.user1Id) {
	       return true;
	//     }
	//   if (userId == doc.user2Id){
	//       return true;
	//    } else {
	//       return false;
	//       } 
	      
    //    } 
   }

});

Markers.allow({
	insert:function(userId, doc){
	//   if (Meteor.user()){ 
	//   if (userId == doc.user1Id) {
	       return true;
	//     }
	//   if (userId == doc.user2Id){
	//       return true;
	//    } else {
	//       return false;
	//       } 
	      
    //    } 
   }

});     



     