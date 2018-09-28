import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { injectIntl } from 'react-intl';
// components
// style
import createForm from '@/components/core/form/createForm';
import { change } from 'redux-form';

import TransactionItem from './TransactionItem';

const nameFormTransaction = 'formTransaction';
const FormTransaction = createForm({
  propsReduxForm: {
    form: nameFormTransaction,
  },
});

class Transaction extends React.Component {
  componentDidMount() {
  }

  render() {
    const { cashStoreTransaction } = this.props;

    return (
      <div className="transaction-container mt-4">
        {
          cashStoreTransaction && cashStoreTransaction.map(transaction => {
            const { id } = transaction;
            return (
              <TransactionItem key={id} {...transaction} />
            );
          })
        }
      </div>
    );
  }
}

const mapState = state => ({
  cashStoreTransaction: state.exchange.cashStoreTransaction,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Transaction));
