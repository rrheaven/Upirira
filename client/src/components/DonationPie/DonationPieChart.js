import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

// Redux
import { connect } from 'react-redux';

const DonationPieChart = ({ pie: { pieData, loading } }) => {
	const data = {
		labels: loading ? [] : pieData.map(slice => slice.sliceName),
		datasets: [
			{
				data: loading ? [] : pieData.map(slice => slice.slicePercentage),
				backgroundColor: [
					'#0074D9',
					'#FF4136',
					'#2ECC40',
					'#FF851B',
					'#7FDBFF',
					'#B10DC9',
					'#FFDC00',
					'#001f3f',
					'#39CCCC',
					'#01FF70',
					'#85144b',
					'#F012BE',
					'#3D9970',
					'#111111',
					'#AAAAAA'
				],
				hoverBackgroundColor: [
					'#0074D9',
					'#FF4136',
					'#2ECC40',
					'#FF851B',
					'#7FDBFF',
					'#B10DC9',
					'#FFDC00',
					'#001f3f',
					'#39CCCC',
					'#01FF70',
					'#85144b',
					'#F012BE',
					'#3D9970',
					'#111111',
					'#AAAAAA'
				]
			}
		]
	};

	return (
		<Fragment>
			{loading && pieData == null ? <h1>Loading</h1> : <Doughnut data={data} />}
		</Fragment>
	);
};

const mapStateToProps = state => ({
	pie: state.pie
});

DonationPieChart.propTypes = {
	pie: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(DonationPieChart);
