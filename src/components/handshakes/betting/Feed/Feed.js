import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler} from './BetHandshakeHandler.js';
import momment from 'moment';

import { APP } from '@/constants';
import local from '@/services/localStore';
import {FIREBASE_PATH} from '@/constants';

// components
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';

// css, icons
import './Feed.scss';
import chipIcon from '@/assets/images/icon/betting/chip.svg';
import conferenceCallIcon from '@/assets/images/icon/betting/conference_call.svg';
import ethereumIcon from '@/assets/images/icon/betting/ethereum.svg';
import BettingHandshake from '@/services/neuron/neuron-bettinghandshake.js';
import Shake from '@/components/core/controls/Button';

import GroupBook from './GroupBook';


class FeedBetting extends React.Component {
  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
      super(props);

      this.state = {

      };


  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {


    return (
      <div>
        {/* Feed */}
        <Feed className="feed" handshakeId={this.props.id} onClick={this.props.onFeedClick} background="white">
          <div className="wrapperBettingFeed">
              
          </div>
        </Feed>
        {/* Shake */}
        {/*statusAction && <Button block onClick={() => { this.clickActionButton(statusAction); }}>{statusAction}</Button>*/}
        {/* Modal */}
        {/*<ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={remaining}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={(amount) => this.submitShake(amount)}
          />
    </ModalDialog>*/}
      </div>
    );

  }
  changeOption(value){
    console.log('Choose option:', value)
    //TO DO: Choose an option
  }
  clickActionButton(title){
    const {role} = this.state;
    const item = this.props;
    const {id, hid} = item;
    const offchain = id;
    switch(title){
      case BETTING_STATUS_LABEL.SHAKE:
        this.modalBetRef.open();
        break;

      case BETTING_STATUS_LABEL.CLOSE:
        // TO DO: CLOSE BET
        BetHandshakeHandler.closeItem(role, hid, offchain);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        // TO DO: WITHDRAW
        BettingHandshake.withdraw(role, hid, offchain);
        break;

      case BETTING_STATUS_LABEL.REJECT:
        // TO DO: REJECT
        BettingHandshake.rejectItem(role, hid, offchain);
        break;

    }

  }
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
});
export default connect(mapState, mapDispatch)(FeedBetting);

