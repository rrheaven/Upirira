import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

//Redux
import { connect } from 'react-redux';
import { updateReceiver } from '../../redux/actions/receiversAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const UpdateReceiver = ({ auth: { user, loading }, updateReceiver }) => {
	const [formData, setFormData] = useState({
		description: '',
		image: ''
	});

	const { description, image } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		console.log({
			firstName: user.firstName,
			lastName: user.lastName,
			description: description,
			image: image
		});

		await updateReceiver(user.firstName, user.lastName, description, image);
	};

	return (
		<Fragment>
			<Card>
				<Card.Header style={{ 'background-color': 'white' }}>
					<h5>Add/Update Receiver</h5>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={e => onSubmit(e)}>
						<Form.Group controlId='formDescription'>
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter description'
								name='description'
								value={description}
								onChange={e => onChange(e)}
							/>
						</Form.Group>

						<Form.Group controlId='formImage'>
							<Form.Label>Image URL:</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter image url'
								name='image'
								value={image}
								onChange={e => onChange(e)}
							/>
						</Form.Group>

						<Button variant='primary btn-block' type='submit' className='mt-4'>
							Submit
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

UpdateReceiver.propTypes = {
	updateReceiver: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

const mapActionsToProps = {
	updateReceiver
};

export default connect(mapStateToProps, mapActionsToProps)(UpdateReceiver);
