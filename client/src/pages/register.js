import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//Redux
import { connect } from 'react-redux';
import { setAlert } from '../redux/actions/alertAction';
import { register } from '../redux/actions/authAction';

const Register = ({ setAlert, register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const { firstName, lastName, email, password, confirmPassword } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setAlert('Passwords do not match', 'danger');
			console.log('Passwords do not match');
		} else {
			register({ firstName, lastName, email, password });
		}
	};

	if (isAuthenticated) {
		return <Redirect to='/dash' />;
	}

	return (
		<Fragment>
			<Card className='my-5 p-2 shadow-sm'>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h3>Register</h3>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={e => onSubmit(e)}>
						<Form.Group controlId='formBasicFirstName'>
							<Form.Label>First Name:</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter First Name'
								name='firstName'
								value={firstName}
								onChange={e => onChange(e)}
							/>
						</Form.Group>
						<Form.Group controlId='formBasicLastName'>
							<Form.Label>Last Name:</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter Last Name'
								name='lastName'
								value={lastName}
								onChange={e => onChange(e)}
							/>
						</Form.Group>
						<Form.Group controlId='formBasicEmail'>
							<Form.Label>Email address:</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								name='email'
								value={email}
								onChange={e => onChange(e)}
							/>
						</Form.Group>
						<Form.Group controlId='formBasicPassword'>
							<Form.Label>Password:</Form.Label>
							<Form.Control
								type='password'
								placeholder='Password'
								name='password'
								value={password}
								onChange={e => onChange(e)}
							/>
						</Form.Group>
						<Form.Group controlId='formBasicConfirmPassword'>
							<Form.Label>Confirm Password:</Form.Label>
							<Form.Control
								type='password'
								placeholder='Confirm Password'
								name='confirmPassword'
								value={confirmPassword}
								onChange={e => onChange(e)}
							/>
						</Form.Group>
						<Button variant='primary btn-block' type='submit' className='mt-4'>
							Submit
						</Button>
					</Form>
					<div className='mt-3'>
						<Link to='/login'>Already have an account? Login instead</Link>
					</div>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

const mapActionsToProps = {
	setAlert,
	register
};

export default connect(mapStateToProps, mapActionsToProps)(Register);
