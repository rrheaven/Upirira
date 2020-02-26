import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const RegisterAccount = props => {
	return (
		<Fragment>
			<h6>Register Checking Account:</h6>
			<Card className='shadow-sm'>
				<Card.Body>
					<Container className={'container h-100'}></Container>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

RegisterAccount.propTypes = {};

export default RegisterAccount;
