import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Bootstrap
import Card from 'react-bootstrap/Card';

// Components
import SliceItem from './SliceItem';

const DonationPieEditor = ({ pie: { pieData, loading } }) => {
	const PieSlices =
		loading && pieData == null
			? []
			: pieData.map(slice => (
					<Fragment key={slice.sliceId}>
						<SliceItem
							pieId={slice.sliceId}
							pieName={slice.sliceName}
							pieAmount={slice.slicePercentage}
							pieDB_ID={slice.sliceDB_ID}
						/>
					</Fragment>
			  ));

	// console.log(p);

	return (
		<Fragment>
			{loading && pieData == null ? <h1>Loading</h1> : <Card>{PieSlices}</Card>}
		</Fragment>
	);
};

DonationPieEditor.propTypes = {
	pie: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	pie: state.pie
});

export default connect(mapStateToProps)(DonationPieEditor);
