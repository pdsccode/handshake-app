import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import axios from 'axios';
import { URL, API_URL } from '@/constants';
import fixtures from '../../data/liveStreaming/fixtures';
import highlightVideos from '../../data/liveStreaming/highlightVideos';
import moment from 'moment';
import { groupBy } from 'lodash';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// self
import './Prediction.scss';
import russiaFlag from '../../assets/images/team-flag/russia-flag-logo.png';
import saudiArabia from '../../assets/images/team-flag/saudi-arabia-flag-logo.png';
import headerLS from '../../assets/images/live-streaming/header.svg';
import banner from '../../assets/images/live-streaming/banner.svg';

class MatchItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      goalsAwayTeam: 0,
      goalsHomeTeam: 0,
    };
    this.randomGoals = ::this.randomGoals;
  }

  randomGoals() {
    const random = () => Math.floor((Math.random() * 3) + 1);
    this.setState({
      goalsAwayTeam: random(),
      goalsHomeTeam: random(),
    });
  }

  render() {
    const { match } = this.props;
    const { goalsHomeTeam, goalsAwayTeam } = this.state;
    return (
      <div className="matchItem">
        <div className="matchInfo">
          <div className="team">
            <span className="teamName">{match.homeTeamName}</span>
            {/*<img src={match._links.homeTeam.crestUrl} alt={match.homeTeamName} className="teamFlag home" />*/}
          </div>
          <div className="vs">
            <div className="goals">{`0${goalsHomeTeam}`}</div>
            <div className="dots"> : </div>
            <div className="goals">{`0${goalsAwayTeam}`}</div>
          </div>
          <div className="team">
            {/*<img src={match._links.awayTeam.crestUrl} alt={match.awayTeamName} className="teamFlag away" />*/}
            <span className="teamName">{match.awayTeamName}</span>
          </div>
        </div>
        <button onClick={this.randomGoals}>Get the Score</button>
      </div>
    );
  }
}

class LiveStreaming extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderMatchesByDate = ::this.renderMatchesByDate;
  }

  renderMatchesByDate(keyDate, matches, index) {
    return (
      <div key={index}>
        <div className="listMatchTitle">
          <div>World Cup 2018 Russia</div> <div>{keyDate}</div>
        </div>
        <Grid>
          <Row>
            <Col md={12} xs={12}>
              <div className="listMatch">
                {matches.map((item, index) => <MatchItem match={item} key={index} />)}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  render() {
    const matches = fixtures.filter(item => {
      const now = moment();
      const matchTime = moment(item.date).add(100, 'm');
      return matchTime.isSameOrAfter(now, 'milliseconds');
    });
    const groupMatchesByDate = groupBy(matches.slice(0, 5), item => moment(item.date).format("MMM DD"));
    const dateKeys = Object.keys(groupMatchesByDate);
    return (
      <div className="liveStreamingIndex">
        <div>
          <img src={headerLS} width="100%" style={{marginTop: '-3px'}} />
          <a href="https://ninja.org/">
            <img src={banner} width="100%" style={{marginTop: '-20px'}} />
          </a>
        </div>
        {
          dateKeys.map((keyDate, index) => this.renderMatchesByDate(keyDate, groupMatchesByDate[keyDate], index))
        }
        <Grid>
          <Row>
            <Col md={12} xs={12}>
              <div className="hightlightVideos">
                <p>HIGHLIGHT VIDEO</p>
                <ul>
                  {highlightVideos.map((item, index) => (
                    <li key={index}>
                      <iframe src={item.url} allowFullScreen/>
                      <div>
                        {item.title}
                      </div>
                    </li>)
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

LiveStreaming.propTypes = {

};


export default LiveStreaming;
