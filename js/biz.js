$(document).ready(function() {

    //initialize map
    var map;
    var map_options = {
        center: new google.maps.LatLng(59.32802898755335,18.04190864982911), 
        zoom: 12,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
   
    map = new google.maps.Map($('#map_canvas')[0], map_options); //don't understand the need for [0], but it won't work without it


    //THIS BLOCK IS LISTENING FOR FOOD REQUESTS
    var myDataRef = new Firebase("https://hitme-food.firebaseio.com/food");

     myDataRef.on("child_added", function(snapshot){

        var message = snapshot.val();
       
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
                console.log("numPeople in loop: " + message.numPeople);
                addMarker(message.latitude, message.longitude, message.numPeople);
                //displayChatMessage(message.numPeople, message.text); 
            }
            else{
                // not for me .. displayChatMessage("anonymous", "not for me");
                console.log("Oops, something's wrong with the category.");
                
            }

        }

        else{
            // request is in the past and will be ignored
        }
        
      });

    function addMarker(lat, lon, numPeople){
        var n = numPeople.toString();
        var myLatlng = new google.maps.LatLng(lat,lon);
        var mark = "pics/marker_" + numPeople + ".png";

        marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: n,
              icon: mark
        });

    }

        


     //SEND OFFERS
    $(document).on("click", ".sendoffers", function(){
        var userId = this.id.substring(2,this.id.length);
        console.log("this.id: " + this.id + ", userId: " + userId);
        createOffer(userId, 3533, "Flippin' Burger", "Götgatan 33", 59.31408989, 18.0901262275532, "Gratis dessert", 30, null);

    });


    //adds the timespan to the timestamp = the endpoint of the user's interest in offers
    function makeDeadline(extraMinutes, startTime){        
        var start = new Date(startTime); //in milliseconds
        return new Date(start.getTime() + extraMinutes*60000);
     }



     //var responseRef = new Firebase("https://hitme-food.firebaseio.com/messages/89234jhkasdf(#4jejrhwerjkwr");
    //write offer to database
    function createOffer(userID, bizID, bizName, bizAddress, latitude, longitude, offer, validFor, validUntil){
    
        try
          {
            var myFoodDataRef = new Firebase("https://hitme-offer.firebaseio.com/" + userID);
            myFoodDataRef.push(
                {
                    userID: userID,
                    bizID: bizID,
                    bizName: bizName,
                    bizAddress: bizAddress,
                    latitude: latitude,
                    longitude: longitude,
                    offer: offer,
                    validFor: validFor,
                    validUntil: validUntil
                }
            );
            $("#"+ userID).fadeOut();
          }
        catch(err)
          {
            console.log("Couldn't write to Firebase: " + err.message);
          }
        }




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