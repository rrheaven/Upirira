import React, { Fragment } from 'react';
import PlaidLink from 'react-plaid-link';
import REST from '../../api/REST';

// Redux
import { connect } from 'react-redux';
import {
	setPublicToken,
	setPlaidTransactions
} from '../../redux/actions/plaidAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Link = ({
	plaid: { transactionsData },
	setPublicToken,
	setPlaidTransactions
}) => {
	const handleOnSuccess = (public_token, metadata) => {
		// send token to client server
		setPublicToken(public_token);
	};

	const handleOnExit = () => {};

	const handleClick = res => {
		setPlaidTransactions();
	};

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<PlaidLink
						clientName='React Plaid Setup'
						env='sandbox'
						product={['auth', 'transactions']}
						publicKey='af1c94dd61a2b5afaad2a5023a24ae'
						onExit={handleOnExit}
						onSuccess={handleOnSuccess}
						className='test'
					>
						Connect your bank
					</PlaidLink>
					<Button onClick={handleClick}>Get Transactions</Button>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

const mapStateToProps = state => ({
	plaid: state.plaid
});

const mapActionsToProps = {
	setPublicToken,
	setPlaidTransactions
};

export default connect(mapStateToProps, mapActionsToProps)(Link);
