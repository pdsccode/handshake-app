import React from 'react';
import { connect } from 'react-redux';
import { loadMatches } from '@/reducers/betting/action';
import { API_URL } from '@/constants';

import BettingReport from '@/components/handshakes/betting-event/BettingReport';

import './Resolve.scss';

class Resolve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {

    this.fetchMatches();
  }

  componentWillReceiveProps(nextProps) {
    const { matches } = nextProps;
    this.setState ({
      matches,
    });
  }

  fetchMatches() {
    console.log('fetchMatches');

    this.props.loadMatches({
      PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES}?report=1`,
    });
  }
  render() {
    const { matches } = this.state;

    return (
      <BettingReport matches={matches}/>
    );
  }
}


const mapState = state => ({
  matches: state.betting.matches,
});
const mapDispatch = ({
  loadMatches,
});


export default connect(mapState, mapDispatch)(Resolve);
