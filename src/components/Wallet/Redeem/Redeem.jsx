import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import './Redeem.scss';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { getReferalInfo } from '@/reducers/exchange/action';
import { shortenUser } from '@/services/offer-util';
import Button from '@/components/core/controls/Button';
import Input from '../Input';

import gitfBox from '@/assets/images/wallet/images/gift-gift-box.svg';


class Redeem extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {      
      redeemCode: this.props.data.code || ' ',
    };    
  }


  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {
      },
    });
  }

  showToast(mst) {
    this.showAlert(mst, 'primary', 3000);
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }

  hideLoading() {
    this.props.hideLoading();
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }  

  handleNameChange =(value)=>{
    this.setState({redeemCode: value});
  }


  render() {
    const { messages } = this.props.intl;    
    
    return (
     <div className="redeem-page">        
        <div className="title">
          <img src={gitfBox} /> 
          <div>{messages.wallet.action.redeem.title}</div>
        </div>
        <div className="body">
            <div className="redeem-code">
              <Input required placeholder={messages.wallet.action.redeem.your_code} maxLength="40" value={this.state.redeemCode} /> 
            </div>                     
            <div className="buttonRedeem">              
              <Button>{messages.wallet.action.redeem.button_check}</Button>
            </div>
            <div className="findcode">
              <a href="#">
                {messages.wallet.action.redeem.find_code}
              </a>            
            </div>
        </div>
     </div>
    );
  }
}

const mapStateToProps = (state) => ({
  referalInfo: state.exchange.referalInfo,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),  
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Redeem));
