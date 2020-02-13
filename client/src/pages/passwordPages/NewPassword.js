import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

//Redux
import { connect } from 'react-redux';
import { setNewPassword } from '../../redux/actions/passwordAction';
import { setAlert } from '../../redux/actions/alertAction';

const NewPassword = ({
	match,
	loading,
	setNewPassword,
	isAuthenticated,
	setAlert
}) => {
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: ''
	});

	const [pageData, setPageData] = useState({
		setPassword: false
	});

	const { password, confirmPassword } = formData;
	const { setPassword } = pageData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setAlert('Passwords do not match', 'danger');
			console.log('Passwords do not match');
		} else {
			await setNewPassword({ password }, match.params.id);
			setPageData({ setPassword: true });
		}
	};

	if (setPassword) {
		if (isAuthenticated) {
			return <Redirect to='/settings' />;
		} else {
			return <Redirect to='/login' />;
		}
	}

	return (
		<Fragment>
			<Card className='my-5 p-2 shadow-sm'>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h3>Create new account password:</h3>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={e => onSubmit(e)}>
						<Form.Group controlId='formBasicPassword'>
							<Form.Label>Password:</Form.Label>
							<Form.Control
								type='password'
								placeholder='Password'
								name='password'
								value={password}
								onChange={e => onChange(e)}
								disabled={loading}
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

NewPassword.propTypes = {
	setNewPassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	loading: PropTypes.bool
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.password.loading
});

const mapActionsToProps = {
	setNewPassword,
	setAlert
};

export default connect(mapStateToProps, mapActionsToProps)(NewPassword);
