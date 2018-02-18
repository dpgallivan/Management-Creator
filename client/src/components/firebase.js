const firebase = require('firebase');

// Initialize Firebase
const config = {
    apiKey: "AIzaSyB0UihSyhP1Vqa4Xty3BUdpogDcd3nBzNE",
    authDomain: "character-creator-3c5d4.firebaseapp.com",
    databaseURL: "https://character-creator-3c5d4.firebaseio.com",
    projectId: "character-creator-3c5d4",
    storageBucket: "character-creator-3c5d4.appspot.com",
    messagingSenderId: "786656588768"
};

firebase.initializeApp(config);

const database = firebase.database();


database.ref("characters").on("child_changed",function(user) {
	database.ref(`characters/${user.key}`).on("child_added",function(char) {
		let nextChar = char.val();
		nextChar.userKey = user.key;
		database.ref(`allCharacters/${char.key}`).update(nextChar);
	});

});

database.ref("characters").on("child_added",function(user) {
	database.ref(`characters/${user.key}`).on("child_added",function(char) {
		let thisChar = char.val();
		thisChar.userKey = user.key;
		database.ref(`allCharacters/${char.key}`).update(thisChar);

		database.ref(`characters/${user.key}/${char.key}`).on("child_removed", function(trait) {
			database.ref(`allCharacters/${char.key}/${trait.key}`).remove();
		});
	});

	database.ref(`characters/${user.key}`).on("child_removed",function(char) {
		database.ref(`allCharacters/${char.key}`).remove();
	});
});

database.ref("users").on("child_removed",function(user) {
	database.ref(`characters/${user.key}`).remove();
});

module.exports = database;