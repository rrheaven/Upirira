import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

// Components
import Alerts from '../components/Alerts';

// Pages
import Register from '../pages/Register';
import Login from '../pages/Login';
import Dash from '../pages/Dash';
import Search from '../pages/Search';
import Settings from '../pages/Settings';
import Receiver from '../pages/receiverPages/Receiver';
import NotFound from '../pages/NotFound';

// Bootstrap
import Container from 'react-bootstrap/Container';

// Utils
import PrivateRoute from './PrivateRoute';

const Routes = () => {
	return (
		<Fragment>
			<Container>
				<Alerts />
				<Switch>
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
					<PrivateRoute exact path='/dash' component={Dash} />
					<PrivateRoute exact path='/search' component={Search} />
					<PrivateRoute exact path='/receiver' component={Receiver} />
					<PrivateRoute exact path='/settings' component={Settings} />
					<Route component={NotFound} />
				</Switch>
			</Container>
		</Fragment>
	);
};

export default Routes;
