$(document).ready(function() {

	var myDataRef = new Firebase("https://hitme1.firebaseio.com/");
		$("#messageInput").keypress(function(e){
			if (e.keyCode == 13){
				var name = $("#nameInput").val();
				var text = $("#messageInput").val();
				myDataRef.push({name: name, text: text});
				$("#messageInput").val("");

			}

		});

	//listener for incoming messages
	 myDataRef.on("child_added", function(snapshot){
     	var message = snapshot.val();
     	displayChatMessage(message.name, message.text); 
      });

	 function displayChatMessage(name,text){
	 	$("<div/>").text(text).prepend($("<em/>").text(name+": ")).appendTo($("#messageDiv"));
	 	$("#messageDiv")[0].scrollTop = $("#messageDiv")[0].scrollHeight;
	 }

/*

var x=document.getElementById("demo");
function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }
function showPosition(position)
  {
  x.innerHTML="Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;	
  }


*/


	$("#findGeo").on("click", function(event){
		

		if(navigator.geolocation){
			console.log("yes, I have geolocation");
			geo = navigator.geolocation;
			if (geo){
				geo.getCurrentPosition(showPosition, function(){
					//handle error
					console.log("PositionError code: " + e.code + ": " + e.message);
				});
				
			}
			else{
				console.log("geo is null");
			}

		}
		else{
			console.log("geolocation not supported");
		}
	//navigator.geolocation.getCurrentPosition(GetLocation);
	
	});


	function showPosition(position)
	  {
	  
	  var coord_lat = position.coords.latitude;
	  var coord_long = position.coords.longitude;
	  var howAccurate = position.coords.accuracy;

	  console.log("Latitude: " + coord_lat + ", longitude: " + coord_long + ", accuracy: " + howAccurate + " meters.");
	  }

	


    

});