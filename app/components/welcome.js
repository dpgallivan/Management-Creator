import React from 'react';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
   firebase.initializeApp({
       apiKey: "AIzaSyB0UihSyhP1Vqa4Xty3BUdpogDcd3nBzNE",
       authDomain: "character-creator-3c5d4.firebaseapp.com",
       databaseURL: "https://character-creator-3c5d4.firebaseio.com",
       projectId: "character-creator-3c5d4",
      storageBucket: "character-creator-3c5d4.appspot.com",
       messagingSenderId: "786656588768"
   });

   const txtEmail = document.getElementById("txtEmail");
   const txtPassword = document.getElementById("txtPassword");
   const btnLogin = document.getElementById("btnLogin");
   const btnSignUp = document.getElementById("btnSignUp");

   //Add Login Eveny
   btnLogin.addEventListener("click", e => {
   //If an event goes unhandled, its default action should not be taken as it normally would be
    event.preventDefault();
      //Get email and password
      const email = $("#txtEmail").val().trim();
      const password = $("#txtPassword").val().trim();
      const auth = firebase.auth();

      //Login
      auth.signInWithEmailAndPassword(email, password)
        .catch(e => alert(e.message));

   });

     //Add Signup Event
   btnSignUp.addEventListener("click", e => {
    //If an event goes unhandled, its default action should not be taken as it normally would be
    event.preventDefault();
    //Get email and password
    const email = $("#txtEmail").val().trim();
    const password = $("#txtPassword").val().trim();
    const auth = firebase.auth();

    console.log(email);
    console.log(password);

    //Sign In
    auth.createUserWithEmailAndPassword(email, password)
      .catch(e => alert(e.message));

   });

   btnLogout.addEventListener("click", e =>{
    firebase.auth().signOut();
   });

   //Add Realtime Listener
   firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
      console.log("User ID is " + firebaseUser.uid)
      btnLogout.classList.remove("hide");
    } else {
      console.log("Not Logged In.");
      btnLogout.classList.add("hide");
    }
   });
  }
   
   render(){
    return(
      //set user iud to use with the users Email------
    <div className="main-container">
      
      <h2>Login Form</h2>

      <form id='form'>

        <div className="container">
          <label><b>Username</b></label>
        <input id="txtEmail" type="text" value="" placeholder="Enter Username" name="uname" required />

        <label><b>Password</b></label>
          <input id="txtPassword" type="password" value="" placeholder="Enter Password" name="psw" required />
          
          <button id="btnLogin" class="btn btn-action" >Login</button>

          <button id="btnSignUp" class="btn btn-secondary">SignUp</button>

          <button id="btnLogout" class="btn btn-action hide">Log Out</button>

        </div>

      </form>
    </div>

    );
  }
}

   
export default Welcome; 


