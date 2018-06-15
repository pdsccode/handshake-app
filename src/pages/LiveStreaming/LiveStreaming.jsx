import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import axios from 'axios';
import { URL, API_URL } from '@/constants';
import fixtures from '../../data/liveStreaming/fixtures';
import moment from 'moment';
import { groupBy } from 'lodash';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// self
import './LiveStreaming.scss';
import russiaFlag from '../../assets/images/team-flag/russia-flag-logo.png';
import saudiArabia from '../../assets/images/team-flag/saudi-arabia-flag-logo.png';
import headerLS from '../../assets/images/live-streaming/header.svg';
import banner from '../../assets/images/live-streaming/banner.svg';

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

const highlightVideos = [
  {
    url: 'https://www.youtube.com/embed/D9CDFBrTNbM',
    title: 'Russia vs Saudi Arabia 5-0 | All Goals & Extended Highlights',
    time: '',
  },
  {
    url: 'https://www.youtube.com/embed/SDY1N-IJOA8',
    title: 'Russia v Saudi Arabia - 2018 FIFA World Cup Russia™',
    time: '',
  },
  {
    url: 'https://www.youtube.com/embed/LJ2vr7VUytM',
    title: 'Live It Up (Official Video) - Nicky Jam feat. Will Smith & Era Istrefi (2018 FIFA World Cup Russia)',
    time: '',
  },
];

class LiveStreaming extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderMatchItem = ::this.renderMatchItem;
    this.renderMatchesByDate = ::this.renderMatchesByDate;
  }

  renderMatchItem(match, index) {
    const slug = match._links.self.href.split('/').slice(-1);
    return (
      <a href={`${URL.LIVE_STREAMING}/${slug}`} className="matchItem" key={index}>
        <div className="matchInfo">
          <div className="team">
            <span className="teamName">{match.homeTeamName}</span>
            {/*<img src={match._links.homeTeam.crestUrl} alt={match.homeTeamName} className="teamFlag home" />*/}
          </div>
          <div className="vs">{moment(match.date).format('HH:mm')}</div>
          <div className="team">
            {/*<img src={match._links.awayTeam.crestUrl} alt={match.awayTeamName} className="teamFlag away" />*/}
            <span className="teamName">{match.awayTeamName}</span>
          </div>
        </div>
      </a>
    );
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
                {matches.map((item, index) => this.renderMatchItem(item, index))}
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
    console.log(dateKeys, "data keys", groupMatchesByDate['Jun 15'], groupMatchesByDate['Jun 16']);
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
