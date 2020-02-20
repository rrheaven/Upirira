import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Component
import SetSpendLimitModal from './SetSpendLimitModal';

const SpendLimit = props => {
	const [modalShow, setModalShow] = useState(false);

	return (
		<Fragment>
			<h6>Spend Limit:</h6>
			<Card className='shadow-sm'>
				<Card.Body>
					<Button onClick={() => setModalShow(true)}>
						Set up Spending Limit
					</Button>
				</Card.Body>
			</Card>
			<SetSpendLimitModal show={modalShow} onHide={() => setModalShow(false)} />
		</Fragment>
	);
};

SpendLimit.propTypes = {};

export default SpendLimit;
