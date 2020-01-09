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
import { login } from '../redux/actions/authAction';

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const { email, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		login(email, password);
	};

	if (isAuthenticated) {
		return <Redirect to='/dash' />;
	}

	return (
		<Fragment>
			<Card>
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

						<Button variant='primary' type='submit'>
							Submit
						</Button>
					</Form>
					<Link to='/register'>Don't have an account? Register instead</Link>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

Login.propTypes = {
	setAlert: PropTypes.func.isRequired,
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

const mapActionsToProps = {
	setAlert,
	login
};

export default connect(mapStateToProps, mapActionsToProps)(Login);
