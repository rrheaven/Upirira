import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { loadUser, editUser, logout } from '../../redux/actions/authAction';
import { setAlert } from '../../redux/actions/alertAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const ChangeName = ({ loading, user, loadUser, editUser, setAlert }) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: ''
	});

	const [editMode, setEditMode] = useState(false);

	const { firstName, lastName } = formData;

	useEffect(() => {
		if (!loading) {
			setFormData({
				...formData,
				firstName: user.firstName,
				lastName: user.lastName
			});
		}
	}, []);

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		if (editMode) {
			if (firstName === '' || lastName === '') {
				setAlert('Cannot leave name fields empty', 'danger');
			} else {
				const email = user.email;
				await editUser({ firstName, lastName, email });
				setEditMode(false);
			}
		} else {
			setEditMode(true);
		}
	};

	return (
		<Fragment>
			<Form onSubmit={e => onSubmit(e)}>
				<Form.Group controlId='formBasicFirstName'>
					<Form.Label>First Name:</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter First Name'
						name='firstName'
						value={firstName}
						onChange={e => onChange(e)}
						disabled={loading || !editMode}
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
						disabled={loading || !editMode}
					/>
				</Form.Group>
				<Button
					variant='primary btn-block'
					type='submit'
					className='mt-4'
					disabled={loading}
				>
					{editMode ? (
						loading ? (
							<Spinner animation='border' />
						) : (
							'Submit'
						)
					) : (
						'Edit'
					)}
				</Button>
			</Form>
		</Fragment>
	);
};

ChangeName.propTypes = {
	user: PropTypes.object,
	loading: PropTypes.bool,
	loadUser: PropTypes.func.isRequired,
	editUser: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	loading: state.auth.loading,
	user: state.auth.user
});

const mapActionsToProps = {
	loadUser,
	editUser,
	setAlert
};

export default connect(mapStateToProps, mapActionsToProps)(ChangeName);
