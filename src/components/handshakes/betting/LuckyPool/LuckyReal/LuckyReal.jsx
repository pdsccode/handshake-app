import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyReallSVG from '@/assets/images/luckypool/lucky-real.svg';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';
import {
  getMessageWithCode,
} from '@/components/handshakes/betting/utils.js';
import GA from '@/services/googleAnalytics';
import { API_URL } from '@/constants';
import { submitEmailSubcribe } from '@/reducers/auth/action';

import './LuckyReal.scss';

class LuckyReal extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,
    submitEmailSubcribe: PropTypes.func,
    isExistEmail: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
    ]),
    fetching: PropTypes.bool,
  }
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isValidEmail: true,
      errorMessage: '',
    };
  }
  changeText(text) {
    this.setState({
      email: text,
    });
  }

  sendEmail() {
    const { email } = this.state;
    if (!isEmail(email)) {
      this.setState({
        isValidEmail: false,
        errorMessage: 'Please enter right email format',
      });
    } else {
      this.submitEmail(email);
    }
  }
  submitEmail(email) {
    GA.clickNotifyMe(email);

    const params = {
      email,
    };
    this.props.submitEmailSubcribe({
      PATH_URL: API_URL.CRYPTOSIGN.SUBCRIBE_EMAIL_PREDICTION,
      METHOD: 'POST',
      data: params,
      successFn: ((successData)=> {
        this.props.onButtonClick();
      }),
      errorFn: ((error)=> {
        const { status, code } = error;
        if (status === 0) {
          const message = getMessageWithCode(code);
          console.log(error);
          this.setState({
            isValidEmail: false,
            errorMessage: message,
          });
        }
      }),
    });
  }
  renderErrorField() {
    const { errorMessage } = this.state;
    return (
      <div className="errorField">*{errorMessage}</div>
    );
  }
  renderEmail() {
    const { isValidEmail } = this.state;
    return (
      <div className="wrapperEmail">
        {!isValidEmail && this.renderErrorField()}
        <div className="wrapperFieldEmail">
          <input
            className="emailPopupInput"
            type='text'
            autoComplete="off"
            id='email'
            placeholder="Enter your email"
            onChange={(evt) => {
              this.changeText(evt.target.value);
            }}
            />
          <Button
            className="emailPopupButton"
            isLoading={this.props.fetching}
            onClick={() => {
              this.sendEmail();
            }}
          >
          Submit
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="wrapperLuckyReal">
        <Image className="luckyImage" src={LuckyReallSVG} alt="luckyreal" />
        <div className="luckySmallDes">Nice. You’ll be entered into the prize draw to win one (or more) of 10x 1ETH prizes!</div>
        <div className="luckySmallDes">
        BUT, you’ll need to give us your email address so we can contact you if you win:
        </div>
        {this.renderEmail()}
        <div className="luckyDes">Increase your chances</div>
        <Button
          className="luckyButton"
          onClick={() => this.props.onButtonClick()}

        >
            Place another bet
        </Button>
      </div>
    );
  }
}
const mapState = state => ({
  fetching: state.auth.fetching,
});
const mapDispatch = ({
  submitEmailSubcribe,

});
export default connect(mapState, mapDispatch)(LuckyReal);
