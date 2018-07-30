import React from 'react';
import { connect } from 'react-redux';
import { loadMatches } from '@/reducers/betting/action';
import BettingReport from '@/components/handshakes/betting-event/BettingReport';
import { API_URL } from '@/constants';

import './Admin.scss';

const TAG = 'ADMIN';
class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }


  render() {
    return (
      <BettingReport />
    );
  }
}

export default Admin;
