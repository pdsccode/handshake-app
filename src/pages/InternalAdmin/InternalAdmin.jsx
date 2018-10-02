import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';
// import moment from 'moment';
// import { loadWithdrawList } from '@/reducers/internalWithdraw/action';
// import StatusButton from './components/StatusButton';
import './InternalAdmin.scss';

class InternalAdmin extends Component {
  componentDidMount() {
    // redirect to home page if wrong key
    if (!this.checkAuth()) {
      window.location.pathname = '/';
      return null;
    }
    return null;
  }

  checkAuth() {
    const superKey = process.env.withdrawSuperKey;
    const userKey = this.props?.match?.params?.superKey;
    return superKey === userKey;
  }

  // parseHumanTime(timeStr) {
  //   return moment(timeStr).format('DD/MM/YYYY HH:mm');
  // }

  render() {
    // const { withdraws } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Create at</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5"><p>No record</p></td>
            </tr>
          </tbody>
          {/* <tbody>
            {withdraws.length === 0 && (
              <tr>
                <td colSpan="5"><p>No record</p></td>
              </tr>
            )}
            {
              withdraws.map(withdraw => (
                <tr key={withdraw.id}>
                  <td>{withdraw?.information?.username || '---'}</td>
                  <td>{withdraw?.amount || 0}</td>
                  <td>{withdraw.processed_id || '---'}</td>
                  <td>{this.parseHumanTime(withdraw?.created_at)}</td>
                  <td><StatusButton withdrawId={withdraw?.id} status={withdraw?.status} /></td>
                </tr>
              ))
            }
          </tbody> */}
        </table>
      </div>
    );
  }
}

InternalAdmin.propTypes = {
  // withdraws: PropTypes.array,
  match: PropTypes.object.isRequired,
};

InternalAdmin.defaultProps = {
  // withdraws: [],
};

const mapState = (state) => {
  return {
    withdraws: state.internalWithdraw.list,
  };
};

export default connect(mapState, null)(InternalAdmin);
