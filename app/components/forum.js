import React, { Components } from 'react';

class Forum extends React.Component {
	render() {
		return(

		<div className = 'main-container'>

			<div className="pure-menu pure-menu-horizontal">
		    	<ul className="pure-menu-list">
			        <li className="pure-menu-item"><a href="index.html" className="pure-menu-link">Home</a></li>
	        		<li className="pure-menu-item"><a href="welcome.js" className="pure-menu-link">Log Out</a></li>
	        		<li className="pure-menu-item" id="title">Management creator</li>
	        	</ul>
			</div>

			<div className="panel panel-default">
				<div className="panel-heading">
				  <h3>Threads in this forum</h3>
					<div className="panel-title">Content goes here</div>
				  		<div className="panel-body">
				  		Panel Content
				  	</div>
				</div>
			</div>
		</div>
		);
	}
}
export default Forum;