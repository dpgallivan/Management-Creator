import React, { Components } from 'react';
import ReactDOM from 'react-dom';
// import Welcome from "./components/Welcome";
// import Main from "./components/Main";
// import Forum from "./components/Forum"

const routes = require('./config/routes');

ReactDOM.render(
	routes, 
	document.getElemenetById("app"));