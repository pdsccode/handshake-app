/* eslint react/sort-comp:0 */
/* eslint camelcase:0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';
import debounce from '@/utils/debounce';
import { loadCashOrderList, sendCashOrder } from '@/reducers/internalAdmin/action';
import './InternalAdmin.scss';

const STATUS = {
  pending: {
    id: 'pending',
    name: 'Created',
  },
  processing: {
    id: 'processing',
    name: 'Processing',
  },
  fiat_transferring: {
    id: 'fiat_transferring',
    name: 'Fiat transferring',
  },
  transferring: {
    id: 'transferring',
    name: 'Sending',
  },
  success: {
    id: 'success',
    name: 'Sent',
  },
  cancelled: {
    id: 'cancelled',
    name: 'Canceled',
  },
  transfer_failed: {
    id: 'transfer_failed',
    name: 'Failed',
  },
  expired: {
    id: 'expired',
    name: 'Expired',
  },
};

const backupScroll = window.onscroll;
const DEFAULT_TYPE = Object.values(STATUS)[0].id;

class InternalAdmin extends Component {
  constructor() {
    super();
    this.state = {
      type: DEFAULT_TYPE,
      isFinished: false,
      page: null,
    };

    this.send = :: this.send;
    this.loadOrderList = :: this.loadOrderList;
    this.setupInitifyLoad = :: this.setupInitifyLoad;
    this.onSuccess = :: this.onSuccess;
    this.autoLoadMore = debounce(:: this.autoLoadMore, 1000);
  }

  componentDidMount() {
    // redirect to home page if wrong key
    // if (!this.checkAuth()) {
    //   window.location.pathname = '/';
    //   return null;
    // }
    this.loadOrderList();
    this.setupInitifyLoad();
    return null;
  }

  componentWillUnmount() {
    window.onscroll = backupScroll;
  }

  autoLoadMore() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      this.loadOrderList();
    }
  }

  setupInitifyLoad() {
    window.onscroll = this.autoLoadMore;
  }

  getAmount(order = {}) {
    const amount = Number.parseFloat(order.fiat_amount) - Number.parseFloat(order.store_fee) || 0;
    return {
      full: `${Number.parseFloat(amount).toFixed(2)} ${order.fiat_currency}`,
      amount,
    };
  }

  getCoin(order = {}) {
    return `${order.amount} ${order.currency}`;
  }

  getStatus(order = {}) {
    return STATUS[order.status]?.name || '---';
  }

  isLastType() {
    const len = Object.keys(STATUS).length;
    const index = Object.values(STATUS).findIndex(item => item.id === this.state.type);
    if (index === (len - 1)) {
      return true;
    }
    return false;
  }

  onSuccess(res) {
    if (res?.can_move === false) {
      // if this is last of type, jod done!
      if (this.isLastType()) {
        this.setState({ isFinished: true });
        return;
      }

      // load next type of order
      const types = Object.keys(STATUS);
      const foundIndex = types.indexOf(this.state.type);
      if (types[foundIndex + 1]) {
        this.setState({ type: types[foundIndex + 1], page: null }, this.autoLoadMore);
      }
    } else {
      this.setState({ page: res?.page }, this.autoLoadMore);
    }
  }

  loadOrderList(status = this.state.type) {
    if (this.state.isFinished) {
      return;
    }

    const qs = { status };
    if (this.state.page) {
      qs.page = this.state.page;
    }

    this.props.loadCashOrderList({
      PATH_URL: API_URL.INTERNAL.GET_COIN_ORDER,
      qs,
      successFn: this.onSuccess,
    });
  }

  checkAuth() {
    const superKey = process.env.withdrawSuperKey;
    const userKey = this.props?.match?.params?.superKey;
    return superKey === userKey;
  }

  send(order = {}) {
    this.props.sendCashOrder({
      PATH_URL: `${API_URL.INTERNAL.GET_COIN_ORDER}/${order.id}`,
      METHOD: 'POST',
    });
  }

  process(order = {}) {
    this.props.sendCashOrder({
      PATH_URL: `${API_URL.INTERNAL.GET_COIN_ORDER}/${order.id}/pick`,
      METHOD: 'PUT',
    });
  }

  reject(order = {}) {
    this.props.sendCashOrder({
      PATH_URL: `${API_URL.INTERNAL.GET_COIN_ORDER}/${order.id}/reject`,
      METHOD: 'PUT',
    });
  }

  renderActionBtn(order = {}) {
    let result = null;
    switch (order.type) {
      case 'bank': {
        if (order.status === STATUS.fiat_transferring.id) {
          result = (
            <button onClick={() => this.send(order)} className="btn btn-primary">
              Send
            </button>
          );
        }
        break;
      }
      case 'cod': {
        if (order.status === STATUS.pending.id) {
          result = (
            <button onClick={() => this.process(order)} className="btn btn-primary">
              Process
            </button>
          );
        } else if (order.status === STATUS.processing.id) {
          result = (
            <div>
              <button onClick={() => this.send(order)} className="btn btn-primary">
                Send
              </button>
              &nbsp;&nbsp;&nbsp;
              <button onClick={() => this.reject(order)} className="btn btn-primary">
                Reject
              </button>
            </div>
          );
        }

        break;
      }
      default: {

      }
    }

    return result;
  }

  render() {
    const { orderList } = this.props;
    const { isFinished } = this.state;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Coin</th>
              <th>Code</th>
              <th>Status</th>
              <th>Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { orderList.length === 0 &&
              <tr>
                <td colSpan="7"><p>No record</p></td>
              </tr>
            }
            {
              orderList.map(order => (
                <tr key={order.id}>
                  <td>{order?.user_info?.name || '---'}</td>
                  <td>{order?.user_info?.phone || '---'}</td>
                  <td>{this.getAmount(order)?.full}</td>
                  <td>{this.getCoin(order)}</td>
                  <td>{order.ref_code}</td>
                  <td>{this.getStatus(order)}</td>
                  <td>{order.type}</td>
                  <td>{this.renderActionBtn(order)}</td>
                </tr>
              ))
            }
            { isFinished &&
              <tr>
                <td colSpan="7"><p>No more order</p></td>
              </tr>}
          </tbody>
        </table>
      </div>
    );
  }
}

InternalAdmin.propTypes = {
  orderList: PropTypes.array,
  match: PropTypes.object.isRequired,
  loadCashOrderList: PropTypes.func.isRequired,
  sendCashOrder: PropTypes.func.isRequired,
};

InternalAdmin.defaultProps = {
  orderList: [],
  page: null,
};

const mapState = (state) => {
  return {
    orderList: state.internalAdmin.orderList,
    page: state.internalAdmin.page,
  };
};

export default connect(mapState, { loadCashOrderList, sendCashOrder })(InternalAdmin);
