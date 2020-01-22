import React, { Fragment } from 'react';

// Components
import TransactionBar from '../components/TransactionBar';
import TransactionGraph from '../components/TransactionGraph';
import SelectedReceiver from '../components/Selected/SelectedReceiver';

const Dash = () => {
	return (
		<Fragment>
			<TransactionBar />
			<TransactionGraph />
			<SelectedReceiver />
		</Fragment>
	);
};

export default Dash;
