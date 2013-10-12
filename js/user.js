$(document).ready(function() {
	  //global variables
	  var map; 
	  var marker; //the dot on the map
	  var lat;
	  var lon;
	  var userID;

	  checkCookie(); //load or create cookie for identification

	  loadGMaps(); //load map

	  
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


		//LISTENING FOR INCOMING MESSAGES FROM FIREBASE
	 /* myDataRef.on("child_added", function(snapshot){
     	var message = snapshot.val();
     	displayChatMessage(message.name, message.text); 
      }); */

		/*
	 function displayChatMessage(name,text){
	 	$("<div/>").text(text).prepend($("<em/>").text(name+": ")).appendTo($("#messageDiv"));
	 	$("#messageDiv")[0].scrollTop = $("#messageDiv")[0].scrollHeight;
	 }*/


	//GATHER DATA AND SEND TO FIREBASE AS JSON-OBJECT
	$("#createObject").on("click", validateInput);

	function validateInput(){
		//check if everything is alright
		var cat = $("input[name=optionsCategory]:checked").val();
		var nPeople = $("#numPeople")[0].value;
		var minutes = $("#timeSpan")[0].value;
		if(userID == null){
			checkCookie();
		}

		sendToServer(cat, nPeople, lat, lon, minutes);
	}

	function sendToServer(category, people, latitude, longitude, minutes){
		var timestamp = new Date;
		var milliDate = timestamp.getTime();

	
		try
		  {
		  	var myFoodDataRef = new Firebase("https://hitme-food.firebaseio.com/" + category);
		  	myFoodDataRef.push(
				{
					category: category,
					numPeople: people,
					timespan: minutes,
					latitude: latitude,
					longitude: longitude,
					timestamp: milliDate,
					userID: userID
				}
			);
		  }
		catch(err)
		  {
		  	console.log("Couldn't write to Firebase: " + err.message);
		  }
		}




	


	//google map
	function loadGMaps(){

 	 	if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(showLocation, function(e){
				console.log("PositionError code: " + e.code + ": " + e.message);
				showLocation(null);

			}); 
		}

		else{
			console.log("Geolocation not supported");
		}

	}

	//if geolocation was a success, find and show position
	function showLocation(position){
		//var lat;
		//var lon;
		var accu;
		var map_options;
		var txt;
		var zoomLevel;
		

		if(position!=null){
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			accu = position.coords.accuracy;
			zoomLevel = 14;
			txt = "We have located you to the red marker on the map. If this is way off, just drag the marker and drop it where you really are.";
		}
		else{
			//geolocation not allowed, set default Stockholm position
			lat = 59.32490206965159;
			lon = 18.069624362207037;
			zoomLevel = 12;
			txt = "Your browser doesn't allow us to find you automatically. Please drag the marker to where you really are before continuing.";
		}

		//make map
		map_options = {
			center: new google.maps.LatLng(lat,lon),
			zoom: zoomLevel,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		$("#whereareyou").html(txt);
		
		map = new google.maps.Map($('#map_canvas')[0], map_options); //don't understand the need for [0], but it won't work without it

		var myLatlng = new google.maps.LatLng(lat,lon);

		marker = new google.maps.Marker({
		      position: myLatlng,
		      map: map,
		      draggable: true,
		      title: 'You are here!'
		});
		google.maps.event.addListener(marker, "mouseup", function(){
			lat = marker.getPosition().lat();
			lon = marker.getPosition().lng();
			moveToLocation(lat,lon);
		}); 

		//RE-CENTER THE MAP
		function moveToLocation(lat, lon){
    		var center = new google.maps.LatLng(lat, lon);
   			map.panTo(center);
}


	}
	   

});