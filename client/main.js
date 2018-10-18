
// test for variable
var myVar = 10; 
var visjsobj;
var map;
var activeTab = "documentTab "; //Your default tab
var activeTab0 = "allLiteratureTab "; 

// infinit scroll

    Session.set("imageLimit", 8);
    
    lastScrollTop = 0;
    $(window).scroll(function(event){
     if($(window).scrollTop() + $(window).height() > $(document).height() -100) {
        var scrollTop = $(this).scrollTop();
        if (scrollTop > lastScrollTop){
       //    console.log("going down at the bottom of the page");
           Session.set("imageLimit", Session.get("imageLimit") +4);
           } else {
       //    console.log("up");
           }
        lastScrollTop = scrollTop;
       }
    });

   
// update the session current_date
// variable every 1000 ms

Meteor.setInterval(function(){
     Session.set("current_date", new Date());
   }, 1000);

Template.date_display.helpers({
        current_date:function(){
        return Session.get("current_date");
        },
        myVar: function(){
           return myVar;
           }
   });

Meteor.subscribe("images");
Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
//Meteor.subscribe("stations");
Meteor.subscribe("comments");
Meteor.subscribe("spots");
Meteor.subscribe("expandSpots");
Meteor.subscribe("docsessions");
Meteor.subscribe("searchSpots");

//  helpers

Template.available_user_list.helpers({
    users:function(){
     helper = Meteor.users.find();
      return helper;
    }
  });
  
Template.available_user.helpers({
    getUsername:function(userId){
      user = Meteor.users.findOne({_id:userId});
      helper_user = fixObjectKeys(user.profile);
      return helper_user.lastname;
    }, 
    isMyUser:function(userId){
      if (userId == Meteor.userId()){
        return true;
      }
      else {
        return false;
      }
    },
    images:function(){
         return Images.find({usergroup:true}, {sort:{createdOn: -1, rating:-1}});
    }
  });


Template.user_page.helpers({
    whatsUser1Id: function(){
       var docsession = Docsessions.findOne({_id:Session.get("docsessionId")});
       return docsession.user1Id;
    },
    whatsUser2Id: function(){
       var docsession = Docsessions.findOne({_id:Session.get("docsessionId")});
       return docsession.user2Id;
    },
    getUsername:function(userId){
      user = Meteor.users.findOne({_id:userId});
      user_helper = fixObjectKeys(user.profile);
      return user_helper.lastname;
    }, 
    getAvatar:function(userId){
       user = Meteor.users.findOne({_id:userId});
       user_helper = fixObjectKeys(user.profile);
       return user_helper.avatar;
    },
    messages:function(){
      var docsession = Docsessions.findOne({_id:Session.get("docsessionId")});
      return docsession.messages;
    }, 
    other_user:function(){
      return ""
    } 

  });
  
Template.docsession_message.helpers({
     getAvatar: function(owner){
     user = Meteor.users.findOne({_id:owner});
     user_helper = fixObjectKeys(user.profile);
     return user_helper.avatar;
    }
});  


// events

Template.user_page.events({
  // this event fires when the user sends a message on the chat page
  'submit .js-send-user':function(event){
    // stop the form from triggering a page reload
    event.preventDefault();
    // see if we can find a chat object in the database
    // to which we'll add the message
    var docsession = Docsessions.findOne({_id:Session.get("docsessionId")});
    if (docsession){// ok - we have a chat to use
      var msgs = docsession.messages; // pull the messages property
      if (!msgs){// no messages yet, create a new array
        msgs = [];
      }
      // is a good idea to insert data straight from the form
      // (i.e. the user) into the database?? certainly not. 
      // push adds the message to the end of the array
      msgs.push({text: event.target.user.value, owner: Meteor.userId()});
      // reset the form
      event.target.user.value = "";
      // put the messages array onto the chat object
      docsession.messages = msgs;
      // update the chat object in the database.
      Meteor.call("updateDocsession", docsession);
//      Chats.update(chat._id, chat);
    }
  }
 });  
  

Template.images.helpers({
      images:function(){
        if (Session.get("userFilter")){ // filter is set
         return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});
          } else {
              if (Session.get("authorFilter")){ // filter is set
                 return Images.find({author:Session.get("authorFilter")}, {sort:{createdOn: -1, rating:-1}});
              } else {
                   if (Session.get("jauthorFilter")){ // filter is set
                       return Images.find({jauthor:Session.get("jauthorFilter")}, {sort:{createdOn: -1, rating:-1}});
                      } else {
                       return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
                       }
                     } 
                 }
            },
      filtering_images:function(){
        if (Session.get("userFilter")){ // filter is set
          return true;
        } else {
          return false;
          }
        },
       getFilterUser:function(){
         if (Session.get("userFilter")){ // filter is set
         var user = Meteor.users.findOne({_id:Session.get("userFilter")});
         var help_user = fixObjectKeys(user.profile);
            return help_user.lastname;
          } else {
            return false;
         }
       },
      getUser:function(user_id){
         var user = Meteor.users.findOne({_id:user_id});
         var help_user = fixObjectKeys(user.profile);
         if (user){
              return help_user.lastname;
            } else {
             return "anonymous";
             } 
         },
       accountname:function(){
         if (Meteor.user()){
           //    return Meteor.user().emails[0].address;
           var accountname = Meteor.user();
           var help_account = fixObjectKeys(accountname.profile);
           return help_account.lastname;
           }
       },
      images_by_author:function(){
        if (Session.get("authorFilter")){ // filter is set
         return Images.find({author:Session.get("authorFilter")}, {sort:{createdOn: -1, rating:-1}});
          } else {
         return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
         }
      },
      filtering_authors:function(){
        if (Session.get("authorFilter")){ // filter is set
          return true;
        } else {
          return false;
          }
        },
      getFilterAuthor:function(){
         if (Session.get("authorFilter")){ // filter is set
         var author = Images.findOne({author:Session.get("authorFilter")});
            return author.author;
          } else {
            return false;
         }
       },
       images_by_jauthor:function(){
        if (Session.get("jauthorFilter")){ // filter is set
         return Images.find({jauthor:Session.get("jauthorFilter")}, {sort:{createdOn: -1, rating:-1}});
          } else {
         return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
         }
      },
      filtering_jauthors:function(){
        if (Session.get("jauthorFilter")){ // filter is set
          return true;
        } else {
          return false;
          }
        },
      getFilterjAuthor:function(){
         if (Session.get("jauthorFilter")){ // filter is set
         var author = Images.findOne({jauthor:Session.get("jauthorFilter")});
            return author.jauthor;
          } else {
            return false;
         }
       },
       activeTab0: function(tab){
        return ((Session.get("activeTab0") == tab));
      }
   });
   

   
Template.body.helpers({
      username:function(){
       if (Meteor.user()){
       //    return Meteor.user().emails[0].address;
           return Meteor.user().username;
       }
       else {
           return "anonymous user";
       }
       console.log(Meteor.user().emails[0].address);
       return "... who are you?";  
   }
});


 Template.editor.onCreated( () => {
      var testlog = Session.get("docid");
//      console.log("editor", testlog);
 });

Template.editor.helpers({
    docid:function(){
    if (Meteor.user()){
     setupCurrentDocument();
     var testlog2 = Session.get("docid");
//     console.log("editor2", testlog2);
     return testlog2;
    } else {
     alert("Please log in.");
     return false;
    }
   },
    
    // template helper that configures the CodeMirror editor
    // you might also want to experiment with the ACE editor
    config:function(){
      return function(editor){
        var doc = Documents.findOne({_id:Session.get("docid")});
        editor.setOption("lineNumbers", true);
        editor.setOption("mode", "html");
        editor.setOption("smartIndent", true);
        editor.setOption("indentWithTabs", true);
        editor.setOption("lineWrapping", true);
//        editor.setOption("theme", "solarized light");
        
        editor.on("change", function(cm_editor, info){
 //         console.log(cm_editor.getValue());
 //         $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
          Meteor.call("addEditingUser", Session.get("docid"));
        });        
      }
    } 
});
  
Template.editingUsers.helpers({
     users:function(){
        var doc, edtusers, users;
        doc = Documents.findOne({_id:Session.get("docid")});
        if (!doc) {return;}
        edtusers = EditingUsers.findOne({docid:doc._id});
        if (!edtusers) {return;}
        users = new Array();
        var i = 0;
        for (var user_id in edtusers.users){
         //  console.log("adding a user");
         //  console.log(edtusers.users[user_id]);
           users[i] = fixObjectKeys(edtusers.users[user_id]);
           i++;
        }
        return users;
     }
});

Template.station_viz_controls.helpers({
     get_feature_names: function(type){
        var feat_field;
        if (type == "single"){
           feat_field = "single_features";
        }
        station = Stations.findOne();
        if (station != undefined){
           features = Object.keys(station[feat_field]);
           features_a = new Array();
           for (var i=0; i<features.length; i++){
               features_a[i] = {name:features[i]};
           }
           return features_a;
        } else {
          return [];
        }
    },
});

Template.station_feature_list.helpers({
      "get_all_feature_values": function(){
         if (Session.get("feature") != undefined){
           var stations = Stations.find({});
           var features = new Array();
           var ind = 0;
           stations.forEach(function(station){
             console.log(station);
             features[ind] = {
                 author:station.metadata.tags.author,
                 title:station.metadata.tags.title,
                 value:station[Session.get("feature")["type"]][Session.get("feature")["name"]]
                 };
                 ind ++;
             })
             return features;
        } else {
          return [];
          }
     }
});

Template.insertCommentForm.helpers({
    docid:function(){
      return Session.get("docid");
      }
});

Template.commentList.helpers({
  comments:function(){
    return Comments.find({docid:Session.get("docid")});
  }
});

Template.spotSearchList.helpers({
  searchSpots:function(){
    return SearchSpots.find({userId:Meteor.user()._id});
  }
});


Template.insertSpotForm.helpers({
    docid:function(){
      return Session.get("docid");
      },
    searchValueSpot: function(){
      var ret = SearchSpots.findOne({_id:Session.get("searchspotid")});
      return ret.formattedAddress;
      },
    searchValueAddressSpot: function(){
      var ret = SearchSpots.findOne({_id:Session.get("searchspotid")});
      return ret.administrativeLevels;
      },
    searchValueLatitude: function() {
      var ret = SearchSpots.findOne({_id:Session.get("searchspotid")}); 
      return ret.latitude;
    },
    searchValueLongitude: function() {
      var ret = SearchSpots.findOne({_id:Session.get("searchspotid")}); 
      return ret.longitude;
    },
    value_image_id: function() {
      var ret = Session.get("imageid");
      return ret;
    } 
});

Template.expandSpotMeta.helpers({
    docid:function(){
      return Session.get("docid");
      },
    valueExpandSpot: function(){
      var ret = Spots.findOne({_id:Session.get("docid")});
      return ret.travelstation;
      },
    value_doc_id: function() {
      return Session.get("docid");
      },  
    value_image_id: function() {
      var ret = Session.get("imageid");
      return ret;
    } 
});




Template.spotList.helpers({
  spots:  function(){
    return Spots.find({image_id:Session.get("imageid")}, {sort:{travel_date:1}});
  },
  date_format: function(date){
    return date.toJSON().substr(0, 10);
    }
});

Template.expandSpotList.helpers({
  spots:  function(){
    return ExpandSpots.find({doc_id:Session.get("docid")}, {sort:{expand_spot_address:1}});
  }
});



Template.image.helpers({
      documents:function(){
         var whatsBack = Documents.find({image_id:Session.get("imageid")});
 //        console.log("whatsBack", whatsBack, this._id);
         return Documents.find({image_id:Session.get("imageid")});
      },
      activeTab: function(tab){
        return ((Session.get("activeTab") == tab));
      },
     searchspotid:function(){
     setupCurrentSpot();
     return Session.get("searchspotid");
    }, 
      
});   


Template.docMeta.helpers({
     document:function(){
        var ret;
        ret = Documents.findOne({$and: [{_id:Session.get("docid")}, {image_id:Session.get("imageid")}]});
        return ret;
        },
     canEdit:function(){
        var doc;
        doc = Documents.findOne({$and: [{_id:Session.get("docid")}, {image_id:Session.get("imageid")}]});
      //  doc = Documents.findOne({_id:Session.get("docid")});
        if (doc){
           if (doc.owner == Meteor.userId()){
              return true;
           }
        }
        return false;
     }   
});

Template.editableText.helpers({
   userCanEdit: function(doc, Collection) {
      doc = Documents.findOne({_id:Session.get("docid"), owner:Meteor.userId()});
      if (doc){
        return true;
      }
      else {
        return false;
      }
    }
});

Template.spotMeta.helpers({
   spot: function(){
      return Spots.findOne({_id:Session.get("docid")});
      },
   spots:function(){
      return Spots.find({image_id:Session.get("imageid")}, {sort:{travelstation:1}});
      }
});

Template.expandSpotMeta.helpers({
   spot: function(){
      return Spots.findOne({_id:Session.get("docid")});
      },
   spots:function(){
      return Spots.find({image_id:Session.get("imageid")}, {sort:{travelstation:1}});
      }
});

Template.mapSearchSpot.onCreated(function() { 
  GoogleMaps.ready('mapSearchSpot', function(mapSearchSpot) {
    google.maps.event.addListener(mapSearchSpot.instance, 'click', function(event) {
      console.log("tut sich was");
      var nwCoordinates = SearchSpots.findOne({_id:Session.get("searchspotid")});
      if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(nwCoordinates.latitude, nwCoordinates.longitude),
                zoom: 9
                };
       }
     });      
  });
});


//   google.maps.event.trigger(map, 'resize'); 
//   $('#mapSearchSpot').html(Meteor.render(Template.googleMap));

Template.mapSearchSpot.helpers({  
  mapOptions: function() {
    var centerSpot; 
    centerSpot = SearchSpots.findOne({_id:Session.get("searchspotid")});
    var lati = centerSpot.latitude;
    var longi = centerSpot.longitude;
      // Create a marker and set its position.
  
        if (GoogleMaps.loaded()) { 
    

//       Template.instance().$('#mapSearch').data('latitude').value(centerSpot.latitude);
 //          google.maps.event.trigger(mapSearchSpot, 'resize');
 //        Template.instance().$('#mapSearchSpot').data('latitude', centerSpot.latitude, 'longitude', centerSpot.longitude);
//       };
    
//    if (GoogleMaps.loaded()) {
      return {
      
 //       center: new google.maps.LatLng(-37.8136, 144.9631),
        center: new google.maps.LatLng(lati, longi),
        zoom: 9,
        map: mapSearchSpot
     };
    
    }
  }
});

Template.mapSearchSpot.onRendered(function(){
  GoogleMaps.load();
  this.autorun(function(c) {
      var val = SearchSpots.findOne({_id:Session.get("searchspotid")});
    if (GoogleMaps.loaded()) {
      GoogleMaps.create({
        name: 'mapSearchSpot',
        element: document.getElementById('mapSearchSpot'),
        options: {
          center: new google.maps.LatLng(val.latitude, val.longitude),
          zoom: 10
        }
      });

      c.stop();
    }
  });
});



Template.mapSearchSpot.onRendered(function(){
      var handler = _.throttle(function(event, ui){
      var spot_id = Session.get("searchspotid");
         var val = SearchSpots.findOne({_id:spot_id});
         if (GoogleMaps.loaded()) {
             return {
             center: new google.maps.LatLng(val.latitude, val.longitude),
             zoom: 10,
             map: mapSearchSpot,
             };
        }
      });
});



Template.map.helpers({  
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
 //       center: new google.maps.LatLng(-37.8136, 144.9631),
        center: new google.maps.LatLng(35.011343, 137.0694197),
        zoom: 10
      };
    }
  }
});

//Template.images.onRendered(function(){
//    $("ul.nav").tabs;
//});

//Template.image.onRendered(function(){
//    $("ul.nav").tabs;
//});

Template.map.onCreated(function() {  
  GoogleMaps.ready('map', function(map) {
    google.maps.event.addListener(map.instance, 'click', function(event) {
      console.log("click on map"); 
      var click_lat = event.latLng.lat();
      var click_lng = event.latLng.lng();
//      console.log(click_lat, click_lng);
//      Markers.insert({ lat: click_lat, lng: click_lng });
      Meteor.call("updateGeoMarker", click_lat, click_lng);
      if (!Meteor.user()){
    //     if (!this.userId){
         alert("Please log in.");
       } else {
           var id = Meteor.call("addGeoMarker", click_lat, click_lng, function(err, res){
             if (!err){
 //               console.log("event callback received id: "+res);
 // not right      Session.set("docid", res);
            }  
         });
       }
      
      
    });

    // The code shown below goes here
    var markers = {};

    Markers.find().observe({  
      added: function(document) {
        // Create a marker for this document
       var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
         // We store the document _id on the marker in order 
         // to update the document within the 'dragend' event below.
         id: document._id
       });

    // This listener lets us drag markers on the map and update their corresponding document.
    google.maps.event.addListener(marker, 'dragend', function(event) {
      Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
    });

    // Store this marker instance within the markers object.
    markers[document._id] = marker;
  },
  changed: function(newDocument, oldDocument) {
    markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
  },
  removed: function(oldDocument) {
    // Remove the marker from the map
    markers[oldDocument._id].setMap(null);

    // Clear the event listener
    google.maps.event.clearInstanceListeners(
      markers[oldDocument._id]);

    // Remove the reference to this marker instance
    delete markers[oldDocument._id];
  }
});

  });
});


Template.spotMeta.events({
    'click .js-load-spot':function(event){
        Session.set("docid", this._id);
        }
});

Template.insertSpotForm.events({
    'click .js-tog-ok-submit':function(event){
      console.log(event.target.checked);
      var doc = {_id:Session.get("docid"), isOkSubmit:event.target.checked};
      Meteor.call("updateOkSubmit", doc);
    }
});

Template.expandSpotMeta.events({
    'click .js-load-wallner':function(event){
        Session.set("docid", this._id);
        }
});

Template.docMeta.events({
   "click .js-tog-private":function(event){
//      console.log(event.target.checked);
      var doc = {_id:Session.get("docid"), isPrivate:event.target.checked};
      Meteor.call("updateDocPrivacy", doc);
   }
});

Template.spotSearchList.events({
       'click .js-load-search-spot':function(event){
        event.preventDefault();
        Session.set("searchspotid", this._id);
        var centerSpot; 
        centerSpot = SearchSpots.findOne({_id:Session.get("searchspotid")});
        if (GoogleMaps.loaded()) {
        GoogleMaps.create({
            name: 'mapSearchSpot',
            element: document.getElementById('mapSearchSpot'),
            options: {
               center: new google.maps.LatLng(centerSpot.latitude, centerSpot.longitude),
               zoom: 10
            }
        });
      }        
  }
});

Template.spotSearchList.onRendered(function(){
      var handler = _.throttle(function(event, ui){
         Session.set("searchspotid", this._id);
         var val = SearchSpots.findOne({_id:Session.get("searchspotid")});
         if (GoogleMaps.loaded()) {
             return {
             center: new google.maps.LatLng(val.latitude, val.longitude),
             zoom: 10
             };
        }
      });
});




Template.image.events({
   'click .js-add-doc':function(event){
//       event.preventDefault();
       var image_id = Session.get("imageid");
       if (!Meteor.user()){
    //     if (!this.userId){
         alert("Please log in.");
       } else {
         var id = Meteor.call("addDoc", image_id, function(err, res){
             if (!err){
                Session.set("docid", res); 
                var testlogDocAddid = Session.get("docid");
//                console.log("testlogDocAddId", testlogDocAddid);
            }  
         });
       }
   },
   'click .js-load-doc':function(event){
//   console.log("this load doc _id", this._id);
        event.preventDefault();
        Session.set("docid", this._id);
        },
    'click .js-load-image-id':function(event){
//     console.log("this load image _id", this.image_id);
        Session.set("imageid", this.image_id);
        },    
    'click .js-set-image-id':function(event){
        Session.set("imageid", this.images._id);
        },   
   'click #documentTab': function(event){
        Session.set("activeTab", 'documentTab');
   },
   'click #searchSpotTab': function(event){
        Session.set("activeTab", 'searchSpotTab');
        $("#spot_add_form").modal('show');
     },
   'click #addSpotTab': function(event){
        Session.set("activeTab", 'addSpotTab');
   },
   'click #editSpotTab': function(event){
        Session.set("activeTab", 'editSpotTab');
   },
   'click #expandSpotTab': function(event){
        Session.set("activeTab", 'expandSpotTab');
  }

        
});

 
Template.images.events({
    'click .js-image':function(event){
          $(event.target).css("width", "50px");
    },
    'click .js-del-image':function(event){
         var image_id = this._id;
         $("#"+image_id).hide('slow', function() {
           Meteor.call("removeImage", image_id);
         })
    },
    'click .js-rate-image':function(event){
       console.log("you clicked a star");
       var rating = $(event.currentTarget).data("userrating");
       console.log(rating);
       var image_id = this.id;
       console.log(image_id);
       Images.update({_id:image_id}, {$set: {rating:rating}});
       },
       
//    'click .js-show-image-form':function(event){
//       $("#image_add_form").modal('show');
//    },
    'click .js-set-image-filter':function(event){
       Session.set("userFilter", this.owner);
     },
     'click .js-unset-image-filter': function(event){
       Session.set("userFilter", undefined);
     },
     'click .js-set-author-filter':function(event){
       Session.set("authorFilter", this.author);
     },
     'click .js-unset-author-filter': function(event){
       Session.set("authorFilter", undefined);
     },
     'click .js-set-jauthor-filter':function(event){
       Session.set("jauthorFilter", this.jauthor);
     },
     'click .js-unset-jauthor-filter': function(event){
       Session.set("jauthorFilter", undefined);
     },
     'click .js-load-doc':function(event){
        Session.set("docid", this._id);
        },
      'click .js-set-image-id':function(event){
        Session.set("imageid", this._id);
        Session.set("docid", "");
        }, 
     'click #allLiteratureTab': function(event){
        Session.set("activeTab0", 'allLiteratureTab');
     },
     'click #addLiteratureTab': function(event){
        Session.set("activeTab0", 'addLiteratureTab');
        $("#image_add_form").modal('show');
     },
     'click #allAuthorsTab': function(event){
        Session.set("activeTab0", 'allAuthorsTab');
     },
     'click #allTranslatorsTab': function(event){
        Session.set("activeTab0", 'allTranslatorsTab');
     },
     'click #allPublicationsTab': function(event){
        Session.set("activeTab0", 'allPublicationsTab');
     }
     
});

Template.image_add_form.events({
   'submit .js-add-image': function(event){
        event.preventDefault();
      var title, jtitle, category, jcategory, author, jauthor, create_time, jcreate_time, img_src, img_alt;
        title = event.target.title.value;
        jtitle = event.target.jtitle.value;
        category = event.target.category.value;
        jcategory = event.target.jcategory.value;
        author = event.target.author.value;
        jauthor = event.target.jauthor.value;
        create_time = event.target.create_time.value;
        jcreate_time = event.target.jcreate_time.value;
        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        

//        if (Meteor.user()){
//        Images.insert({ 
//           img_src:img_src,  
//           img_alt:img_alt,
//           createdOn:new Date(),
//           createdBy:Meteor.user()._id
//           });
//        }
        if (!Meteor.user()){
    //     if (!this.userId){
         alert("Please log in.");
        } else {
         var id = Meteor.call("addImage", 
                    title, jtitle, category, jcategory, author, jauthor, create_time, jcreate_time, 
                    img_src, img_alt, function(err, res){
             if (!err){
//                console.log("event callback received id: "+res);
	            Session.set("imageid", res);
                Session.set("docid", res);
				var logimageid = Session.get("imageid");
                var logdocumentid = Session.get("docid");
//                console.log("logImageAdded ImageID DocumentID", logimageid, logdocumentid);
            }  
         });
        
        $("#image_add_form").modal('hide');
        return false;  // stops the default event in the browser
       }
     }

});

Template.spot_add_form.events({
   'submit .js-add-spot': function(event){
        event.preventDefault();
      var search_spot;
        search_spot = event.target.search_spot.value;

        if (!Meteor.user()){
    //     if (!this.userId){
         alert("Please log in.");
        } else {
         var id = Meteor.call("searchSpot", 
                   search_spot, function(err, res){
             if (!err){
              Session.set("searchspotid", res);
            }  
         });
        $("#spot_add_form").modal('hide');
        return false;  // stops the default event in the browser
       }
     }

});


Template.station_viz_controls.events({
    "change .js-select-single-feature": function(event){
         event.preventDefault();
         var feature = $(event.target).val();
         Session.set("feature", {name:feature, type:"single_feature"});
    }, 
    "click .js-show-blobs": function(event){
         event.preventDefault();
// HERE:         initBlobVis();
    },
    "click .js-show-timeline": function(event){
         event.preventDefault();
// HERE:         initDateVis();
    },

});



// this renames object keys by removing hyphens to make the compatible 
// with spacebars. 
function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}

// function that creates a new timeline visualisation
function initDateVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var stations = Stations.find({});
  var ind = 0;
  // generate an array of items
  // from the songs collection
  // where each item describes a song plus the currently selected
  // feature
  var items = new Array();
  // iterate the songs collection, converting each song into a simple
  // object that the visualiser understands
  stations.forEach(function(station){
    if (station.metadata.tags.date != undefined && 
      station.metadata.tags.date[0] != undefined ){
      var label = "ind: "+ind;
      if (station.metadata.tags.title != undefined){// we have a title
        label = station.metadata.tags.artist[0] + " - " + 
        station.metadata.tags.title[0];
      }  
      var value = station[Session.get("feature")["type"]][Session.get("feature")["name"]];
      var date = station.metadata.tags.date[0] + "-01-01";
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        // slighlty hacky label -- check out the vis-label
        // class in song_data_viz.css 
        label:{content:label, className:'vis-label', xOffset:-5}, 
      };
      ind ++ ;
  }
  });
  // set up the data plotter
  var options = {
    style:'bar', 
  };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = image.getElementById('visjs');
  // HERE : var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, items, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}

// function that creates a new blobby visualisation
function initBlobVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  // find all songs from the Songs collection
  var stations = Stations.find({});
  var nodes = new Array();
  var ind = 0;
  // iterate the songs, converting each song into 
  // a node object that the visualiser can understand
    stations.forEach(function(station){
      // set up a label with the song title and artist
     var label = "ind: "+ind;
     if (station.metadata.tags.title != undefined){// we have a title
          label = station.metadata.tags.artist[0] + " - " + 
          station.metadata.tags.title[0];
      } 
      // figure out the value of this feature for this song
      var value = station[Session.get("feature")["type"]][Session.get("feature")["name"]];
      // create the node and store it to the nodes array
        nodes[ind] = {
          id:ind, 
          label:label, 
          value:value,
        }
        ind ++;
    })
    // edges are used to connect nodes together. 
    // we don't need these for now...
    edges =[
    ];
    // this data will be used to create the visualisation
    var data = {
      nodes: nodes,
      edges: edges
    };
    // options for the visualisation
     var options = {
      nodes: {
        shape: 'dot',
      }
    };
    // get the div from the dom that we'll put the visualisation into
    // ???????
    //  HERE:  container = document.getElementById('visjs');
// HERE:    container = image.getElementById('visjs');
    // ???????
    // create the visualisation
// HERE:    visjsobj = new vis.Network(container, data, options);
    // ???????

}
  
function setupCurrentDocument() {
    var doc;
   if (!Session.get("docid")) {
      doc = Documents.findOne({$and: [{_id:Session.get("docid")}, {image_id:Session.get("imageid")}]});
 //         doc = Documents.findOne();
       if (doc){
         Session.set("docid", doc._id);
       }
    }
}

function setupCurrentSpot() {
    var doc;

   if (!Session.get("searchspotid")) {
      doc = SearchSpots.findOne({});
 //         doc = Documents.findOne();
       if (doc){
         Session.set("searchspotid", doc._id);
       }
    }
}

