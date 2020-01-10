import React, { Fragment } from 'react';
import { Doughnut } from 'react-chartjs-2';

// Bootstrap
import Card from 'react-bootstrap/Card';

const DonationPie = props => {
	const data = {
		labels: ['Red', 'Green', 'Yellow'],
		datasets: [
			{
				data: [300, 50, 100],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
			}
		]
	};

	return (
		<Fragment>
			<Card>
				<Card.Body>
					<Doughnut data={data} />
				</Card.Body>
			</Card>
		</Fragment>
	);
};

export default DonationPie;
