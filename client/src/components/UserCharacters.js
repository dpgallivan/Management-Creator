// Dependencies
import React, { Component } from "react";

import CharacterForm from "./CharacterForm.js";
import ShowComments from "./ShowComments.js";

const database = require("./firebase.js");

// Constants
const ReservedProperties = ["comments","privacy","updatedAt","createdAt","userKey","key","userName"];

// Displays all user characters or all public characters
class UserCharacters extends Component {

	state = {
		characters: []
	};

	// Load user's characters if userKey or loads public characters
	componentDidMount() {

		if (this.props.viewing) {
			this.loadPublicCharacters();
		}

		else if(this.props.userKey)
			this.loadUserCharacters();
	};

	// Recieves User's characters from database
	loadUserCharacters = () => {

		let characters = [];

		// Gets characters from database
		database.ref(`characters/${this.props.userKey}`)
		  .orderByChild('updatedAt')
		  .once('value')
		  .then(function(snapshots) {
		  
		  // Adds each character to array
		  snapshots.forEach(function(char) {
		    characters.push(char.val());
		  });

		  this.setState({characters:characters.reverse()});

		}.bind(this));

	};

	// Loads public characters from database
	loadPublicCharacters = () => {

		let characters = [];

		// Gets characters from database
		database.ref(`allCharacters`)
		  .orderByChild('updatedAt')
		  .once('value')
		  .then(function(snapshots) {
		  
		  // Only displays character if public
		  snapshots.forEach(function(char) {
		  	if(char.val().privacy === "public") {
		    	characters.push(char.val());
		  	}
		  });

		  this.setState({characters:characters.reverse()});

		}.bind(this));
	};


	// Displays the characters characteristic
	displayCharacter = character => {

		let charArr = [];

		// Creates a list of characteristic
		for(let prop in character) {
			if(!ReservedProperties.includes(prop) && prop !== "name") {
				charArr.push({name:prop,value:character[prop]});
			}
		}

		// Maps the array of characteristic to display it to the page
		return (

			charArr.map(char => ( 
	            <div key={char.name} className="characteristic"> {char.name}: {char.value} </div>
			))

		)
	};

  	goToEdit = charKey => {
  		this.setState({charToEdit:charKey});
  	};

  	finishEdit = () => {
  		this.loadUserCharacters();
  		this.setState({charToEdit:""});
  	};

  	updateCharacterList = () => {
  		if (this.props.viewing) {
			this.loadPublicCharacters();
		}

		else if(this.props.userKey)
			this.loadUserCharacters();
  	};

	// Renders the page
	render() {

		return (
			

			<div className="pure-g">
				<div className="pure-u-2-3">
					<div className ="content-wrapper">
						<div className="content">

							{!this.state.characters.length ?(
								<p>No characters to display</p>
							):(null)}

							{this.state.charToEdit ?(
								<CharacterForm characterKey={this.state.charToEdit} userKey={this.props.userKey} finishEdit={this.finishEdit}/>
							):(

							<div>
								<button className="btn btn-default refreshBtn" onClick={() => this.updateCharacterList()}>Refresh List</button>
								{this.state.characters.map(character => (
									<div key={character.name+":"+character.createdAt} className="panel panel-default">
										<div className="panel-heading panel-heading-custom">
				            				

				            				{character.name ? (
								              <h1 className="panel-title"> {character.name} </h1>
								              ) : (
								              <h1 className="panel-title"> Awaiting Name </h1>
								              )
								            }

								            {this.props.viewing ?(
					          					<h1 className="panel-title"> by {character.userName} </h1>
					          				):(<div></div>)}
				          				</div>

				          				<div className="panel-body">
				          					{this.displayCharacter(character)}
				          				</div>

				          				{!this.props.viewing ?(
				          					<button className="btn btn-primary" onClick={() => this.goToEdit(character.key)}>Edit</button>
				          				):(<div></div>)}

				          				<ShowComments userKey={this.props.userKey} characterKey={character.key} />
				          				
									</div>

								
								))}

							</div> )}
						</div>
					</div>
				</div>
			</div>
			
				
		);
	}
}


export default UserCharacters;