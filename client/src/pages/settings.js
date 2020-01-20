import React, { Fragment, useEffect } from 'react';

// Redux
import { connect } from 'react-redux';
import { setPlaidItems } from '../redux/actions/plaidAction';

// Bootstrap
import Card from 'react-bootstrap/Card';

// Components
import Link from '../components/Plaid/Link';
import Item from '../components/Plaid/Item';

const Settings = ({ plaid: { plaidItems, loading }, setPlaidItems }) => {
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
			<Card>
				<Card.Body>
					<Card.Title>Settings</Card.Title>
					{!loading && (
						<Fragment>
							{plaidItems === null ? registerAccount : registeredAccount}
						</Fragment>
					)}
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
