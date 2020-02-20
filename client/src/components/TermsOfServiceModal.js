import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const TermsOfServiceModal = props => {
	return (
		<Fragment>
			<Modal
				{...props}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id='contained-modal-title-vcenter'>
						Terms of Service:
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
						dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
						ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus
						sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
						egestas eget quam. Morbi leo risus, porta ac consectetur ac,
						vestibulum at eros. Cras mattis consectetur purus sit amet
						fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
						quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
						Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
						dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
						ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus
						sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
						egestas eget quam. Morbi leo risus, porta ac consectetur ac,
						vestibulum at eros. Cras mattis consectetur purus sit amet
						fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
						quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
						Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
						dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
						ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus
						sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
						egestas eget quam. Morbi leo risus, porta ac consectetur ac,
						vestibulum at eros. Cras mattis consectetur purus sit amet
						fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
						quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
						Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
						dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
						ac consectetur ac, vestibulum at eros.
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.onHide}>Close</Button>
				</Modal.Footer>
			</Modal>
		</Fragment>
	);
};

TermsOfServiceModal.propTypes = {};

export default TermsOfServiceModal;
