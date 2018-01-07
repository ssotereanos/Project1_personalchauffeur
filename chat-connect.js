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

//Let users sign-in & logout//
  function SignIn() {

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
              window.location.replace("Connet.html");
            } else {
              alert("Unable to login. Please check your email and password");
            } 

  };

   function logout(){
    currentUser = null;
    localStorage.removeItem("currentUser");
    window.location.replace("home.html");
 }