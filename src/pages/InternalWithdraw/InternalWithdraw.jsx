import React, { Component } from 'react';
// import Table from 'react-bootstrap/lib/table';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';
import moment from 'moment';
import { loadWithdrawList } from '@/reducers/internalWithdraw/action';
import StatusButton from './components/StatusButton';

class InternalWithdraw extends Component {
  componentDidMount() {
    // redirect to home page if wrong key
    if (!this.checkAuth()) {
      window.location.pathname = '/';
      return null;
    }

    // load processing withdraw list
    this.props.loadWithdrawList({
      PATH_URL: API_URL.INTERNAL.GET_WITHDRAW_LIST,
      qs: { status: 'processing' },
    });

    // load processed withdraw list
    this.props.loadWithdrawList({
      PATH_URL: API_URL.INTERNAL.GET_WITHDRAW_LIST,
      qs: { status: 'processed' },
    });
    return null;
  }

  checkAuth() {
    const superKey = process.env.withdrawSuperKey;
    const userKey = this.props?.match?.params?.superKey;
    return superKey === userKey;
  }

  parseHumanTime(timeStr) {
    return moment(timeStr).format('DD/MM/YYYY HH:mm');
  }

  render() {
    const { withdraws } = this.props;
    return (
      <div/>
    );
  }
}

InternalWithdraw.propTypes = {
  withdraws: PropTypes.array,
  match: PropTypes.object.isRequired,
  loadWithdrawList: PropTypes.func.isRequired,
};

InternalWithdraw.defaultProps = {
  withdraws: [],
};

const mapState = (state) => {
  return {
    withdraws: state.internalWithdraw.list,
  };
};

export default connect(mapState, ({ loadWithdrawList }))(InternalWithdraw);
