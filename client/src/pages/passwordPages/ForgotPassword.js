import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

//Redux
import { connect } from 'react-redux';
import { sendChangePasswordEmail } from '../../redux/actions/passwordAction';

const ForgotPassword = ({ sendChangePasswordEmail, loading }) => {
	const [formData, setFormData] = useState({
		email: ''
	});

	const { email } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		sendChangePasswordEmail({ email });
	};

	return (
		<Fragment>
			<Card className='my-5 p-2 shadow-sm'>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h3>Enter email to get link to change password:</h3>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={e => onSubmit(e)}>
						<Form.Group controlId='formBasicEmail'>
							<Form.Label>Email address:</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								name='email'
								value={email}
								onChange={e => onChange(e)}
								disabled={loading}
							/>
						</Form.Group>

						<Button variant='primary btn-block' type='submit' className='mt-4'>
							{loading ? <Spinner animation='border' /> : 'Submit'}
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

ForgotPassword.propTypes = {
	sendChangePasswordEmail: PropTypes.func.isRequired,
	loading: PropTypes.bool
};

const mapStateToProps = state => ({
	loading: state.password.loading
});

const mapActionsToProps = {
	sendChangePasswordEmail
};

export default connect(mapStateToProps, mapActionsToProps)(ForgotPassword);
