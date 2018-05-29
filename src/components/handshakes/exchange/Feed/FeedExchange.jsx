import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
// style
import './FeedExchange.scss';
import {FormattedMessage} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {BigNumber} from 'bignumber.js';
import {AMOUNT_DECIMAL, PRICE_DECIMAL} from "@/constants";
import {API_URL} from "../../../../constants";
import ModalDialog from "../../../core/controls/ModalDialog/ModalDialog";
import {connect} from "react-redux";
import {
  cancelShakedOffer, closeOffer, completeShakedOffer, getListOffers, getOffer,
  shakeOffer
} from "../../../../reducers/exchange/action";
import getSymbolFromCurrency from 'currency-symbol-map';

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
    };
  }

  componentDidMount() {
    // this.props.getListOffers({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleGetListOffersSuccess,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.getOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleGetOfferSuccess,
    //   // errorFn: this.handleGetOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.shakeOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleShakeOfferSuccess,
    //   // errorFn: this.handleShakeOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.closeOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleCloseOfferSuccess,
    //   // errorFn: this.handleCloseOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.completeShakedOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleCompleteShakedOfferSuccess,
    //   // errorFn: this.handleCompleteShakedOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.cancelShakedOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleCancelShakedOfferSuccess,
    //   // errorFn: this.handleCancelShakedOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
  }

  handleGetListOffersSuccess = (data) => {
    console.log('data', data);
    this.setState({modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>{'action success'}</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleActionSuccess}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleGetOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleShakeOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCloseOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCompleteShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCancelShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleGetListOffersFailed = (e) => {
    console.log('e', e);
    this.setState({modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>{e.response?.data?.message}</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleActionFailed}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleActionSuccess = () => {
    this.modalRef.close();
  }

  handleActionFailed = () => {
    this.modalRef.close();
  }

  render() {
    const {init_user_id, location, state, status, type, extraData, ...props } = this.props;

    console.log('asfad', this.props);
    const offer = JSON.parse(extraData);
    const {type, amount, currency, fiat_amount, fiat_currency} = offer;

    let modalContent = this.state.modalContent;
    return (
      <div>
        <Feed className="feed p-2 text-white" background="#FF2D55">
          <h5>
            <FormattedMessage id="offerHandShakeContent" values={{ offerType: type === 'buy' ? 'Buy': 'Sell',
            amount: new BigNumber(amount).toFormat(AMOUNT_DECIMAL), currency: currency,
              currency_symbol: getSymbolFromCurrency(fiat_currency),
              total: new BigNumber(fiat_amount || 0).toFormat(PRICE_DECIMAL)
            }}/>
          </h5>
          <div className="media">
            <img className="mr-1" src={iconLocation} width={22} />
              <div className="media-body">
                <h6 className="mt-0">81 E.Augusta Ave. Salinas</h6>
                <div>
                  <small>
                    <FormattedMessage id="offerDistanceContent" values={{ offerType: type === 'buy' ? 'Buyer': 'Seller',
                      distance: 100}} />
                  </small>
                </div>
              </div>
          </div>
        </Feed>
        <Button block className="mt-2">Shake now</Button>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

FeedExchange.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  discover: state.discover,
});

const mapDispatch = ({
  getListOffers,
  getOffer,
  shakeOffer,
  closeOffer,
  completeShakedOffer,
  cancelShakedOffer
});

export default connect(mapState, mapDispatch)(FeedExchange);
