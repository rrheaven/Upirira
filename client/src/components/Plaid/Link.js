import React, { Fragment } from 'react';
import PlaidLink from 'react-plaid-link';

// Redux
import { connect } from 'react-redux';
import { setPublicToken } from '../../redux/actions/plaidAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Link = ({ setPublicToken }) => {
	const handleOnSuccess = (public_token, metadata) => {
		// send token to client server
		setPublicToken(public_token);
	};

	const handleOnExit = () => {};

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<PlaidLink
						clientName='React Plaid Setup'
						env='sandbox'
						product={['auth', 'transactions']}
						publicKey='af1c94dd61a2b5afaad2a5023a24ae'
						webhook='https://webhook.site/d0d9f89c-9b6a-4c5e-9652-19521b4d8160'
						onExit={handleOnExit}
						onSuccess={handleOnSuccess}
						className='test'
					>
						Connect your bank
					</PlaidLink>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

const mapStateToProps = state => ({
	plaid: state.plaid
});

const mapActionsToProps = {
	setPublicToken
};

export default connect(mapStateToProps, mapActionsToProps)(Link);
