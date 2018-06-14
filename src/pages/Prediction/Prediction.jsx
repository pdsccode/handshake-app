import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import axios from 'axios';
import { URL, API_URL } from '@/constants';
import fixtures from '../../data/liveStreaming/fixtures';
import moment from 'moment';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// self
import './Prediction.scss';

class Prediction extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderMatchItem = ::this.renderMatchItem;
  }

  renderMatchItem(match, index) {
    const slug = match._links.self.href.split('/').slice(-1);
    return (
      <a href={`${URL.LIVE_STREAMING}/${slug}`} className="matchItem" key={index}>
        <div className="matchTime">
          <div className="league">World Cup 2018 Russia</div>
          <div className="time">{moment(match.date).format('LLL')}</div>
        </div>
        <div className="matchInfo">
          <div className="team">
            <img src={match._links.homeTeam.crestUrl} alt={match.homeTeamName} className="teamFlag home" />
            <span className="teamName">{match.homeTeamName}</span>
          </div>
          <div className="vs">vs</div>
          <div className="team">
            <span className="teamName">{match.awayTeamName}</span>
            <img src={match._links.awayTeam.crestUrl} alt={match.awayTeamName} className="teamFlag away" />
          </div>
        </div>
      </a>
    );
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <h1 className="text-center">Matches</h1>
            <div className="listMatch">
              Prediction
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Prediction.propTypes = {

};


export default Prediction;
