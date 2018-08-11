import React from 'react';
import { connect } from 'react-redux';
import { loadMatches } from '@/reducers/betting/action';
import BettingReport from '@/components/handshakes/betting-event/BettingReport';
import { API_URL } from '@/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

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

  callContractReport(outcomes, list) {
    if (list.length > 0) {
      const firstItem = list[0];
      const { contract_address, contract_json } = firstItem;
      betHandshakeHandler.reportOutcomes(outcomes, contract_json, contract_address);
    }
  }

  render() {
    const { matches } = this.state;
    return (
      <BettingReport
        matches={matches}
        onReportSuccess={(outcomes, list)=> {
          this.fetchMatches();
          this.callContractReport(outcomes, list);
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
});

export default connect(mapState, mapDispatch)(Report);
