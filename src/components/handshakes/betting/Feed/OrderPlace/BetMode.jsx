import React from 'react';
import PropTypes from 'prop-types';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import BettingFilterFree from '@/components/handshakes/betting/Feed/Filter/FilterFree';

import Tabs from './../Tabs';

class BetMode extends React.PureComponent {
  static propTypes = {
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
  }

  static defaultProps = {
    selectedOutcome: {},
    selectedMatch: {},
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOutcome } = nextProps;
    this.callHanshake(selectedOutcome);
  }

  afterTabChanges = (tab) => {
    const tabType = tab.toLowerCase();
    console.log('BETMODE', tabType);
  }

  render() {
    const { selectedOutcome, selectedMatch } = this.props;
    return (
      <React.Fragment>
        <Tabs htmlClassName="BetModeContainer" afterClick={this.afterTabChanges}>
          <div className="BetModeItem" label="Paid bet">
            <BettingFilter
              selectedOutcome={selectedOutcome}
              selectedMatch={selectedMatch}
              getHanshakeList={(click) => { this.callHanshake = click; }}
            />
          </div>
          <div className="BetModeItem" label="Free bet">
            <BettingFilterFree
              selectedOutcome={selectedOutcome}
              selectedMatch={selectedMatch}
            />
          </div>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default BetMode;
