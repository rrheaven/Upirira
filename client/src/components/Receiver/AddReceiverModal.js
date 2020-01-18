import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { updatePieSlice } from '../../redux/actions/profileAction';

// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Components
import Alerts from '../Alerts';

const AddReceiverModal = props => {
	const [formData, setFormData] = useState({
		percentage: null
	});

	const { percentage } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();

		console.log({
			percentage: percentage,
			receiverId: props.id,
			receiverName: props.name
		});

		await props.updatePieSlice(
			{
				percentage: percentage,
				receiverId: props.id,
				receiverName: props.name
			},
			'add'
		);

		await props.alerts;

		if (props.alerts !== null && props.alerts.length > 0) {
			console.log('onShow');
			props.onShow();
		} else {
			console.log('onHide');
			props.onHide();
			return <Redirect to='/dash' />;
		}
	};

	let availablePercentage =
		!props.auth.loading &&
		props.auth.user &&
		props.auth.user.donationPie.availablePercentage;

	return (
		<Fragment>
			<Modal
				{...props}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id='contained-modal-title-vcenter'>
						{`Add: ${props.name}`}
					</Modal.Title>
				</Modal.Header>
				<Form onSubmit={e => onSubmit(e)}>
					<Modal.Body>
						<Alerts />
						<Form.Group controlId='formGridAddress1'>
							<Form.Label>
								{
									<h6>{`Available Percentage: ${availablePercentage.toFixed(
										2
									)}`}</h6>
								}
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
		</Fragment>
	);
};

const mapStateToProps = state => ({
	alerts: state.alert,
	auth: state.auth
});

const mapActionsToProps = { updatePieSlice };

export default connect(mapStateToProps, mapActionsToProps)(AddReceiverModal);
