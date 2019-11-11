(function () {
	
	// import * as admin from 'firebase-admin';
	//
	// var serviceAccount = require("///Users/cicelyb/Documents/TheGreatHunt/serviceAccountKey.json");
	//
	// admin.initializeApp({
	//   credential: admin.credential.cert(serviceAccount),
	//   databaseURL: "https://thegreathunt-se.firebaseio.com"
	// });
	//
	
  // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCZgw9WqwtdxdkPY3wzHj7cwxkBu-ebLI8",
      authDomain: "thegreathunt-se.firebaseapp.com",
      databaseURL: "https://thegreathunt-se.firebaseio.com",
      projectId: "thegreathunt-se",
      storageBucket: "thegreathunt-se.appspot.com",
      messagingSenderId: "823305800998"
    };
    firebase.initializeApp(config);
	
}());