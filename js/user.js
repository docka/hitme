$(document).ready(function() {
	  //global variables
	  var map; 
	  var marker; //the dot on the map
	  var lat;
	  var lon;
	  var userID;
	  var numPersons;
	  var minutes = 15; //default waiting time - updated in changeTime()


// SL API KEY 0684fdd18500c8c13433086c0dbd9943

	  checkCookie(); //load or create cookie for identification


	

	  
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
	//$("#createObject").on("click", validateInput);

	function validateInput(){
		//check if everything is alright
		var cat = "food"; //"$("input[name=optionsCategory]:checked").val();"
		var nPeople = numPersons; //$("#numPeople")[0].value;
		//var minutes = $("#timeSpan")[0].value;


		if(userID == null){
			checkCookie();
		}

		console.log("Creating object on server____________");
		console.log("cat: " + cat);
		console.log("nPeople: " + nPeople);
		console.log("latitude: " + lat);
		console.log("long: " + lon);
		console.log("minutes: " + minutes);

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
		var txt = "Please drag the marker to the area where you want to eat.";
		var zoomLevel;
		
		//console.log("I'm in showlocation");
		if(position!=null){
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			accu = position.coords.accuracy;
			zoomLevel = 14;
			//txt = "Please drag the marker to the area where you want to eat.";
		}
		else{
			//geolocation not allowed, set default Stockholm position
			lat = 59.32490206965159;
			lon = 18.069624362207037;
			zoomLevel = 12;
			//txt = "Your browser doesn't allow us to find you automatically. Please drag the marker to where you really are before continuing.";
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


		$("#amountPeople").html(currentId);

		
		
		//going down, colouring white
		for (var i = currentId;i>=1;i--){
			$("#" + nextId + i).attr("src", "pics/silhouette_white.png");

		}

		//going up, colouring black
		for (var y = currentId +1;y<=10;y++){
			$("#" + nextId + y).attr("src", "pics/silhouette_black.png");

		}	
		
	});


	//////////////////////////////////////////
	//										//	
	//		HANDLE THE SECTION CLICKING		//
	//										//
	//////////////////////////////////////////

	//FIRST SECTION 
	//choosing the category - so far food is the only one that works
	$("#chooseFood").on("click", function(){
		
		//$("#chooseEvent").fadeOut();
		//$("#chooseBars").fadeOut();
		//$("#chooseOther").fadeOut();
		$("#firstSection").fadeOut(800, function(){
			$("#secondHeader").prepend("Food it is. ");
			$("#secondSection").fadeIn(800);		
		});
	});


	//SECOND SECTION
	//Clicking on the circle of persons
	$(".persons").on("click", function(){
		
		var currentId = parseInt(this.id.substring(7, this.id.length));
		numPersons= currentId;
		var nextId = "person_";
		//$("#amountPeople").html("<p id='circleText'>" + currentId + "</p>");
		
		
		//going down, colouring white
		for (var i = currentId;i>=1;i--){
			$("#" + nextId + i).attr("src", "pics/silhouette_white.png");

		}

		//going up, colouring black
		for (var y = currentId +1;y<=10;y++){
			$("#" + nextId + y).attr("src", "pics/silhouette_black.png");

		}	
		
	});

	//Hovering on the circle of persons
	$("#amountPeople").on("mouseover", function(){
		//var number = $("#circleText").html();
		//$("#amountPeople").html(number + " <p>Click</p>");
					
	});

	//Clicking on the circle INSIDE the circle of persons
	$("#amountPeople").on("click", function(){
		$("#secondSection").fadeOut(800, function(){
			$("#thirdSection").fadeIn(800);

		});
	
		//var number = $("#amountPeople").html();
		//$("#amountPeople").html(number + " <p>Click</p>");
					
	});

	//THIRD SECTION
	$("#timeSubtract").on("click", function(){
		changeTime("subtract");
	});

	$("#timeAdd").on("click", function(){
		changeTime("add");
	});


	function changeTime(direction){
		var strTime = $("#textTime").html();
		var denominator = strTime.substring(strTime.length-1, strTime.length);
		var number = parseInt(strTime.substring(0, strTime.length-1));

		switch(number){
			case 15:
				if(direction==="add"){
					$("#textTime").html("30m");
					minutes = 30;
				}
				else
				{
					//do nothing, can't go below 15 minutes
				}

			break;

			case 30:
				if(direction==="add"){
					$("#textTime").html("45m");
					minutes = 45;
				}
				else
				{
					$("#textTime").html("15m");
					minutes = 15;
				}

			break;

			case 45:
				if(direction==="add"){
					$("#textTime").html("1h");
					minutes = 60;
				}
				else
				{
					$("#textTime").html("30m");
					minutes = 30;
				}
			break;

			case 1:
				if(direction==="add"){
					$("#textTime").html("2h");
					minutes = 120;
				}
				else
				{
					$("#textTime").html("45m");
					minutes = 45;
				}
			break;

			case 2:
				if(direction==="add"){
					$("#textTime").html("3h");
					minutes = 180;
				}
				else
				{
					$("#textTime").html("1h");
					minutes = 60;
				}
			break;

			case 3:
				if(direction==="add"){
					$("#textTime").html("4h");
					minutes = 240;
				}
				else
				{
					$("#textTime").html("2h");
					minutes = 120;
				}

			break;

			case 4:
				if(direction==="add"){
					$("#textTime").html("5h");
					minutes = 300;
				}
				else
				{
					$("#textTime").html("3h");
					minutes = 180;
				}
			break;

			case 5:
				if(direction==="add"){
					//do nothing, can't go above 5 hours
				}
				else
				{
					$("#textTime").html("4h");
					minutes = 240;
				}
			break;

			default:
				console.log("faulty switch");

		}
		
	}


	$("#textTime").on("click", function(){
		$("#thirdSection").fadeOut(800, function(){
			$("#fourthSection").fadeIn(800);	
			loadGMaps(); //load map	
		});

	});

	//FOURTH SECTION

		$("#createObject").on("click", validateInput);
	   


});