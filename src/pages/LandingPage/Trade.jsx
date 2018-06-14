/**
 * Trade component.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service
import axios from 'axios';
import qs from 'qs';
import { showAlert } from '@/reducers/app/action';

import Alert from '@/components/core/presentation/Alert';

// style
import './Trade.scss';
import ninjaIcon from '@/assets/images/icon/landingpage/trading-ninja.svg';
import tradeCoinExchange from '@/assets/images/icon/landingpage/trade-coin-exchange.svg';
import tradeThirdContainer from '@/assets/images/icon/landingpage/trade-third-container.svg';
import paymentMethodIcon from '@/assets/images/icon/landingpage/trade-payment-method.svg';
import safeIcon from '@/assets/images/icon/landingpage/trade-safe.svg';
import fastAnOnIcon from '@/assets/images/icon/landingpage/trade-fast-and-on.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-white.svg';

const inputRefOne = 'emailRef';
const inputRefTwo = 'emailRefTwo';

const data = [
  {
    question: 'What ID do I need as a seller or a buyer?',
    answer: 'We do not need ID verification. If you verify your phone number, you will have the chance to get 1 free ETH to make transactions on Shake Ninja',
  },
  {
    question: 'Are credit cards accepted?',
    answer: 'Yes. We accept Visa, Mastercard, Amex and Discover',
  },
  {
    question: 'What currencies can people exchange?',
    answer: 'We accept all types of currencies',
  },
  {
    question: 'Is there a system to track the trading history?',
    answer: 'Yes. We count the successful and failed transactions with clear report for each seller and buyer',
  },
  {
    question: 'Is there any country restricted for this platform?',
    answer: 'We are available for all countries',
  },
  {
    question: 'Is there decentralized exchange?',
    answer: 'Yes. Therefore the transaction is 100% safe and secured',
  },
  {
    question: 'Can I use paypal?',
    answer: 'We are not available on Paypal at the moment',
  },
  {
    question: 'Will the funds be held in Escrow?',
    answer: 'Yes, in either Escrow on smart contract or ethereum blockchain',
  },
  {
    question: 'How will the Smart Contract execute when physical cash is involved and there is a lag in transaction time?',
    answer: 'After receiving the physical cash, the seller will click on the accept button, the coin will be automatically transferred to the buyer. The process takes about 10 minutes to 20 minutes',
  },
];

class Collapse extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.toggle = ::this.toggle;
  }

  toggle() {
    this.setState(state => ({isCollapsed: !state.isCollapsed}));
  }

  render() {
    const { isCollapsed } = this.state;
    const { label, content, isList, index } = this.props;
    return (
      <div className="collapse-custom">
        <div
          className="head"
          onClick={this.toggle}
        >
          <div className="label">
            <div className="index">{index}{index > 9 ? '.' : '. '}</div><div>{label}</div>
          </div>
          <div className="extend">
            <img className={isCollapsed ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
          </div>
        </div>
        <div className={`content ${isList ? '' : 'noList'} ${!isCollapsed ? '' : 'd-none'}`}>
          {isList ? (
            <dl>
              {content.map((item, index) => [
                <dt>{item.title}</dt>,
                <dd>{item.content}</dd>
              ])}
            </dl>
          ) : content}
        </div>
      </div>
    )
  }
}

class Handshake extends React.Component {
  constructor(props) {
    super(props);
    this.injectFontPage = this.injectFontPage.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
    this.renderInputForm = this.renderInputForm.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.isEmail = this.isEmail.bind(this);
  }
  productId = 1297;

  componentDidMount() {
    if (window.addEventListener)
      window.addEventListener('load', this.injectFontPage, false);
    else if (window.attachEvent)
      window.attachEvent('onload', this.injectFontPage);
    else window.onload = this.injectFontPage;
  }

  componentWillReceiveProps() {
    this.injectFontPage();
  }

  showAlertMessage({ message, type = 'danger' }) {
    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 3000,
      type,
      callBack: () => {
      },
    });
  }

  isEmail(email = '') {
    const RE_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return RE_EMAIL.test(email);
  }

  submitEmail(inputRef) {
    console.log("inputRef", inputRef);
    const emailValue = this[inputRef].value.trim();
    console.log("inputRef", inputRef);
    // validation email
    if (!emailValue) {
      this.showAlertMessage({message: 'Email is empty!'});
      return;
    }
    if (!this.isEmail(emailValue)) {
      this.showAlertMessage({ message: 'Email is invalid.' });
      return;
    }

    // const ref = Helper.getValueParamURLQueryByName('ref') || '';
    const params = {
      ref: '',
      email: emailValue,
      has_options: 1,
    };

    // ga('send', 'event', 'ShakeNinja', 'submit register email');
    const backOrder = axios({
      method: 'post',
      url: `https://www.autonomous.ai/api-v2/order-api/order/back-order/${this.productId}?${qs.stringify(params)}`,
      data: {},
    });
    backOrder.then((backOrderResult) => {
      if (backOrderResult.data.status > 0) {
        this.showAlertMessage({message: 'Success!', type: 'success'});
      } else {
        this.showAlertMessage({message: backOrderResult.data.message});
      }
    }).catch(error => {
      this.showAlertMessage({message: error});
    });
  }

  injectFontPage() {
    if (!document.getElementById('anonymous-pro')) {
      const PoppinsElement = document.createElement('link');
      PoppinsElement.id = 'anonymous-pro';
      PoppinsElement.href = 'https://use.typekit.net/qow3iea.css';
      PoppinsElement.rel = 'stylesheet';
      document.body.appendChild(PoppinsElement);
    }
    if (!document.getElementById('azo-sans')) {
      const AzoSansElement = document.createElement('link');
      AzoSansElement.id = 'azo-sans';
      AzoSansElement.href = 'https://use.typekit.net/nfr2whb.css';
      AzoSansElement.rel = 'stylesheet';
      document.body.appendChild(AzoSansElement);
    }
  }

  renderInputForm({id, onSubmit, refName}) {
    return (
      <form className="registerEmail" onSubmit={onSubmit}>
        <input
          className="email"
          name="email"
          type="text"
          id={id}
          placeholder="Enter your email"
          ref={input => this[refName] = input}
        />
        <button className="btnSubmit" onClick={onSubmit}>
          <span>Join mailing list</span>
        </button>
      </form>
    )
  }

  render() {
    return (
      <div className="root">
        <Alert />
        <div className={`container firstContainer`}>
          <div className={`row rowEqHeight`}>
            <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
              <img src={ninjaIcon} alt="ninja icon" className="bannerIcon" />
              <h1>Trade Easy. Stay Safe</h1>
              <dl>
                <dt>1. Post your trade</dt>
                <dd>Select the coin you want to buy/sell along with your desired price</dd>

                <dt>2. Choose your shop</dt>
                <dd>Search and choose the most suitable shop in your location</dd>

                <dt>3. Fulfill your exchange</dt>
                <dd>Meet up at the shop and exchange cash to coin or coin to cash</dd>

                <dt>4. Secure your payment</dt>
                <dd>Process has been secured 100% by smart contract</dd>
              </dl>

              <div className="row bottomBox">
                <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                  <a href="/"
                     className="btnStartTrading"
                  >
                    <span>Start Trading Now</span>
                  </a>
                </div>
                <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                  {
                    this.renderInputForm({
                      id: 'email-1',
                      onSubmit: (e) => {
                        e && e.preventDefault();
                        this.submitEmail(inputRefOne);
                      },
                      refName: inputRefOne,
                    })
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 d-none d-lg-block">
              {/*<img src={appScreenIcon} alt="app screen" className={`img-fluid ${s.appScreen}`} />*/}
              <div className="appScreen">
                {/*<video src={appScreenVideo} autoPlay="autoplay" loop="loop" muted="muted" className={s.appScreenVideo} />*/}
              </div>
            </div>
          </div>
        </div>
        <div className={`container secondContainer`}>
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <img src={tradeCoinExchange} alt="trade coin exchange icon" className="img-fluid" />
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <p className="subTitle">We are the first to offer a completely decentralized platform to buy and sell Bitcoin and Ethereum.</p>
              <p className="description">
                Multiple payment method: credit card and cash<br />
                Secured transaction by blockchain technology<br />
                Fast and convenient usage.
              </p>
            </div>
          </div>
        </div>
        <div className={`container thirdContainer`}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <img src={tradeThirdContainer} alt="third container" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className={`container fourContainer text-center`}>
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={paymentMethodIcon} height={80} />
              <p className="subTitle">Multiple Payment Method</p>
              <p className="description">We are available for cash - coin trading and credit card - coin trading. Find your nearest traders and leave no transaction history for any activity on our platform.</p>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={fastAnOnIcon} width={80} height={80} />
              <p className="subTitle">Fast and On the go</p>
              <p className="description">With location based trading, we allow you to make payment in few minutes with utmost convenience.</p>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={safeIcon} width={70} height={80} />
              <p className="subTitle">100% safe and secured for both sides</p>
              <p className="description">Unlike any other platform, we do not hold users' keys and grant full key controls to buyers and sellers.</p>
            </div>
          </div>
        </div>

        <div className={`container fiveContainer`}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <p className="subTitle">Have any questions?</p>
              <div>
                {data.map((item, index) => <Collapse label={item.question} content={item.answer} isList={item.isList} key={index} index={index + 1} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Handshake.propTypes = {
  showAlert: PropTypes.func.isRequired,
};


const mapDispatch = ({
  showAlert,
});

export default connect(null, mapDispatch)(Handshake);
