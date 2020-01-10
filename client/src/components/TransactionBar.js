import React, { Fragment } from 'react';

// Bootstrap
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const TransactionBar = props => {
	return (
		<Fragment>
			<Card>
				<ListGroup horizontal>
					<ListGroup.Item>Today: </ListGroup.Item>
					<ListGroup.Item>This Week: </ListGroup.Item>
					<ListGroup.Item>This Month: </ListGroup.Item>
					<ListGroup.Item>This Year: </ListGroup.Item>
				</ListGroup>
			</Card>
		</Fragment>
	);
};

export default TransactionBar;
