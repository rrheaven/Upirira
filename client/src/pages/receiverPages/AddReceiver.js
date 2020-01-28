import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';
import { receiverStripeAuth } from '../../redux/actions/receiversAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AddReceiver = ({ receiverStripeAuth }) => {
	const handleClick = e => {
		receiverStripeAuth();
	};

	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				<Card.Body>
					{/* <Button onClick={handleClick}>Create Stipe Account</Button> */}
					<a href='https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth/test&client_id=ca_GczqET5WCUcwzeU5oBZPun5CWnm9uvvt&state=123'>
						<Button>Create Stipe Account</Button>
					</a>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

AddReceiver.propTypes = {
	receiverStripeAuth: PropTypes.func.isRequired
};

const mapActionsToProps = {
	receiverStripeAuth
};

export default connect(null, mapActionsToProps)(AddReceiver);
