Meteor.methods({
   addComment: function(comment){
       if (this.userId){ 
           comment.createdOn = new Date();
           comment.userId = this.userId;
           return Comments.insert(comment);
           }
       return;    
    },

   addSpot: function(spot){
       if (this.userId){ 
           spot.createdOn = new Date();
           spot.userId = this.userId;
           return Spots.insert(spot);
           }
       return;    
    },
    
   updateSpot: function(spot, spot_id){
       var val;
       if (this.userId) {
         val = Spots.upsert({_id:spot_id},spot);
       } 
       return; 
    },
    
   addExpandSpotMeta: function(spot){
       if (this.userId){ 
           spot.createdOn = new Date();
           spot.userId = this.userId;
           return ExpandSpots.insert(spot);
           }
       return;    
    },
  
  
               
   addDoc: function(image_id){
     var doc, edtdoc, image__id;
     image__id = image_id
//     doc = Documents.findOne();
//     if (!doc){return;}
     if (!this.userId) {return;}
  //   if (!Meteor.user()) { return; }
     else {
        edtdoc = {owner:this.userId, 
                image_id:image__id,
               createdOn: new Date(),              
               title:"please insert title"
              };
     var id = Documents.insert(edtdoc);
     return id;         
     }
   },
   

   addImage: function(title0, jtitle0, category0, jcategory0, author0, 
          jauthor0, create_time0, jcreate_time0, img_src0, img_alt0){
     var img, edtimage, edtuser;
     var title, jtitle, category, jcategory, author, jauthor, 
         create_time, jcreate_time, img_src, img_alt, usergroup;
        title = title0;
        jtitle = jtitle0;
        category = category0;
        jcategory = jcategory0;
        author = author0;
        jauthor = jauthor0;
        create_time = create_time0;
        jcreate_time = jcreate_time0;
        img_src = img_src0;
        img_alt = img_alt0;
        usergroup = false;
   //  doc = Documents.findOne();
   //  if (!doc){return;}
     if (!this.userId) {return;}
  //   if (!Meteor.user()) { return; }
     else {
        if (Meteor.user().profile.usergroup) 
           {usergroup = true;}
        edtimage = {
              // owner:this.userId, 
               createdOn: new Date(),
               title: title,
               jtitle: jtitle,
               category: category,
               jcategory: jcategory,
               author: author,
               jauthor: jauthor,
               create_time: create_time,
               jcreate_time: jcreate_time,
               img_src: img_src,
               img_alt: img_alt,
               owner:Meteor.user()._id,
               usergroup: usergroup,
              };
     var id = Images.insert(edtimage);
     return id;         
     }
   },
   
   searchSpot: function(searchSpot0){
     var searchSpot, result, i, id, val;
     var geo = new GeoCoder();
     searchSpot = searchSpot0;
     result = geo.geocode(searchSpot);
     if (!this.userId) {return;}
     if (SearchSpots.findOne()){
           SearchSpots.remove({userId:Meteor.user()._id}); }
//             SearchSpots.remove({});}
  //   if (!Meteor.user()) { return; }
  　　for (i = 0; i < result.length; i++) { 
               id = SearchSpots.insert(result[i]);
               val = SearchSpots.upsert({_id:id},{$set:{userId: this.userId}});
      }
     return id;         
   },
   
   removeImage: function(image_id){
     var doc, image__id, ret, ID;
     ID = Meteor.user()._id;
     image__id = image_id;
     doc = Images.findOne({_id:image__id});
     if (!doc){return;}
     if (ID != doc.owner) {return;}
  //   if (!Meteor.user()) { return; }
     else {
     ret = Images.remove(doc);
     return ret;       
     }
   },
   
   updateDocPrivacy:function(doc){
      var realDoc = Documents.findOne({_id:doc._id, owner:this.userId});
      if (realDoc) {
         realDoc.isPrivate = doc.isPrivate;
         Documents.update({_id:doc._id}, realDoc);
      
      }
   },

   updateDocsessions:function(docsession){
      var realDocsession = Docsessions.findOne({_id:docsession._id});
      if (realDocsession) {
         realDocsession.messages = docsession.messages;
         Docsessions.update({_id:docsession._id}, realDocsession);
      
      }
   },

   addEditingUser:function(doc_id) {
     var doc, user, edtusers;
       doc = Documents.findOne({_id:doc_id});
       if (!doc){return;} 
       if (!this.userId){return;}
       user = Meteor.user().profile;
       edtusers = EditingUsers.findOne({docid:doc._id});
       if (!edtusers){
         edtusers = {
           docid:doc._id,
           users:{},
           };
        }
        user.lastEdit = new Date();
        edtusers.users[this.userId] = user;
       // remember: users ist NOT an array
        ID = Meteor.user()._id;
        edtusers.users[ID] = user;
        EditingUsers.upsert({_id:edtusers._id}, edtusers); 
     },
     
   addGeoMarker: function(lat, lng){
       var newpoint;
       var geo = new GeoCoder();  
       var result = geo.reverse(lat,lng);
       if (!this.userId){return;}
        else {
          newpoint = {owner: this.userId,
                      createdOn: new Date(),
                      lat: lat,
                      lng: lng, 
                      result: result
                      };
        var id = Markers.insert(newpoint);
        console.log("addGeoMarker: got an id "+id);
        return id;
        }
        }
     
})

