import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action'
import {
  API_URL,
  APP,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL
} from '@/constants'
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedMessage, injectIntl } from 'react-intl'
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action'
// style
import { setOfflineStatus } from '@/reducers/auth/action'
import createForm from "@/components/core/form/createForm";
import { change, Field } from 'redux-form';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';

const nameFormOverview = "formOverview";
const FormOverview = createForm({
  propsReduxForm: {
    form: nameFormOverview
  }
});

const listCurrency = [
  {
    id: 'eth',
    text: <span><img src={iconEthereum} width={24} /> ETH</span>,
  },
  {
    id: 'btc',
    text: <span><img src={iconBitcoin} width={24} /> BTC</span>,
  },
  {
    id: 'bch',
    text: <span><img src={iconBitcoinCash} width={24} /> BCH</span>,
  },
]

class Overview extends React.Component {

  render () {
    return (
      <div>
        <FormOverview>
          <div className="bg-white" style={{ padding: '15px' }}>
            <div className="d-table w-100">
              <div className="d-table-cell font-weight-bold">Stats</div>
              <div className="d-table-cell text-right">
                <Field
                  name="currency"
                  component={fieldDropdown}
                  // defaultText={
                  //   <FormattedMessage id="landing_page.recruiting.referFriend.label.jobPosition" />
                  // }
                  classNameDropdownToggle="dropdown-sort bg-white"
                  classNameWrapper="d-inline-block"
                  list={listCurrency}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="d-table w-100">
                <div className="d-table-cell text-normal">
                  BTC bought
                </div>
                <div className="d-table-cell text-right green-color">
                  +124.1234
                </div>
              </div>

              <div className="d-table w-100 mt-2">
                <div className="d-table-cell text-normal">
                  BTC sold
                </div>
                <div className="d-table-cell text-right red-color">
                  50.3232
                </div>
              </div>

              <div className="d-table w-100 mt-2">
                <div className="d-table-cell text-normal">
                  Amount left
                </div>
                <div className="d-table-cell text-right black-color">
                  75.74334
                </div>
              </div>

              <hr />

              <div className="d-table w-100 mt-2">
                <div className="d-table-cell text-normal">
                  Revenue
                </div>
                <div className="d-table-cell text-right black-color">
                  $1,000,000
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <div className="d-inline-block" style={{ width: '90%' }}>
              <button className="btn btn-block primary-button">
                <img src={iconLock} width={14} className="align-top mr-2" />
                <FormattedMessage id="dashboard.btn.topUpByCC" />
              </button>
            </div>
            <div className="text-normal my-2">or</div>
            <div className="d-inline-block" style={{ width: '90%' }}>
              <button className="btn btn-block secondary-button">
                <FormattedMessage id="dashboard.btn.scanQRCode" />
              </button>
            </div>
          </div>

        </FormOverview>
      </div>
    )
  }
}

const mapState = state => ({
  me: state.me
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
})

export default injectIntl(connect(mapState, mapDispatch)(Overview))
