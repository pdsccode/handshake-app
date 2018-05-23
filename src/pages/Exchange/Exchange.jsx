import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import {connect} from "react-redux";
import CreditCard from './components/CreditCard';
import Tabs from './components/Tabs';
import {getUserProfile, getCryptoPrice, createCCOrder, getUserCcLimit, getCcLimits} from '@/reducers/exchange/action';

class Exchange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      isNewCCOpen: false
    }
  }

  componentDidMount() {
    this.props.getUserProfile({});
    this.props.getCcLimits({});

    // this.props.dispatch(change('credit-card', 'amount', '1'));
    this.getCryptoPriceByAmount(0);

    this.intervalCountdown = setInterval(() => {
      this.getCryptoPriceByAmount(this.state.amount);
    }, 30000);
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

    this.props.getCryptoPrice({data, successFn: () => { console.log('successFn')}, errorFn: () => { console.log('errorFn')}});
  }

  handleCreateCCOrder = (params) => {
    // const {cryptoPrice} = this.props;
    const cryptoPrice = {amount: '123', currency: 'BTC', fiat_amount: '1234567'};
    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiat_amount.trim(),
        fiat_currency: "USD",
        payment_method_data: params
      };
      // console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({data: paramsObj});
    }
  }


  handleSubmit = (values) => {
    console.log('handleSubmit', values);
    // const {userProfile: {credit_card}, dispatch} = this.props;
    const credit_card = {cc_number: ''};

    let cc = {};

    //Use existing credit card
    if (credit_card.cc_number.trim().length > 0 && !this.state.isNewCCOpen) {
      cc = {token: "true"};
    } else {
      const {cc_number, cc_expired, cc_cvc} = values;
      cc = {
        cc_num: cc_number && cc_number.trim(),
        cvv: cc_cvc && cc_cvc.trim(),
        expiration_date: cc_expired && cc_expired.trim(),
        token: "",
        save: "true"
      };
    }

    console.log('handleSubmit', cc);
    this.handleCreateCCOrder(cc);
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <CreditCard handleSubmit={this.handleSubmit} />
            <Tabs
              activeIndex={1}
              onClickTab={(tab) => console.log('tab', tab)}
              data={{
                1: {
                  header: 'Buy',
                  element: (
                    <div>Buy</div>
                  )
                },
                2: {
                  header: 'Sell',
                  element: (
                    <div>Sell</div>
                  )
                },
              }}
            />
          </div>
        </div>
      </div>
    )
    // return (
    //   <Grid>
    //     <Row>
    //       <Col xs={12}>
    //
    //       </Col>
    //     </Row>
    //   </Grid>
    // );
  }
}

const mapStateToProps = (state) => ({
  // cryptoPrice: state.exchange.cryptoPrice,
});

const mapDispatchToProps = {
  getUserProfile,
  getCryptoPrice,
  createCCOrder,
  getUserCcLimit,
  getCcLimits
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
