import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { setMetrics } from '../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const TransactionBar = ({ metrics: { metrics }, setMetrics }) => {
	useEffect(() => {
		setMetrics();
	}, [setMetrics]);
	return (
		<Fragment>
			<Card>
				<ListGroup horizontal>
					<ListGroup.Item>Today: {metrics.oneDayTotal}</ListGroup.Item>
					<ListGroup.Item>This Week: {metrics.oneWeekTotal}</ListGroup.Item>
					<ListGroup.Item>This Month: {metrics.oneMonthTotal}</ListGroup.Item>
					<ListGroup.Item>This Year: {metrics.oneYearTotal}</ListGroup.Item>
				</ListGroup>
			</Card>
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
