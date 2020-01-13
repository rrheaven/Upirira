import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { setMetrics } from '../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const TransactionBar = ({ metrics: { metrics, loading }, setMetrics }) => {
	useEffect(() => {
		setMetrics();
	}, [setMetrics]);
	return (
		<Fragment>
			<Card>
				<ListGroup horizontal>
					<ListGroup.Item>
						Today: $
						{metrics.oneDayTotal && !loading && metrics.oneDayTotal.toFixed(2)}
					</ListGroup.Item>
					<ListGroup.Item>
						This Week: $
						{metrics.oneWeekTotal &&
							!loading &&
							metrics.oneWeekTotal.toFixed(2)}
					</ListGroup.Item>
					<ListGroup.Item>
						This Month: $
						{metrics.oneMonthTotal &&
							!loading &&
							metrics.oneMonthTotal.toFixed(2)}
					</ListGroup.Item>
					<ListGroup.Item>
						This Year: $
						{metrics.oneYearTotal &&
							!loading &&
							metrics.oneYearTotal.toFixed(2)}
					</ListGroup.Item>
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
