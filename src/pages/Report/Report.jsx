import React from 'react';
import { connect } from 'react-redux';
import { loadMatches } from '@/reducers/betting/action';
import BettingReport from '@/components/handshakes/betting-event/BettingReport';
import { API_URL } from '@/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import {
  getBalance, getEstimateGas,
} from '@/components/handshakes/betting/utils';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { showAlert } from '@/reducers/app/action';


const TAG = 'REPORT';
const betHandshakeHandler = BetHandshakeHandler.getShareManager();

class Report extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      login: false,
    };
  }

  componentDidMount() {
    this.fetchMatches();

  }

  componentWillReceiveProps(nextProps) {
    const { matches } = nextProps;
    this.setState({
      matches,
    });
  }

  fetchMatches() {
    console.log('fetchMatches');
    this.props.loadMatches({
      PATH_URL: `${API_URL.CRYPTOSIGN.MATCHES_REPORT}`,
    });
  }

  async callContractReport(outcomes) {
    if (outcomes.length > 0) {
      let message = null;
      const balance = await getBalance();
      const estimatedGas = await getEstimateGas();
      const totalGas = estimatedGas * outcomes.length;
      if (totalGas > balance) {
        message = MESSAGE.NOT_ENOUGH_GAS.replace('{{value}}', totalGas);

        this.props.showAlert({
          message: <div className="text-center">{message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        });
      }else {
        betHandshakeHandler.reportOutcomes(outcomes);

      }
    }
  }

  render() {
    const { matches } = this.state;
    return (
      <BettingReport
        matches={matches}
        isAdmin={false}
        onReportSuccess={(outcomes)=> {
          this.fetchMatches();
          this.callContractReport(outcomes);
        }}
      />
    );
  }
}

const mapState = state => ({
  matches: state.betting.matches,
  login: state.admin.login,
});

const mapDispatch = ({
  loadMatches,
  showAlert,

});

export default connect(mapState, mapDispatch)(Report);
