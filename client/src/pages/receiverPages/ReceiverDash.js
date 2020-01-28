import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const ReceiverDash = ({ dashLink }) => {
	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				<Card.Body>
					<a href={dashLink}>
						<Button>Go to Stripe Dash</Button>
					</a>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

ReceiverDash.propTypes = {
	dashLink: PropTypes.string.isRequired
};

export default ReceiverDash;
