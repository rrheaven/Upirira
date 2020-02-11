import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { confirmAccount } from '../redux/actions/authAction';

const Confirm = ({ match, confirmAccount, isAuthenticated, loading }) => {
	const [confirm, setConfirm] = useState(null);

	useEffect(() => {
		async function handleConfirm() {
			await confirmAccount(match.params.id);

			if (isAuthenticated) {
				setConfirm(true);
			} else {
				setConfirm(false);
			}
		}
		handleConfirm();
	}, []);

	if (confirm === true) {
		return <Redirect to='/dash' />;
	} else if (confirm === false) {
		return <Redirect to='/login' />;
	}

	return <Fragment></Fragment>;
};

Confirm.propTypes = {
	isAuthenticated: PropTypes.bool,
	loading: PropTypes.bool,
	confirmAccount: PropTypes.func
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading
});

const mapActionsToProps = {
	confirmAccount
};

export default connect(mapStateToProps, mapActionsToProps)(Confirm);
