import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { clearSpendingLimit } from '../../redux/actions/spendingLimitAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component
import SetSpendLimitModal from './SetSpendLimitModal';
import LoadingCard from '../LoadingCard';

const SpendLimit = ({ auth: { loading, user }, clearSpendingLimit }) => {
	const [modalShow, setModalShow] = useState(false);

	const handleDelete = async () => {
		await clearSpendingLimit();
	};

	const hasLimit = (
		<Fragment>
			<Container>
				<Row>
					<Col>
						<div className={'text-left'}>
							{!loading &&
								user.spendingLimit.currentLimit.currentAmountLimit !== null && (
									<h5>
										Amount Limit:{' '}
										<b>{user.spendingLimit.currentLimit.currentAmountLimit}</b>
									</h5>
								)}
						</div>
					</Col>

					<Col>
						<div className={'text-left'}>
							{!loading &&
								user.spendingLimit.currentLimit.currentTimePeriodLimit !==
									null && (
									<h5>
										Time Period Limit:{' '}
										<b>
											{user.spendingLimit.currentLimit.currentTimePeriodLimit}
										</b>
									</h5>
								)}
						</div>
					</Col>

					<Col>
						<div className={'text-right'}>
							<Button variant='danger' onClick={() => handleDelete()}>
								Delete
							</Button>
						</div>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);

	const noLimit = (
		<Fragment>
			<Button onClick={() => setModalShow(true)}>Set up Spending Limit</Button>
		</Fragment>
	);

	return (
		<Fragment>
			<h6>Spend Limit:</h6>
			{!loading ? (
				<Card className='shadow-sm'>
					<Card.Body>
						{!user.spendingLimit.currentLimit.currentAmountLimit &&
						!user.spendingLimit.currentLimit.currentTimePeriodLimit
							? noLimit
							: hasLimit}
					</Card.Body>
				</Card>
			) : (
				<LoadingCard />
			)}
			<SetSpendLimitModal show={modalShow} onHide={() => setModalShow(false)} />
		</Fragment>
	);
};

SpendLimit.propTypes = {
	auth: PropTypes.object,
	clearSpendingLimit: PropTypes.func
};

const mapStateToProps = state => ({
	auth: state.auth
});

const mapActionsToProps = {
	clearSpendingLimit
};

export default connect(mapStateToProps, mapActionsToProps)(SpendLimit);
