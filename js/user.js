$(document).ready(function() {
	  //global variables
	  var map; 
	  var marker; //the dot on the map
	  var lat;
	  var lon;
	  var userID;
	  var numPersons;


// SL API KEY 0684fdd18500c8c13433086c0dbd9943

	//BUTTONS FADING


	$("#chooseFood").on("click", function(){
		$("#chooseEvent").fadeOut();
		$("#chooseBars").fadeOut();
		$("#chooseOther").fadeOut();
		$("#secondRow").show();

		


	});

	$("#chooseEvent").on("click", function(){
		$("#chooseFood").fadeOut();
		$("#chooseBars").fadeOut();
		$("#chooseOther").fadeOut();

	});




	  checkCookie(); //load or create cookie for identification


	  loadGMaps(); //load map

	  
	  function checkCookie(){
	  	
	  	var cooc = document.cookie; 
	  	
	  	if(cooc!=null && cooc!=""){
	  		//yes
	  		//console.log("Cookie exists: " + cooc);
	  		userID = cooc.substring(cooc.indexOf("=") + 1,cooc.length);
	  		//console.log("Userid: " + userID);
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



	//GATHER DATA AND SEND TO FIREBASE AS JSON-OBJECT
	$("#createObject").on("click", validateInput);

	function validateInput(){
		//check if everything is alright
		var cat = "food"; //"$("input[name=optionsCategory]:checked").val();"
		var nPeople = numPersons; //$("#numPeople")[0].value;
		var minutes = $("#timeSpan")[0].value;
		if(userID == null){
			checkCookie();
		}

		sendToServer(cat, nPeople, lat, lon, minutes);
		//window.location.href = "offerlist.html";
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
				}, function(){
					window.location.href = "offerlist.html";
				}
			);
		  		
		  }
		catch(err)
		  {
		  	console.log("Couldn't write to Firebase: " + err.message);
		  }

		}




	//cc


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


	//HOVERING ON PERSONS
	$(".persons").on("mouseover", function(){
		
		var currentId = parseInt(this.id.substring(7, this.id.length));
		numPersons= currentId;
		var nextId = "person_";
		$("#amountPeople").html(currentId + " people");
		
		
		//going down, colouring white
		for (var i = currentId;i>=1;i--){
			$("#" + nextId + i).attr("src", "pics/silhouette_white.png");

		}

		//going up, colouring black
		for (var y = currentId +1;y<=10;y++){
			$("#" + nextId + y).attr("src", "pics/silhouette_black.png");

		}	
		
	});

	
	   


});