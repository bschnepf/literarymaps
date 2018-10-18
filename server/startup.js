

Meteor.startup(function(){
        
//		if (Images.find().count() == 0){
		
//		    for (var i=1;i<14;i++){
//		       Images.insert(
//		         {
//		         img_src:"image"+i+".png",
//		         img_alt:"document number "+i
//		         }
//		        );
//		    } // end of for statement
//		    Images.insert({img_src:"Bd 3 Nakamura Ise mode.pdf",
//		                   img_alt:"pdf document"});
		   
//   	      Images.insert({
//		             text:"blah blah blah",
//		             img_src:"Basho_okunohosomichi.png", 
//		             img_alt:"Oku no hosomichi / おくのほそ道",
//		             title:"Oku no hosomichi", 
//		             author: "Matsuo Bashō",
//		             create_time: "1692", 
//		             translation:"",
//		             jtitle:"おくのほそ道", 
//		             jauthor: "松尾芭蕉", 
//		             jcreate_time: "1692",
//		             reisestationen: [
//		                     "心ゆく旅にしあれば草枕むすばん夢もをかしからまし",
//		                     "薄雲のまゆ引わたすつくば山霞にこもる春のおもかげ" 
//		             ],
//		             owner: "",
//		             createdOn: new Date()
//		             });
		      
            
//		    console.log("startup.js says: " + Images.find().count());
//	     };	// end of if statement

      if (!Images.findOne()){// no Images yet!
       Images.insert({title:"my first image"});
       }
	
	  if (!Documents.findOne()){// no documents yet!
       Documents.insert({title:"my first document"});
       }
       
       
      if (!Stations.findOne()){
          console.log("loading new...");
      //    var fs = Meteor.npmRequire('fs');
          var fs = Npm.require('fs');
          var files = fs.readdirSync('./assets/app/jsonfiles/');
          var inserted_stations = 0;
          for (var i=0; i<files.length; i++){
              var filename = 'jsonfiles/' + files[i];
              try{
                 var station = JSON.parse(Assets.getText(filename));
                 var single_features = {};
                 var array_features = {};
                 var string_features = {};
                 
                 rhythm_keys = Object.keys(station.rhythm);
                 tonal_keys = Object.keys(station.tonal);
                 for (var j=0; j<rhythm_keys.length; j++){
//                     console.log("type of "+ rhythm_keys[j] + " is "+typeof(station.rhythm[rhythm_keys[j]]));
                     if (typeof(station.rhythm[rhythm_keys[j]]) === 'number') {
                       single_features[rhythm_keys[j]] = station.rhythm[rhythm_keys[j]];
                 		}
      			 	 if (typeof(station.rhythm[rhythm_keys[j]]) === "object" && 
      				   station.rhythm[rhythm_keys[j]].length != undefined){// its an array
      				   array_features[rhythm_keys[j]] = station.rhythm[rhythm_keys[j]];
      				}
      				if (typeof(station.rhythm[rhythm_keys[j]]) === "string"){
      				   string_features[rhythm_keys[j]] = station.rhythm[rhythm_keys[j]];
      				}
      	
      			}        
                for (var j=0;j<tonal_keys.length;j++){
//      				console.log("type of "+tonal_keys[j]+" is "+typeof(station.tonal[tonal_keys[j]]));
      				if (typeof(station.tonal[tonal_keys[j]]) === "number"){
      					single_features[tonal_keys[j]] = station.tonal[tonal_keys[j]];
      				}
      				if (typeof(station.tonal[tonal_keys[j]]) === "object" && 
      					station.tonal[tonal_keys[j]].length != undefined){// its an array
      					array_features[tonal_keys[j]] = station.tonal[tonal_keys[j]];
      				}
      				if (typeof(station.tonal[tonal_keys[j]]) === "string"){
      					string_features[tonal_keys[j]] = station.tonal[tonal_keys[j]];
      				}
      			}
        	// insert the station to the DB:
		 		// 
		 		station.single_features = single_features;
		 		station.array_features = array_features;
		 		station.string_features = string_features;
		 		
		 		Stations.insert(station);
		 		inserted_stations ++;
		 	}catch (e){
		 		console.log("error parsing file "+filename);
		 	}
		}
		console.log("Inserted "+inserted_stations+" new stations...");
	    }


      if (!OcrTextFiles.findOne()){
          console.log("loading new 2...");
      //    var fs = Meteor.npmRequire('fs');
          var fs = Npm.require('fs');
          var files = fs.readdirSync('./assets/app/jsonfiles/OCR-files/Utamakura-OCR/');
          var inserted_ocrTextFiles = 0;
          for (var i=0; i<files.length; i++){
              var filename = 'jsonfiles/OCR-files/Utamakura-OCR/' + files[i];
              try{
                 var ocrTextFile = JSON.parse(Assets.getText(filename));
                 console.log("test2");
                 var chapters = "";
      //			 chapters = ocrTextFile.chapter;

            	// insert the chapter to the DB:
		 		// 
	//	 		ocrTextFile.chapters = chapters;
		 		
		 		OcrTextFiles.insert(ocrTextFile.chapter);
		 		inserted_ocrTextFiles ++;
		 	}catch (e){
		 		console.log("error parsing file "+filename);
		 	}
		}
		console.log("Inserted "+inserted_ocrTextFiles+" new chapters...");
	    }
	    
})

function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}
