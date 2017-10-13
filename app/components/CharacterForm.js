// Dependencies
import React, { Component } from "react";
const database = require("./firebase.js");

// Constants
const DefaultCharacteristics = ["name","age","gender"]; // Every Creation has at least these properties
const ReservedProperties = ["comments","privacy","updatedAt","createdAt","userKey"];

// Form users use to create/edit to character and stores info to the database
class CharacterForm extends Component {
  state = {
    name:"",
    gender:"",
    age:"",
    newProperty:""
  };

  // If component mounts and there was a characterKey passed, fills the form for edit mode
  componentDidMount() {
    if(this.props.characterKey) {
      this.fillForm(this.props.characterKey);
    }
  };

  // Using userKey and characterKey, fills the form with the selected character
  fillForm = key => {
    database.ref(`characters/${this.props.userKey}/${this.props.characterKey}`).once('value').then(char => {
      if(!char.val()) {
        console.log("Character not found");
      }
      // console.log(char.val());
      this.setState(char.val());
    })
  };

  // Updates the state with the values from the form when they are changed
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // Creates form based on the current state
  createForm = () => {
    let stateObj = this.state;
    let characteristics = [];

    // Pushes each charteristic to an array
    // Doesn't use reserved properties or properties with value undefined
    for (let key in stateObj) {
      if(key !== "newProperty" 
        && !ReservedProperties.includes(key)
        // && (!!stateObj[key] || stateObj[key] === '')
        && stateObj[key] !== undefined
      ) {
        characteristics.push(key);
      }
    }

    // console.log(characteristics);

    // Displays all characteristics to the page and gives non-default characteristics a delete button
    return (
      characteristics.map(characteristic => (
      <div key={characteristic} className="form-group">
          <label htmlFor={characteristic}>{characteristic}</label>
          <input className="form-control" name={characteristic} type="text" 
            onChange={this.handleInputChange}
            value={this.state[characteristic]}/>

          {!DefaultCharacteristics.includes(characteristic) ? (
              <button className="btn btn-primary"
                onClick={() => this.deleteProperty(characteristic)}
                > Delete 
              </button>
            ):(
              <span></span>
            )
          }
      </div>
      ))
    )
  };

  // Set the value of the state property as undefined to remove it from the form
  deleteProperty = characteristic => {

    this.setState({
      [characteristic]:undefined
    })

  };

  // Adds new characteristic to the form by adding a new propertey to the state
  addProperty = event => {
    event.preventDefault();

    let newProp = (this.state.newProperty+ "").trim();

    if (newProp === "") {return}

    // Adds property if it's unique
    if(this.isUniqueCharacteristic(newProp)) {

      this.setState({
        [newProp]:"",
        newProperty:""
      });

    }

    else {
      this.setState({
        newProperty:""
      });
    }

  };

  // Checks if a characterisitc is unique
  isUniqueCharacteristic = characteristic => {

    // Checks if chracteristic is a reserved property
    if(ReservedProperties.includes(characteristic)) {
      console.log("This Property is Reserved");
      return false;
    }

    let stateObj = this.state;

    // Check if characteristic has a property value in the state
    if(stateObj[characteristic] !== undefined) {
      return false;
    }

    // this.setState({
    //   [characteristic]:""
    // });

    return true;
  };

  // Creates a new character and pushes to database
  handleCreation = event => {
    event.preventDefault();

    let stateObj = this.state;
    let output = {};

    let isEmpty = true;

    // Sets outputed data for the database in output object
    for(let key in stateObj) {
      if(key 
        && key !== "newProperty" 
        // && (!!stateObj[key] || stateObj[key] === '' || stateObj[key] === 0) ) 
        && stateObj[key] !== undefined
      ){

        if((stateObj[key] + "").trim() !== "") {
          isEmpty = false;
        }
        
        output[key] = (stateObj[key] + "").trim();
      }

      else if (stateObj[key] === undefined) {
        output[key] = null;
        isEmpty = false;
      }
    }

    // Won't push to database if all fields are empty
    if (isEmpty) {
      return
    }

    let currentTime = Date.now();

    output.createdAt = currentTime;
    output.updatedAt = currentTime;
    output.privacy = "private";

    // console.log(output);

    // Pushes character to the database
    database.ref(`characters/${this.props.userKey}`).push(output);

    // Sets each property in the state to empty string
    let empty = {};

    for (let key in stateObj) {
      if(stateObj[key] !== undefined) {
        empty[key] = "";
      }
    }

    this.setState(empty);
  };

  // Updates the selected character in the database
  handleEdit = event => {
    event.preventDefault();

    let stateObj = this.state;
    let output = {};

    let isEmpty = true;

    // Sets outputed data for the database in output object
    for(let key in stateObj) {
      if(key 
        && key !== "newProperty" 
        && !ReservedProperties.includes(key)
        // && (!!stateObj[key] || stateObj[key] === '' || stateObj[key] === 0) ) 
        && stateObj[key] !== undefined
      ){
        if((stateObj[key] + "").trim() !== "") {
          isEmpty = false;
        }

        output[key] = (stateObj[key] + "").trim();
      }

      else if (stateObj[key] === undefined) {
        output[key] = null;
        isEmpty = false;
      }
    }

    // Won't push to database if all fields are empty
    if (isEmpty) {
      return
    }

    let currentTime = Date.now();

    output.updatedAt = currentTime;

    console.log(output);

    // Updates character in the database
    database.ref(`characters/${this.props.userKey}/${this.props.characterKey}`).update(output);
    database.ref(`allCharacters/${this.props.characterKey}`).update(output);
  };

  
  // Renders the form to the page using the state
  render() {
    return (
      <div>
        <div className="panel panel-default">

          <div className="panel-heading panel-heading-custom">
            {this.props.characterKey ? (
              <h1 className="panel-title"> Edit </h1>
              ) : (
              <h1 className="panel-title"> Create </h1>
              )
            }
          </div>

          <div className="panel-body">

            {this.createForm()}

            {this.props.characterKey ? (
              <button className="btn btn-primary"  
                onClick={this.handleEdit}>Edit</button>
              ) : (
              <button className="btn btn-primary"  
                onClick={this.handleCreation}>Create</button>
              )
            }

            <form>

              <div className="form-group">
                  <label htmlFor="newProperty">Property</label>
                  <input className="form-control" name="newProperty" type="text" 
                  onChange={this.handleInputChange}
                  value={this.state.newProperty}/>
              </div>

              <button className="btn btn-primary" type="submit"  
              onClick={this.addProperty}>Add Property</button>

            </form>

          </div>
        </div>
      </div>
    );
  }
}

export default CharacterForm;