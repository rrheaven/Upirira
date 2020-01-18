import React, { Fragment } from 'react';

// Bootstrap
import Card from 'react-bootstrap/Card';

// Components
import Link from '../components/Plaid/Link';

const Settings = () => {
	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Card.Title>Settings</Card.Title>
					<Link />
				</Card.Body>
			</Card>
		</Fragment>
	);
};

export default Settings;
