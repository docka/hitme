$(document).ready(function() {


    /* THIS BLOCK IS LISTENING FOR CHAT MESSAGES TO THE BIZ
	var myDataRef = new Firebase("https://hitme1.firebaseio.com/");


	//listener for incoming messages
	 myDataRef.on("child_added", function(snapshot){
     	var message = snapshot.val();
     	if (message.name === "Tue"){
     		displayChatMessage(message.name, message.text); 
     	}
     	else{
       		// not for me .. displayChatMessage("anonymous", "not for me");
     	}
     	
     	
      });

	 function displayChatMessage(name,text){
	 	$("<div/>").text(text).prepend($("<em/>").text(name+": ")).appendTo($("#requestDiv"));
	 	$("#requestDiv")[0].scrollTop = $("#requestDiv")[0].scrollHeight;
	 }*/


    //THIS BLOCK IS LISTENING FOR FOOD REQUESTS
    var myDataRef = new Firebase("https://hitme-food.firebaseio.com/food");

     myDataRef.on("child_added", function(snapshot){

        var message = snapshot.val();
        //console.log(message);
        var html = "";
        var deadline = makeDeadline(message.timespan, message.timestamp);
        if (deadline > new Date()){
            $("#foodRequests").append("<hr />");
            if (message.category === "food"){
                html = "<div class='row'>";
                html += "<div class='col-lg-1'>" + message.numPeople + "</div>";
                html += "<div class='col-lg-2'>" + deadline.toString() + "</div>";
                html += "<div class='col-lg-2'>" + message.userID + "</div>";
                html += "<div class='col-lg-2'>" + message.latitude + "</div>";
                html += "<div class='col-lg-2'>" + message.longitude + "</div>";
                html += "<button type='button' class='sendoffers' id='" + message.userID + "'>Send offer</button>"
                html += "</div>";

                $("#foodRequests").append(html);
                //displayChatMessage(message.numPeople, message.text); 
            }
            else{
                // not for me .. displayChatMessage("anonymous", "not for me");
                console.log("Oops, something's wrong with the category.");
            }

        }

        else{
            //this request is in the past and will be ignored

        }
        
      });

     //SEND OFFERS
    $(document).on("click", ".sendoffers", function(){
        console.log(this.id);


    });


    //adds the timespan to the timestamp = the endpoint of the user's interest in offers
    function makeDeadline(extraMinutes, startTime){        
        var start = new Date(startTime); //in milliseconds
        return new Date(start.getTime() + extraMinutes*60000);
     }



     //var responseRef = new Firebase("https://hitme-food.firebaseio.com/messages/89234jhkasdf(#4jejrhwerjkwr");
  



     //RETRIEVE FOOD REQUESTS FROM SERVER
     $("#getRequests").on("click",function(){
        var myDataFoodRef = new Firebase("https://hitme-food.firebaseio.com/");
        myDataFoodRef.once("value", showData, handleFailure);


     });




     function showData(snapshot){
        snapshot.forEach(function(childSnapshot){
            var data = childSnapshot.val();
            console.log(data.category);
        });

        //console.log("Snapshot value: " + x.val());

     }

     function handleFailure(){

            console.log("in handleFailure");
     }
});