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
  var currentUser = JSON.parse(localStorage.getItem("currentUser"));


//this code is needed by Materialize to instantiate the drop down menu
  $(document).ready(function() {
    $('select').material_select();
  });

