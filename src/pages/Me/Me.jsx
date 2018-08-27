import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
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
import { injectIntl } from 'react-intl'
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action'
// style
import { setOfflineStatus } from '@/reducers/auth/action'
import { fieldRadioButton } from '@/components/core/form/customField'
import createForm from '@/components/core/form/createForm'

import './Me.scss'
import { change } from 'redux-form'
import { MasterWallet } from '@/services/Wallets/MasterWallet'

const nameFormFilterFeeds = 'formFilterFeeds'
const FormFilterFeeds = createForm({
  propsReduxForm: {
    form: nameFormFilterFeeds
  }
})

class Me extends React.Component {
  render () {
    return (
      <div>ahihi</div>
    )
  }
}

const mapState = state => ({
  me: state.me
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
})

export default injectIntl(compose(withFirebase, connect(mapState, mapDispatch))(Me))
