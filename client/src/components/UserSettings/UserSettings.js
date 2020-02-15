import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/Card';

//Components
import ChangePassword from './ChangePassword';
import ChangeName from './ChangeName';

const UserSettings = () => {
	return (
		<Fragment>
			<h6>User Settings:</h6>
			<Card className='shadow-sm'>
				<ListGroup className='list-group-flush'>
					<ListGroupItem>
						<Card.Body>
							<Card.Title>Change your account settings:</Card.Title>
							<ChangeName />
						</Card.Body>
					</ListGroupItem>
					<ListGroupItem>
						<Card.Body>
							<Card.Title>Change your password:</Card.Title>
							<ChangePassword />
						</Card.Body>
					</ListGroupItem>
				</ListGroup>
			</Card>
		</Fragment>
	);
};

UserSettings.propTypes = {};

export default UserSettings;
