// Dependencies
import React, { Component } from "react";
const Moment = require('moment');
const database = require("./firebase.js");

// Constants
const ReservedProperties = ["comments","privacy","updatedAt","createdAt","userKey","key","userName"];

// Displays one character to the user
class ShowComments extends Component {

	state = {
		characterData: undefined,
		comment:"",
		author:""
	};

	// Loads charcter and author to the state
	componentDidMount() {
		this.loadCharacter();
		this.loadAuthor();
	};

	// Loads character from the database based on characterKey
	loadCharacter() {

		// console.log(this.props.characterKey);

		database
			.ref(`allCharacters/${this.props.characterKey}`)
			.once('value')
			.then(char => 
		{

			if(!char.val()) {
				return console.log("Character does not exist at this key");
			}

	    	// console.log(char.val());
	    	this.setState({characterData:char.val()});
	    });
	};

	// Sets current user to the state
	loadAuthor() {

		// console.log(this.props.userKey);

		database
			.ref(`users/${this.props.userKey}`)
			.once('value')
			.then(user => 
		{

			if(!user.val()) {
				return console.log("Error, user should be defined");
			}

	    	// console.log(user.val());
	    	this.setState({author:user.val()});
	    });
	};

	handleInputChange = event => {
	    const { name, value } = event.target;
	    this.setState({
	      [name]: value
		});
	};

	// Displays the character's characteristic
	displayCharacter = character => {

		let charArr = [];

		for(let prop in character) {
			if(!ReservedProperties.includes(prop) && prop !== "name") {
				charArr.push({name:prop,value:character[prop]});
			}
		}

		// console.log(charArr);


		return (

			charArr.map(characteristic => ( 
				<div className="row">
	            	<div className="characterPanel"> 
	            		{characteristic.name}: {characteristic.value} 
	            	</div>
	          	</div>
			))

		)
	};

	// Displays comments stored into character data
	displayComments = commentObj => {

		// returns if there are no comments
		if (!commentObj) {return}

		// Stores into array of comments
		let comments = [];

		for(let key in commentObj) {
			comments.push(commentObj[key]);
		}

		// console.log(comments);

		if(comments.lenght === 0) {return}

		// Turns each comment into a block
		return (
			
			comments.map(comment => (
				<div className="comment">
					<p className="commentBody text-left">{comment.message}</p>
					<p className="author">by {comment.userName} at {this.formatDate(comment.createdAt)}</p>
				</div>
			))

			// comments.map(comment => (
			// 	<div key={comment.userKey+""+comment.createdAt} className="comment">
			// 		<p className="commentBody text-left">{comment.message}</p>
			// 		<p className="author">by {comment.userName} at {(comment.createdAt)}</p>
			// 	</div>
			// ))
			
		)
	};

	// Adds comment to the current character
	uploadComment = event => {
		event.preventDefault();

		// Returns if comment is empty
		if((this.state.comment + "").trim() === "") {
			return
		}

		let newComment = {
			message: (this.state.comment + "").trim(),
			userKey: this.props.userKey,
			userName: this.state.author.name,
			createdAt: Date.now()
		}

		console.log(newComment);

		// Pushes new comment to the datbase
		database.ref(`characters/${this.state.characterData.userKey}/${this.props.characterKey}/comments`)
		.push(newComment).then(() => {
			this.setState({comment:""});
			this.loadCharacter();
		});

	};

	//Formats date from Date timestamp
	formatDate(timestamp) {
		return Moment(timestamp).format("hh:mma MM/DD/YYYY");
	};

	// Renders the page
	render() {
		return (
			<div>
				{this.state.characterData === undefined ? (
					<p>There is no character to show</p>
				) : (

	          			<div className="panel-body">
	          				{this.displayComments(this.state.characterData.comments)}

	          				{this.props.purpose !== "editing" ? (
				              <form>
				              	<input className="form-control" name="comment" type="text" 
				                  onChange={this.handleInputChange}
				                  value={this.state.comment}/>

				                <button className="btn btn-primary" type="submit"  
	              				  onClick={this.uploadComment}>Comment</button>
				              </form>
				              ) : (
				              	<div></div>
				              )
				            }
	          			</div>
				)}
			</div>				
		);
	}
}


export default ShowComments;