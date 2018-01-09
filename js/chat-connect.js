 var config = {
    apiKey: "AIzaSyDlJaTqcjD9QIn32QvbABqQ3VbfEo_3Mhw",
    authDomain: "thepersonalchauffeur-77695.firebaseapp.com",
    databaseURL: "https://thepersonalchauffeur-77695.firebaseio.com",
    projectId: "thepersonalchauffeur-77695",
    storageBucket: "",
    messagingSenderId: "41772839969"
  };

  firebase.initializeApp(config);
  var database = firebase.database();
  var currentUser = null;
  var otherUser = null;


//this code is needed by Materialize to instantiate the drop down menu
  $(document).ready(function() {
    $('select').material_select();
  });


function chat(){


 $("#materialize-textarea").click(function(event){
  	event.preventDefault();
  	var message = $("#materialize-textarea").val();
  	if(isNullOrEmpty(message)){
  		
        		alert("Please enter a message");
  	} else if (currentUser==null){
  		
  		alert("#");
    }else {
  	    $("#chat-input").val(""); // empty out the textbox
        var chatMessage = {name: currentUser.name, message:message, timeStamp:firebase.database.ServerValue.TIMESTAMP}
        database.ref("chat").push(chatMessage);
  	}
  });


 function checkName(){

 }