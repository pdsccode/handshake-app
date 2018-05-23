import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import {connect} from "react-redux";
import CreditCard from './components/CreditCard';
import {getCryptoPrice, createCCOrder} from '@/reducers/exchange/action';

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      // isNewCCOpen: false
    }
  }

  componentDidMount() {
    // this.props.profileActions.getUserProfile({isFull: true});

    // this.props.dispatch(change('credit-card', 'amount', '1'));
    this.getCryptoPriceByAmount(0);

    this.intervalCountdown = setInterval(() => {
      this.getCryptoPriceByAmount(this.state.amount);
    }, 5000);
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
  }

  getCryptoPriceByAmount = (amount) => {
    // const {app: {setting: {cryptoCurrency}}} = this.props;
    const cryptoCurrency = 'BTC';

    var data = {amount: amount, currency: cryptoCurrency};

    console.log('getCryptoPriceByAmount', data);

    this.props.getCryptoPrice({data});
  }

  handleCreateCCOrder = (params) => {
    const {cryptoPrice} = this.props;
    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiat_amount.trim(),
        fiat_currency: "USD",
        payment_method_data: params
      };
      // console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder(paramsObj);
    }
  }


  handleSubmit = (values) => {
    console.log('handleSubmit', values);
    // const {userProfile: {credit_card}, dispatch} = this.props;
    //
    // let cc = {};
    //
    // //Use existing credit card
    // if (credit_card.cc_number.trim().length > 0 && !this.state.isNewCCOpen) {
    //   cc = {token: "true"};
    // } else {
    //   const {cc_number, cc_expired, cc_cvc} = values;
    //   cc = {
    //     cc_num: cc_number && cc_number.trim(),
    //     cvv: cc_cvc && cc_cvc.trim(),
    //     expiration_date: cc_expired && cc_expired.trim(),
    //     token: "",
    //     save: "true"
    //   };
    // }
    //
    // // console.log('handleSubmit', cc);
    this.handleCreateCCOrder(cc);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <CreditCard handleSubmit={this.handleSubmit}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  getCryptoPrice,
  createCCOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
