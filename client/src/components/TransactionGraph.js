import React, { Fragment, useEffect, useState } from 'react';
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
	const [weekLoading, setWeekLoading] = useState(true);
	const [monthLoading, setMonthLoading] = useState(false);
	const [yearLoading, setYearLoading] = useState(false);

	useEffect(() => {
		setGraph();
	}, [setGraph]);

	const handleWeeklyClick = e => {
		e.preventDefault();
		setGraph('week');
		setWeekLoading(true);
		setMonthLoading(false);
		setYearLoading(false);
	};
	const handleMonthlyClick = e => {
		e.preventDefault();
		setGraph('month');
		setWeekLoading(false);
		setMonthLoading(true);
		setYearLoading(false);
	};
	const handleYearlyClick = e => {
		e.preventDefault();
		setGraph('year');
		setWeekLoading(false);
		setMonthLoading(false);
		setYearLoading(true);
	};

	const options = {
		legend: {
			display: false
		},
		tooltips: {
			displayColors: false
		}
	};

	const data = {
		labels: graphData.graphDates,
		datasets: [
			{
				label: graphData.graphTitle,
				fill: false,
				lineTension: 0.1,
				backgroundColor: 'rgba(2,117,216,0.4)',
				borderColor: 'rgba(2,117,216,1)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgba(2,117,216,1)',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 3,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(2,117,216,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 5,
				pointHitRadius: 15,
				data: graphData.graphAmounts
			}
		]
	};

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Card.Title>{graphData.graphTitle}:</Card.Title>
					<Line data={data} options={options} />
					<ButtonToolbar>
						<Button
							variant='primary'
							onClick={handleWeeklyClick}
							disabled={weekLoading}
						>
							Weekly
						</Button>
						<Button
							variant='primary'
							onClick={handleMonthlyClick}
							disabled={monthLoading}
						>
							Monthly
						</Button>
						<Button
							variant='primary'
							onClick={handleYearlyClick}
							disabled={yearLoading}
						>
							Yearly
						</Button>
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
