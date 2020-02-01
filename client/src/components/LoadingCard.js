import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

const LoadingCard = ({ title }) => {
	return (
		<Fragment>
			<Card className='shadow-sm my-3'>
				<Card.Body>
					{title && <Card.Title>{title}</Card.Title>}
					<div className='text-center'>
						<Spinner animation='border' variant='primary' className='p-3' />
					</div>
				</Card.Body>
			</Card>
		</Fragment>
	);
};

LoadingCard.propTypes = {
	title: PropTypes.string
};

export default LoadingCard;
