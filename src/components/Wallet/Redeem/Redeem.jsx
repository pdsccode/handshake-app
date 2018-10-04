import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { verifyRedeemCode } from '@/reducers/auth/action';
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
      error: '',
    };    
  }

  handleNameChange =(value)=>{
    this.setState({redeemCode: value, error: ''});
  }

  checkRedeemCode=()=>{
    this.props.verifyRedeemCode({
      PATH_URL: 'user/verification/redeem-code/check?code='+this.state.redeemCode,
      METHOD: 'POST',
      successFn: (res) => {
        alert(res.status);
        if(res){
          // move step 2 
        }        
      },
      errorFn: (e) =>{ 
        if (e.message)       
          this.setState({error: e.message});
        else
          console.log(e);
      }
    });
  }


  render() {
    const { messages } = this.props.intl;    
    
    return (
     <div className="redeem-page">   

        <Modal title={messages.wallet.action.redeem.title}>
          < div className="title"> 
              <img src={gitfBox} /> 
              <div>{messages.wallet.action.redeem.title}</div>
          </div>
        </Modal>

        <div className="title">
          <img src={gitfBox} /> 
          <div>{messages.wallet.action.redeem.title}</div>
        </div>
        <div className="body">
            <div className="redeem-code">
              <Input required placeholder={messages.wallet.action.redeem.your_code} maxLength="40" value={this.state.redeemCode} onChange={this.handleNameChange} /> 
              {this.state.error && <div className="error">{this.state.error}</div>}
            </div>                     
            <div className="buttonRedeem">              
              <Button onClick={this.checkRedeemCode}>{messages.wallet.action.redeem.button_check}</Button>
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
  verifyRedeemCode: bindActionCreators(verifyRedeemCode, dispatch),   
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Redeem));
