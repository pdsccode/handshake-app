import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/table';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';
import moment from 'moment';
import { loadWithdrawList } from '@/reducers/withdraw/action';
import StatusButton from './components/StatusButton';

class Withdraw extends Component {
  componentDidMount() {
    // redirect to home page if wrong key
    if (!this.checkAuth()) {
      window.location.pathname = '/';
      return null;
    }

    // load withdraw list
    this.props.loadWithdrawList({
      PATH_URL: API_URL.INTERNAL.GET_WITHDRAW_LIST,
      qs: { status: 'processing' },
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
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Amount</th>
            <th>Create at</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {withdraws.length === 0 && (
            <tr>
              <td colSpan="4"><p>No record</p></td>
            </tr>
          )}
          {
            withdraws.map(withdraw => (
              <tr key={withdraw.id}>
                <td>{withdraw?.information?.username || '---'}</td>
                <td>{withdraw?.amount || 0}</td>
                <td>{this.parseHumanTime(withdraw?.created_at)}</td>
                <td><StatusButton withdrawId={withdraw?.id} status={withdraw?.status} /></td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    );
  }
}

Withdraw.propTypes = {
  withdraws: PropTypes.array,
  match: PropTypes.object.isRequired,
  loadWithdrawList: PropTypes.func.isRequired,
};

Withdraw.defaultProps = {
  withdraws: [],
};

const mapState = (state) => {
  return {
    withdraws: state.withdraw.list,
  };
};

export default connect(mapState, ({ loadWithdrawList }))(Withdraw);
