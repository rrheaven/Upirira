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

const TransactionBar = ({ metrics: { metrics, loading }, setMetrics }) => {
	useEffect(() => {
		setMetrics();
	}, [setMetrics]);
	return (
		<Fragment>
			<Card>
				<Container>
					<Row>
						<Col>
							Today: $
							{metrics.oneDayTotal &&
								!loading &&
								metrics.oneDayTotal.toFixed(2)}
						</Col>
						<Col>
							This Week: $
							{metrics.oneWeekTotal &&
								!loading &&
								metrics.oneWeekTotal.toFixed(2)}
						</Col>
						<Col>
							This Month: $
							{metrics.oneMonthTotal &&
								!loading &&
								metrics.oneMonthTotal.toFixed(2)}
						</Col>
						<Col>
							This Year: $
							{metrics.oneYearTotal &&
								!loading &&
								metrics.oneYearTotal.toFixed(2)}
						</Col>
					</Row>
				</Container>
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
