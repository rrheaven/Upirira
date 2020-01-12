import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

// Redux
import { connect } from 'react-redux';
import { setGraph } from '../redux/actions/profileAction';

// Bootstrap
import Card from 'react-bootstrap/Card';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';

const TransactionGraph = ({ graph: { graphData }, setGraph }) => {
	useEffect(() => {
		setGraph();
	}, [setGraph]);

	const options = {
		legend: {
			display: false
		}
	};

	const data = {
		labels: graphData.graphDates,
		datasets: [
			{
				label: graphData.graphTitle,
				fill: false,
				lineTension: 0.1,
				backgroundColor: 'rgba(75,192,192,0.4)',
				borderColor: 'rgba(75,192,192,1)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgba(75,192,192,1)',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: graphData.graphAmounts
			}
		]
	};

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Card.Title>{graphData.graphTitle}</Card.Title>
					<Line data={data} options={options} />
					<ButtonToolbar>
						<Button variant='primary'>1 Week</Button>
						<Button variant='primary'>1 Month</Button>
						<Button variant='primary'>1 Year</Button>
					</ButtonToolbar>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

TransactionGraph.propTypes = {
	setGraph: PropTypes.func.isRequired,
	graph: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	graph: state.graph
});

const mapActionsToProps = {
	setGraph
};

export default connect(mapStateToProps, mapActionsToProps)(TransactionGraph);
