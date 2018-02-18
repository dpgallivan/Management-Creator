import React, { Component } from 'react';
import './App.css';
import Main from "./components/Main.js";

// import {
//   BrowserRouter as Router,
//   // Link,
//   Route,
//   Switch,
// } from 'react-router-dom';
// import './App.css';

// import CharacterForm from "./components/CharacterForm.js";
// import UserCharacters from "./components/UserCharacters.js";
// // import ShowCharacter from "./components/ShowCharacter.js";

// const firebase = require('firebase');
// const database = require("./components/firebase.js");

// // firebase.auth().signInWithEmailAndPassword("tyler_726@live.com", "RedDragon#7").catch(function(error) {
// // 	// Handle Errors here.
// // 	var errorCode = error.code;
// // 	var errorMessage = error.message;
// // 	// ...
// // });

// firebase.auth().signOut().then(function() {
// 	  // Sign-out successful.
// 	}).catch(function(error) {
// 	  // An error happened.
// });



class App extends Component {

  	render() {
    	return (
    		<Main />
	    );
  	}
}

export default App;
