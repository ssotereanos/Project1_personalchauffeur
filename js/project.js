  
  $(document).ready(function() {
    $('select').material_select();
  });

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

  function scheduleAlerts(){
  //call mapquest with a particular place and destination
  
  //use 24hr clock for time
  var timeINeedToBeThere = "12-21-2017 20:26:00"; //TODO this will come from the database

  var convertedArriveTime = moment(timeINeedToBeThere, "MM-DD-YYYY hh:mm:ss");
  var estimatedDriveTime = "";
  var minutesToLeave = "";
  var timeToLeave = "";

  var toAddress = "1901 Kelly Blvd, Carrollton, TX 75006";
  var fromAddress = "2555 Esters Rd, Irving, TX 75062";
  var key = "QhcHIGXiz9pts1kgG9Xax98JAk1V0UGh";
  var queryURL = "http://www.mapquestapi.com/directions/v2/route?key="+key+"&from="+fromAddress+"&to="+toAddress;
  var timeFromNowToArrival = "";

  //calling api using the url above
  $.ajax({
    url: queryURL,
    method: "GET"
  })

  //function to run once the api call is completed
  .done(function(response) {
    console.log(response);
    estimatedDriveTime = response.route.time; //drive time in seconds
    
    timeToLeave = convertedArriveTime.subtract(estimatedDriveTime, "seconds");

    console.log("timeToLeave: " + moment(timeToLeave).format("hh:mm:ss"));

  
    //Find out when I need to leave
    //I need to leave today at 7.30
    var now = moment();
    var whenINeedToLeave = timeToLeave.diff(now);
    if(whenINeedToLeave<0){
      alert("Jetson, you're late!");
    } else {
      alert("you still have some time");
    }
    console.log("whenINeedToLeave: "+whenINeedToLeave);

    console.log("estimatedDriveTime " + estimatedDriveTime);
    console.log("convertedArriveTime "+convertedArriveTime);
   
  });
} //close function scheduleAlerts

 function login(){
  var email = $("#input-email").val().toLowerCase();
  var password= $("#input-password").val();
  var userName= email.replace(/\./g,"");
  var pulledUser = null;
  firebase.database().ref("users/"+userName).once("value").then(
          function(snapshot) {
            pulledUser = snapshot.val();
             if(pulledUser!=null && password == pulledUser.password) {
              currentUser = pulledUser;
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
              window.location.replace("profilepage.html");
            } else {
              alert("Unable to login. Please check your email and password");
            } 
         });
 }

  function logout(){
    currentUser = null;
    localStorage.removeItem("currentUser");
    window.location.replace("home.html");
 }


 function signUp(){
 	var firstName = $("#input-firstName").val();
 	var lastName =  $("#input-lastName").val();
 	var email = $("#input-email").val().toLowerCase();
 	var password= $("#input-password").val();
 	var userName= email.replace(/\./g,"");
  //get the list of userNames from the DB
 	user = {firstName:firstName, lastName:lastName, email:email, password:password};
  firebase.database().ref("userNames/"+userName).once("value").then(
          function(snapshot) {
            var userNameFromDB = snapshot.val();
            if(userNameFromDB == null){
              database.ref("userNames/"+userName).set(userName , function(error){console.log(error);});
              database.ref("users/"+userName).set(user);
              currentUser = user;
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
              window.location.replace("profilepage.html");
            } else {
              alert("That email is already in use");
            }
          });
 }

 function completeSignUp(){

 }

 function profileInfoInitialLoad(){
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser ==null){ //not signed in, go back to home page
    window.location.replace("home.html");
  } else {
    $("#logOutLinkId").text("Log Out, "+currentUser.firstName);
    $("#input-firstName").val(currentUser.firstName);
    $("#input-lastName").val(currentUser.lastName);
    $("#input-street").val(currentUser.street);
    $("#input-city").val(currentUser.city);
    $("#input-state").val(currentUser.state);
    $("#input-zipcode").val(currentUser.zip);
    $("#input-phone").val(currentUser.phone);

    $("#"+currentUser.state).prop('selected',true)

    //to update material select component per materializecss doc
    $('#input-state').material_select('destroy');
    $('#input-state').material_select();
  }

 }

 function profileLoadInit() {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser == null){ //not signed in, go back to home page
      window.location.replace("home.html");
    } else {
      $("#logOutLinkId").text("Log Out, "+currentUser.firstName);

    }

 }

 function updateProfile(){
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  var inputFirstName = $("#input-firstName").val();
  var inputlastName = $("#input-lastName").val();
  var inputStreet = $("#input-street").val();
  var inputCity = $("#input-city").val();
  var inputState = $("#input-state").val();
  var inputZip = $("#input-zipcode").val();
  var inputPhone = $("#input-phone").val();

  var newUser = {firstName:inputFirstName, lastName:inputlastName, email:currentUser.email, password:currentUser.password
                 , street:inputStreet, city:inputCity, state:inputState, zip:inputZip, phone:inputPhone};

  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  var userName= (currentUser.email).replace(/\./g,"");
  database.ref("users/"+userName).set(currentUser);
 }


 $('.datepicker').pickadate({
selectMonths: true, // Creates a dropdown to control month
selectYears: 15, // Creates a dropdown of 15 years to control year,
today: 'Today',
clear: 'Clear',
close: 'Ok',
closeOnSelect: false // Close upon selecting a date,
});

 $('.datepicker').pickadate(
{
   selectMonths: true,
   selectYears: -100
});

