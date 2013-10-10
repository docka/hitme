$(document).ready(function() {

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
	 }

});