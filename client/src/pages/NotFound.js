import React, { Fragment } from 'react';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
	return (
		<Fragment>
			<Container>
				<Row className='p-5 justify-content-center'>
					<FontAwesomeIcon
						icon={faExclamationCircle}
						size='4x'
						color='red'
						className='p-2'
					/>
					<h1 className='p-2'>Sorry, Page Not Found</h1>
				</Row>
			</Container>
		</Fragment>
	);
};

export default NotFound;
