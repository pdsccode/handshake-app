import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import local from '@/services/localStore';
import {APP} from '@/constants';
import { StringHelper } from '@/services/helper';
import "./Overview.scss"


class PaymentOverview extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentDidMount(){

  }

  render() {

    const { messages } = this.props.intl;

    return (
      <div className="overview-wrapper">
        <h5>Overview</h5>
        <div className="h5-border"></div>
        <div className="content">
          <div className="title">Keep more of your money.</div>
          <div>Credit cards take up to 3% in processing fees on every transaction.
            Accept Bitcoin and Bitcoin Cash with BitPay and get direct bank deposits in your own currency for a simple,
            flat 1% settlement charge.</div>
        </div>
        <div className="content">
          <div className="title">Sell to anyone, anywhere.</div>
          <div>Connect to truly borderless payment networks with Bitcoin and Bitcoin Cash.
            Receive payment in any amount, from anywhere in the world, from any computer or mobile device.</div>
        </div>

        <h5 className="second-h5">E-Commerce</h5>
        <div className="h5-border"></div>
        <div className="content">
          <div className="title">Payment Buttons and Hosted Checkout</div>
          <div>Add a Bitcoin and Bitcoin Cash payment option to your website -
            just copy and paste a few lines of script.</div>
        </div>

        <div className="content">
          <div className="title">Shopping Cart Plugins</div>
          <div>Use one of our popular ecommerce plug-ins to seamlessly
            enable blockchain payments on your website.</div>
        </div>

        <div className="content">
          <div className="title">Hosted Integrations</div>
          <div>Activate blockchain payments through your ecommerce platform provider.</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PaymentOverview));

