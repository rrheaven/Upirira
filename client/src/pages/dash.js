import React, { Fragment } from 'react';

// Components
import TransactionBar from '../components/TransactionBar';
import TransactionGraph from '../components/TransactionGraph';
import DonationPie from '../components/DonationPie';

const Dash = () => {
	return (
		<Fragment>
			<TransactionBar />
			<TransactionGraph />
			<DonationPie />
		</Fragment>
	);
};

export default Dash;
