import React, { Fragment, useState } from 'react';

// Redux
import { connect } from 'react-redux';
import { setSpendingLimit } from '../../redux/actions/spendingLimitAction';

// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const SetSpendLimitModal = props => {
	const [formData, setFormData] = useState({
		amountLimit: '$5',
		timePeriodLimit: 'Per Week'
	});

	const { amountLimit, timePeriodLimit } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async e => {
		e.preventDefault();
		await props.setSpendingLimit({ amountLimit, timePeriodLimit });
		props.onHide();
	};

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
						Set Spending Limit:
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={e => onSubmit(e)}>
						<Form.Row>
							<Form.Group as={Col} controlId='formAmount'>
								<Form.Label>Amount Limit:</Form.Label>
								<Form.Control
									as='select'
									value={amountLimit}
									name='amountLimit'
									onChange={e => onChange(e)}
								>
									<option>$5</option>
									<option>$10</option>
									<option>$15</option>
									<option>$20</option>
									<option>$25</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} controlId='formTimePeriod'>
								<Form.Label>Time Period Limit:</Form.Label>
								<Form.Control
									as='select'
									value={timePeriodLimit}
									name='timePeriodLimit'
									onChange={e => onChange(e)}
								>
									<option>Per Week</option>
									<option>Per Month</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<div className={'text-right'}>
							<Button variant='primary' type='submit'>
								Set
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Fragment>
	);
};

const mapActionsToProps = {
	setSpendingLimit
};

export default connect(null, mapActionsToProps)(SetSpendLimitModal);
