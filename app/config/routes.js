const React = require('react');
const router = require('react-router');
const Route = router.Route;
const Router = router.Router;
const hashHistory = router.hashHistory;
const IndexRoute = route.IndexRoute;

const Welcome = require('../components/Welcome');
const Main = require('../components/Main');
const Forum = require('../components/Forum');

const routes = (

	<Router history={hashHistory}>
		<Route path="/" component={Main}>
		
		<Route path="/Welcome" component={Welcome} />

		<Route path="/Forum" component={Forum} />

		</Route>
	</Router>
);

export default routes;