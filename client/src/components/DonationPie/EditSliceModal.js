import React, { useState } from 'react';

// Redux
import { connect } from 'react-redux';
import { updatePieSlice } from '../../redux/actions/profileAction';

// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Components
import Alerts from '../Alerts';

const EditSliceModal = props => {
	const [formData, setFormData] = useState({
		percentage: props.pie_amount
	});

	const { percentage } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		await props.updatePieSlice({
			percentage: percentage,
			receiverId: props.pie_id,
			receiverName: props.pie_name
		});

		if (props.alert !== null && props.alert.length !== 0) {
			console.log('onShow');
		} else {
			console.log('onHide');
			props.onHide();
		}
	};

	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>
					Edit Percentage
				</Modal.Title>
			</Modal.Header>
			<Form onSubmit={e => onSubmit(e)}>
				<Modal.Body>
					<Alerts />
					<Form.Group controlId='formGridAddress1'>
						<Form.Label>
							<h4>{props.pie_name}:</h4>
						</Form.Label>
						<Form.Control
							type='number'
							placeholder={'Enter percentage'}
							name='percentage'
							value={percentage}
							onChange={e => onChange(e)}
						/>
					</Form.Group>
					<Button type='submit'>Confirm</Button>
				</Modal.Body>
			</Form>
		</Modal>
	);
};

const mapStateToProps = state => ({
	alert: state.alert
});

const mapActionsToProps = {
	updatePieSlice
};

export default connect(mapStateToProps, mapActionsToProps)(EditSliceModal);
