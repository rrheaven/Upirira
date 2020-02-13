import React, { Fragment, useEffect } from 'react';

// Redux
import { connect } from 'react-redux';
import { setPlaidItems } from '../redux/actions/plaidAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Components
import Link from '../components/Plaid/Link';
import Item from '../components/Plaid/Item';
import UserSettings from '../components/UserSettings/UserSettings';

const Settings = ({ plaid: { plaidItems, plaidLoading }, setPlaidItems }) => {
	useEffect(() => {
		setPlaidItems();
	}, [setPlaidItems]);

	const registerAccount = (
		<Fragment>
			<h6>Register Bank Account:</h6>
			<Link />
		</Fragment>
	);

	const registeredAccount = (
		<Fragment>
			<h6>Registered Bank Account:</h6>
			<Item />
		</Fragment>
	);

	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h3>Settings</h3>
				</Card.Header>
				<Card.Body>
					{!plaidLoading && (
						<Fragment>
							{plaidItems === null ? registerAccount : registeredAccount}
						</Fragment>
					)}
					<br />
					<UserSettings />
				</Card.Body>
			</Card>
		</Fragment>
	);
};

const mapStateToProps = state => ({
	plaid: state.plaid
});

const mapActionsToProps = {
	setPlaidItems
};

export default connect(mapStateToProps, mapActionsToProps)(Settings);
