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
        html += "<div class='col-lg-1'>" + message.validFor + "</div>";
        html += "</div>";

        $("#offers").append(html);
        addMarker(message.latitude, message.longitude, message.numPeople);
        //displayChatMessage(message.numPeople, message.text); 
        
        
      });



	
	   

});