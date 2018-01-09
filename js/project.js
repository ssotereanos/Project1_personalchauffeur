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


//this code is needed by Materialize to instantiate the drop down menu
  $(document).ready(function() {
    $('select').material_select();
  });

function sendTextMessage(phoneNumberToNotify){
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  var queryURL =  "http://app.eztexting.com/sending/messages?format=json";
  var message = "This is "+currentUser.firstName+"'s Personal Chauffeur. "+currentUser.firstName+" will be late today.";
  $.ajax({
    url: queryURL,
    method: "POST",
    data: {User:"PCProject201", Password:"PCProject201", PhoneNumbers:phoneNumberToNotify, Message:message}
  }).fail(function(response){
    console.log("failed");
    console.log(response);
  });
}

  function isWeekDay(day){
    var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return weekDays.includes(day);
  }
  
  function getSchedule(today, theSchedule, isWeekDay){
    var filteredSchedule = [];
    for(key in theSchedule){
      theSchedule[key].key = key; //keep the key that is in the DB, just in case needed for future iterations
      var theDay = theSchedule[key].day;
      if(theDay == today){
        filteredSchedule.push(theSchedule[key]);
      } else if(theDay == "Weekdays" && isWeekDay){
        filteredSchedule.push(theSchedule[key]);
      }
    }
    if(filteredSchedule.length>1) {filteredSchedule.sort(compareFunction)};
    return filteredSchedule;
  }

  function compareFunction(a, b){
    if(a.hour!=b.hour){
      return a.hour - b.hour;
    } else {
      return a.minute - b.minute;
    }
  }

  function scheduleAlerts(){
    checkForAlerts();
    setInterval(checkForAlerts, 600000); //every 10 minutes
  }

  function checkForAlerts(){
    currentUser = localStorage.getItem("currentUser");
    if(currentUser!=null){
        currentUser = JSON.parse(currentUser);
        var theSchedule = currentUser.schedule;
        var todaysSchedule;

        var now = moment();
        var today = now.format("dddd");
        
        if(isWeekDay(today)){
          todaysSchedule = getSchedule(today, theSchedule, true);
        } else {
          todaysSchedule = getSchedule(today, theSchedule, false);
        }

        if(todaysSchedule.length > 0 ){ // there is something on the schedule for today!
            var upcomingTrip = null;
            var timeINeedToBeThere = "";
            var minutesToDeparture = 0;

            for(i=0; i<todaysSchedule.length; i++){
              upcomingTrip = todaysSchedule[i];
              var timeINeedToBeThere = moment();
              timeINeedToBeThere.set('hour', upcomingTrip.hour);
              timeINeedToBeThere.set('minute', upcomingTrip.minute);
              timeINeedToBeThere.set('second', 00);

              minutesToDeparture = timeINeedToBeThere.diff(moment(), 'minutes');
              upcomingTrip = null; //reset here and do the check below
              if(minutesToDeparture>=-15){ //find the first trip I'm not more than 15 mins late for
                upcomingTrip = todaysSchedule[i];
                break;
              }
            }

            if(upcomingTrip!=null){
                var convertedArriveTime = moment(timeINeedToBeThere, "MM-DD-YYYY hh:mm:ss");
                var estimatedDriveTime = "";
                var minutesToLeave = "";
                var timeToLeave = "";

                var toAddress = upcomingTrip.to;
                toAddress = $.trim(toAddress);
                var fromAddress = upcomingTrip.from;
                fromAddress = $.trim(fromAddress);
              
                var key = "QhcHIGXiz9pts1kgG9Xax98JAk1V0UGh";
                var queryURL = "https://www.mapquestapi.com/directions/v2/route?key="+key+"&to="+toAddress+"&from="+fromAddress;

                var timeFromNowToArrival = "";

                //calling api using the url above
               $.ajax({
                  url: queryURL,
                  method: "GET"
                }) .done(function(response) {
                      estimatedDriveTime = response.route.time; //drive time in seconds
                      timeToLeave = convertedArriveTime.subtract(estimatedDriveTime, "seconds");
                      var now = moment();
                      var whenINeedToLeave = timeToLeave.diff(now, 'minutes');
                      
                      console.log("whenINeedToLeave "+whenINeedToLeave);

                      if(whenINeedToLeave<0){
                        var phoneNumberToNotify = upcomingTrip.notifyPhone;
                        if(phoneNumberToNotify!=null && phoneNumberToNotify!=""){
                          var notify = confirm("Text "+upcomingTrip.notifyName+ " that you'll be late?");
                          if(notify){
                            sendTextMessage(phoneNumberToNotify);
                          }
                        }
                        
                      } else if(minutesToDeparture<=60){
                        alert("You have to leave at "+moment(timeToLeave).format("hh:mm") +" to get to your destination on time.");
                      }
                     
                    });
              }// close if(upcomingTrip!=null)
       } // close if statement
    }//close if statement
  } //close function checkForAlerts

 function login(){
  var email = $("#input-email").val().toLowerCase();
  var password= $("#input-password").val();
  var userName= getUserName(email);
  var pulledUser = null;
  firebase.database().ref("users/"+userName).once("value").then(
          function(snapshot) {
            pulledUser = snapshot.val();
             if(pulledUser!=null && password == pulledUser.password) {
              localStorage.setItem("currentUser", JSON.stringify(pulledUser));
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
 	var userName= getUserName(email);
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

 function menuBarInit(){
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

 function saveSchedule(){
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  var inputDay = $("#input-day").val();
  var inputFromStreet = $("#input-fromstreet").val();
  var inputFromZip = $("#input-fromzip").val();
  var inputToStreet = $("#input-tostreet").val();
  var inputToZip = $("#input-tozip").val();
  var inputHour = $("#input-hour").val();
  var inputMin = $("#input-minute").val();
  var inputAmpm = $("#input-ampm").val();
  var notifyPhone = $("#input-notificationNumber").val();
  var notifyName = $("#input-notificationName").val();

  if(inputAmpm == "PM"){
    if(inputHour!=12){
      inputHour = Number(inputHour) + 12;
    }
  } else { //if AM
    if(inputHour == 12){ // if 12AM
      inputHour = 0;
    }

  }

  var scheduleEntry = { day: inputDay, from:inputFromStreet+","+inputFromZip, 
                        to:inputToStreet+","+inputToZip, 
                        hour:inputHour, minute:inputMin, notifyPhone:notifyPhone, notifyName: notifyName};
 

  database.ref("users/"+getUserName(currentUser.email)+"/schedule").push(scheduleEntry);
  firebase.database().ref("users/"+getUserName(currentUser.email)).once("value").then(
          function(snapshot) {
              currentUser = snapshot.val();
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
         });
  alert("Your changes have been saved.");

 }

 function getUserName(email){
    return email.replace(/\./g,"");
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

