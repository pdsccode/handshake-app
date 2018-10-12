import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {push} from 'connected-react-router';
import {URL} from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';
import {injectIntl} from "react-intl";
import {connect} from "react-redux";

class IdVerifyBtn extends React.PureComponent {
  checkUserVerified = () => {
    const { messages } = this.props.intl;
    const { authProfile: { idVerified } } = this.props;

    let timeShow = 0;
    let idVerificationStatusText = 'Rejected';
    let title = '';
    let action = '';

    switch (idVerified) {
      case 0: {
        idVerificationStatusText = <span>{messages.buy_coin.label.verify.notYet.title} <Link to={URL.HANDSHAKE_ME_PROFILE}>{messages.buy_coin.label.verify.notYet.action}</Link></span>;
        timeShow = 24 * 60 * 60 * 1000;
        title = messages.buy_coin.label.verify.notYet.title;
        action = messages.buy_coin.label.verify.notYet.action;
        break;
      }
      case -1: {
        idVerificationStatusText = <span>{messages.buy_coin.label.verify.rejected.title} <Link to={URL.HANDSHAKE_ME_PROFILE}>{messages.buy_coin.label.verify.rejected.action}</Link></span>;
        timeShow = 24 * 60 * 60 * 1000;
        title = messages.buy_coin.label.verify.rejected.title;
        action = messages.buy_coin.label.verify.rejected.action;
        break;
      }
      case 1: {
        idVerificationStatusText = 'Verified';
        break;
      }
      case 2: {
        idVerificationStatusText = <span>{messages.buy_coin.label.verify.processing.title} <Link to={URL.HANDSHAKE_ME_PROFILE}>{messages.buy_coin.label.verify.processing.action}</Link></span>;
        timeShow = 24 * 60 * 60 * 1000;
        title = messages.buy_coin.label.verify.processing.title;
        action = messages.buy_coin.label.verify.processing.action;
        break;
      }
      default: {
        idVerificationStatusText = 'Default';
      }
    }

    return { title, action };
  }

  render() {
    const { dispatch, } = this.props;
    const { title, action } = this.checkUserVerified();
    return (
      <div id="PexCreateBtn" >
        <div className="Idea">
          <img src={IconIdea} alt="" className="IconIdea" />
          <span>{title}</span>
        </div>
        <Link
          to={{ pathname: URL.HANDSHAKE_ME_PROFILE }}
          onClick={() => {
            dispatch(push(URL.HANDSHAKE_ME_PROFILE));
          }}
        >
          <button className="btn btn-report">{action}</button>
        </Link>
      </div>
    );
  }
}

IdVerifyBtn.propTypes = {
  dispatch: PropTypes.func,
}

IdVerifyBtn.defaultProps = {
  dispatch: undefined,
}

const mapStateToProps = (state) => ({
  authProfile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(IdVerifyBtn));
