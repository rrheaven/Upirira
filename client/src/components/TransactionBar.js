import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { setMetrics } from '../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Components
import LoadingCard from './LoadingCard';

const TransactionBar = ({ metrics: { metrics, loading }, setMetrics }) => {
	useEffect(() => {
		setMetrics();
	}, [setMetrics]);
	return (
		<Fragment>
			{loading ? (
				<LoadingCard />
			) : (
				<Card className='shadow-sm my-3'>
					<Container className='my-3'>
						<Row>
							<Col>
								Today: $
								{metrics.oneDayTotal && !loading ? (
									<b>{metrics.oneDayTotal.toFixed(2)}</b>
								) : (
									0
								)}
							</Col>
							<Col>
								This Week: $
								{metrics.oneWeekTotal && !loading ? (
									<b>{metrics.oneWeekTotal.toFixed(2)}</b>
								) : (
									0
								)}
							</Col>
							<Col>
								This Month: $
								{metrics.oneMonthTotal && !loading ? (
									<b>{metrics.oneMonthTotal.toFixed(2)}</b>
								) : (
									0
								)}
							</Col>
							<Col>
								This Year: $
								{metrics.oneYearTotal && !loading ? (
									<b>{metrics.oneYearTotal.toFixed(2)}</b>
								) : (
									0
								)}
							</Col>
						</Row>
					</Container>
				</Card>
			)}
		</Fragment>
	);
};

TransactionBar.propTypes = {
	setMetrics: PropTypes.func.isRequired,
	metrics: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	metrics: state.metrics
});

const mapActionsToProps = {
	setMetrics
};

export default connect(mapStateToProps, mapActionsToProps)(TransactionBar);
