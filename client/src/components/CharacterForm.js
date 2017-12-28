// Dependencies
import React, { Component } from "react";
import ShowComments from "./ShowComments.js";
const database = require("./firebase.js");

// Constants
const DefaultCharacteristics = ["name","age","gender"]; // Every Creation has at least these properties
const ReservedProperties = ["comments","privacy", "newProperty", "updatedAt","createdAt","userKey","key","userName","relationships","newRelation","userCharacters","relationshipType", "relationTo"];
const ReservedKeys = ["newProperty","newRelation","userCharacters","relationshipType","relationTo"];

// Form users use to create/edit to character and stores info to the database
class CharacterForm extends Component {
  state = {
    name:"",
    gender:"",
    age:"",
    privacy:"private",
    userCharacters:[],
    relationships:[],

    newProperty:"",
    newRelation:"",
    relationshipType:"",
    relationTo:""
  };

  // If component mounts and there was a characterKey passed, fills the form for edit mode
  componentDidMount() {

    this.loadCharacterList();

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
        && stateObj[key] !== undefined
      ) {
        characteristics.push(key);
      }
    }

    // Displays all characteristics to the page and gives non-default characteristics a delete button
    return (
      characteristics.map(characteristic => (
      <div key={characteristic} className="form-group">
          <label htmlFor={characteristic}>{characteristic}</label>
          <input className="form-control" name={characteristic} type="text" 
            onChange={this.handleInputChange}
            value={this.state[characteristic]}/>

          {!DefaultCharacteristics.includes(characteristic) ? (
              <button className="btn btn-danger"
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
        && !ReservedKeys.includes(key)
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
    output.privacy = this.state.privacy;
    output.userKey = this.props.userKey;

    database.ref(`users/${this.props.userKey}`).once('value').then(user => {
      if(!user.val()) {
        console.log("Error");
      }

      output.userName = user.val().name;

      // Pushes character to the database
      database.ref(`characters/${user.val().key}`).push(output).then(function(data) {
        database.ref(`characters/${user.val().key}/${data.key}`).update({key:data.key});
      });

    });

    // Sets each property in the state to empty string
    let empty = {};

    for (let key in stateObj) {
      if(stateObj[key] !== undefined && key !== "privacy") {
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
        && !ReservedKeys.includes(key)
        && stateObj[key] !== undefined
      ){
        if((stateObj[key] + "").trim() !== "") {
          isEmpty = false;
        }

        output[key] = (stateObj[key] + "").trim();
      }

      else if (key === "privacy") {
        output[key] = stateObj[key];
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

    // Updates character in the database
    database.ref(`characters/${this.props.userKey}/${this.props.characterKey}`).update(output).then(() => {
      database.ref(`allCharacters/${this.props.characterKey}`).update(output).then(() => {
        this.props.finishEdit();
      });
    });
  };

  addRelation = () => {
    this.setState({newRelation:true});
  };

  loadCharacterList = () => {

    let characters = [];

    // Gets characters from database
    database.ref(`characters/${this.props.userKey}`)
      .orderByChild('updatedAt')
      .once('value')
      .then(function(snapshots) {
      
      // Adds each character to array
      snapshots.forEach(function(char) {
        if(!this.props.characterKey || this.props.characterKey !== char.val().key ) {
          characters.push({
            name:char.val().name,
            key:char.val().key
          });
        }
      }.bind(this));

      console.log(characters);
      this.setState({userCharacters:characters});

    }.bind(this));

  };

  characterList = () => {

    let chars = this.state.userCharacters;

    return (
      chars.map(char => (
        <option key={char.key} value={char.key}>{char.name} ({char.key})</option>
      ))
    );

  };

  addRelationship = () => {
    let rels = this.state.relationships;

    rels.push({
      type:this.state.relationshipType,
      charKey:this.state.relationTo
    });

    console.log(rels);

    this.setState({
      relationships:rels,
      newRelation:false,
      relationshipType:"",
      relationTo:""
    });
  };

  exitRelationshipEdit = () => {
    this.setState({
      newRelation:false,
      relationshipType:"",
      relationTo:""
    });
  };

  // Renders the form to the page using the state
  render() {
    return (
      <div className="characterForm">
        <div className="container text-center">
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

              <form id="radios">
                <label className="checkbox-inline">
                  <input type="radio" name="privacy" value="private" onChange={this.handleInputChange} checked={this.state.privacy === "private"} /> private 
                </label>
                <label className="checkbox-inline">
                  <input type="radio" name="privacy" value="public" onChange={this.handleInputChange} checked={this.state.privacy === "public"}/> public
                </label>
              </form>

              {this.props.characterKey ? (
                <div>
                  <button className="btn btn-sucess"  
                    onClick={this.handleEdit}>Edit</button>

                  <ShowComments userKey={this.props.userKey} characterKey={this.props.characterKey} purpose="editing"/>
                </div>
                ) : (
                <button className="btn btn-sucess"  
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

              {this.state.newRelation ? (
                <div>
                  <select id="relationshipType" name="relationshipType" value={this.state.relationshipType} onChange={this.handleInputChange}>
                    <option value=""></option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Family">Family</option>
                    <option value="Ally">Ally</option>
                    <option value="Rival">Rival</option>
                    <option value="Enemy">Enemy</option>
                  </select>

                  <select id="relationTo" name="relationTo" value={this.state.relationTo} onChange={this.handleInputChange}>
                    <option value=""></option>
                    {this.characterList()}
                  </select>

                  <button className="btn btn-sucess" type="submit"
                  disabled = {this.state.relationTo === "" || this.state.relationshipType === ""}  
                  onClick={this.addRelationship}>Add Relationship</button>

                  <button className="btn btn-danger" type="submit"  
                  onClick={this.exitRelationshipEdit}>Exit</button>
                </div>
                ) : (
                  <button className="btn btn-primary" onClick={this.addRelation} disabled = {this.state.userCharacters.length === 0}>New Relationship</button>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterForm;