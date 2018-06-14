import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { URL } from '@/constants';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// self
import './LiveStreaming.scss';
import russiaFlag from '../../assets/images/team-flag/russia-flag-logo.png';
import saudiArabia from '../../assets/images/team-flag/saudi-arabia-flag-logo.png';

const data = [
  {
    league: 'World cup 2018',
    time: '14/06/2018 22:00',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    slug: 'nga-vs-saudi-arabia-14-6',
  },
  {
    league: 'World cup 2018',
    time: '14/06/2018 22:00',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    slug: 'nga-vs-saudi-arabia-14-6',
  },
  {
    league: 'World cup 2018',
    time: '14/06/2018 22:00',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    slug: 'nga-vs-saudi-arabia-14-6',
  },
  {
    league: 'World cup 2018',
    time: '14/06/2018 22:00',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    slug: 'nga-vs-saudi-arabia-14-6',
  },
  {
    league: 'World cup 2018',
    time: '14/06/2018 22:00',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    slug: 'nga-vs-saudi-arabia-14-6',
  },
  {
    league: 'World cup 2018',
    time: '14/06/2018 22:00',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    slug: 'nga-vs-saudi-arabia-14-6',
  },
];

class LiveStreaming extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderMatchItem = ::this.renderMatchItem;
  }

  renderMatchItem(match, index) {
    return (
      <a href={`${URL.LIVE_STREAMING}/${match.slug}`} className="matchItem" key={index}>
        <div className="matchTime">
          <div className="league">{match.league}</div>
          <div className="time">{match.time}</div>
        </div>
        <div className="matchInfo">
          <div className="team">
            <img src={match.teamHomeFlag} alt={match.teamHomeName} className="teamFlag home" />
            <span className="teamName">{match.teamHomeName}</span>
          </div>
          <div className="vs">vs</div>
          <div className="team">
            <span className="teamName">{match.teamAwayName}</span>
            <img src={match.teamAwayFlag} alt={match.teamAwayName} className="teamFlag away" />
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
              {data.map((item, index) => this.renderMatchItem(item, index))}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

LiveStreaming.propTypes = {

};


export default LiveStreaming;
