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
import AtmCashTransferInfo from '@/components/handshakes/exchange/AtmCashTransferInfo';
import Modal from "@/components/core/controls/Modal/Modal";

const nameFormTransaction = 'formTransaction';
const FormTransaction = createForm({
  propsReduxForm: {
    form: nameFormTransaction,
  },
});

class Transaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      modalTitle: '',
    };
  }

  componentDidMount() {
  }

  closeModal = () => {
    this.setState({ modalContent: '' });
  }

  onReceiptSaved = () => {
    this.modalRef.close();
  }

  openNewTransaction = () => {
    const { messages } = this.props.intl;
    const receipt = {};

    this.setState({
      modalTitle: messages.atm_cash_transfer.title,
      modalContent:
        (
          <AtmCashTransferInfo receipt={receipt} onDone={this.onReceiptSaved} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  render() {
    const { cashStoreTransaction } = this.props;
    const { modalContent, modalTitle } = this.state;

    return (
      <div className="transaction-container mt-4">
        <div>
        {
          cashStoreTransaction && cashStoreTransaction.map(transaction => {
            const { id } = transaction;
            return (
              <TransactionItem key={id} {...transaction} onShowTransferInfo={this.openNewTransaction}/>
            );
          })
        }
        </div>
        <Modal title={modalTitle} onRef={modal => this.modalRef = modal} onClose={this.closeModal}>
          {modalContent}
        </Modal>
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
