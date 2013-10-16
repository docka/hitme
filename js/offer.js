$(document).ready(function() {
	  //global variables
	  var map; 
	  var marker; //the dot on the map
	  var lat;
	  var lon;
	  var userID;

	  checkCookie(); //load or create cookie for identification

	  	  
	  function checkCookie(){
	  	
	  	var cooc = document.cookie; 
	  	
	  	if(cooc!=null && cooc!=""){
	  		//yes
	  		//console.log("Cookie exists: " + cooc);
	  		userID = cooc.substring(cooc.indexOf("=") + 1,cooc.length);
	  		console.log("Userid: " + userID);
	  	}
	  	else{
	  		//no
	  		console.log("No cookie. Creating one now.");
	  		//setting new cookie, expiring tomorrow
	  		var exdate = new Date();
	  		exdate.setDate(exdate.getDate() + 1);
	  		document.cookie = "biddit_user=" + Math.random() + "; expires=" + exdate.toUTCString();
	  	}
	  }


    var map_options = {
        center: new google.maps.LatLng(59.32802898755335,18.04190864982911), 
        zoom: 12,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
   
    map = new google.maps.Map($('#map_canvas')[0], map_options); //don't understand the need for [0], but it won't work without it

	 //THIS BLOCK IS LISTENING FOR OFFERS
    var myDataRef = new Firebase("https://hitme-offer.firebaseio.com/" + userID.substring(2,userID.length));

     myDataRef.on("child_added", function(snapshot){

        var message = snapshot.val();
        var html = "";
        //var deadline = makeDeadline(message.timespan, message.timestamp);

        html = "<div class='row'>";
        html += "<div class='col-lg-3'>" + message.bizName + "</div>";
        html += "<div class='col-lg-3'>" + message.bizAddress + "</div>";
        html += "<div class='col-lg-4'>" + message.offer + "</div>";
        html += "<div class='col-lg-2'>" + message.validFor + "</div>";
        html += "</div>";

        $("#offers").append(html);
        addMarker(message.latitude, message.longitude, message.offer);
        //displayChatMessage(message.numPeople, message.text); 
        
        
      });


     //plot the offers on a map
    function addMarker(lat, lon, numPeople, offerTxt){
        var n = numPeople.toString();
        var myLatlng = new google.maps.LatLng(lat,lon);
        //var mark = "pics/marker_" + numPeople + ".png";

        marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: offerTxt
        });

    }


     //initialize map
    /*var map;
    var map_options = {
        center: new google.maps.LatLng(59.32802898755335,18.04190864982911), 
        zoom: 12,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
   
    map = new google.maps.Map($('#map_canvas')[0], map_options); //don't understand the need for [0], but it won't work without it

    var request = {
  			reference: 'CnRkAAAAGnBVNFDeQoOQHzgdOpOqJNV7K9-c5IQrWFUYD9TNhUmz5-aHhfqyKH0zmAcUlkqVCrpaKcV8ZjGQKzB6GXxtzUYcP-muHafGsmW-1CwjTPBCmK43AZpAwW0FRtQDQADj3H2bzwwHVIXlQAiccm7r4xIQmjt_Oqm2FejWpBxLWs3L_RoUbharABi5FMnKnzmRL2TGju6UA4k'
		};

	service = new google.maps.places.PlacesService(map);
	service.getDetails(request, callback);

	function callback(place, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  	
	    createMarker(place);
	  }
	}
*/


	
	   

});