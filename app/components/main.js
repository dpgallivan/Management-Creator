import React, { Components } from 'react';
import ReactDOM from 'react-dom'
import routes from '../config/routes.js'

class Main extends React.Component {
	constructor(props){
		super(props);

		window.onload = () => {
			ReactDOM.render(<Routes />, 
			document.getElementById('Main'));
		}
	}

	render() {
		return(

		<div className = 'main-container'>

			<div className="pure-menu pure-menu-horizontal">
		    	<ul className="pure-menu-list">
			        <li class="pure-menu-item"><a href="#" class="pure-menu-link">Home</a></li>
	        		<li class="pure-menu-item"><a href="#" class="pure-menu-link">Log Out</a></li>
	        		<li class="pure-menu-item" id="title">Management creator</li>
	        	</ul>
			</div>

			<div className="pure-g">
				<div className="pure-u-3-5">
					<div className ="content-wrapper">
						<div className="content">
						 <h2 className="content-head is-center">
						 <b> Welcome back! </b></h2>
							<div className="buttons">
								<a className="button-error pure-button" href="app.js" action="/create" method="GET">Create character</a>
								<br></br>
								<br></br>
								<a className="button-error pure-button" href="forum.html" action="/forum" method="GET">View other users characters</a>
							</div>
						</div>
					</div>
				</div>
				<div className="pure-u-1-3">
					<div className="content-wrapper">
						<div className="content">
						 <h2>Creations</h2>
						</div>
					</div>
				</div>
			</div>

			<div className="footer">
				<footer>
					<p>Management Creator; ©Copyright Daniel G., Edric W., Eric C.</p>
				</footer>
			</div>

		</div>
		);
	}
}
export default Main;
	

