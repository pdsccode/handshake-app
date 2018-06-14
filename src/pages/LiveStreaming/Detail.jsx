import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { find } from 'lodash';
import fixtures from '../../data/liveStreaming/fixtures';
import moment from 'moment';

// components
import { Grid, Row, Col } from 'react-bootstrap';

// self
import './LiveStreamingDetail.scss';
import russiaFlag from '../../assets/images/team-flag/russia-flag-logo.png';
import saudiArabia from '../../assets/images/team-flag/saudi-arabia-flag-logo.png';

const data = {
  'nga-vs-saudi-arabia-14-6': {
    league: 'World cup 2018',
    time: '22:00',
    date: '14/06/2018',
    teamHomeName: 'Russia',
    teamHomeFlag: russiaFlag,
    teamAwayName: 'Saudi Arabia',
    teamAwayFlag: saudiArabia,
    link: 'https://wc.kenhtructiep.com/ss.php?v=1481482',
    linksLive: [
      'https://wc.kenhtructiep.com/ss.php?v=1481482',
      'https://wc.kenhtructiep.com/ss.php?v=1481533',
      'https://wc.kenhtructiep.com/ss.php?v=1481565',
    ],
    linksSoftCast: [
      'https://wc.kenhtructiep.com/ss.php?v=1481482',
      'https://wc.kenhtructiep.com/ss.php?v=1481482',
      'https://wc.kenhtructiep.com/ss.php?v=1481482',
    ],
  },
};

class Detail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: this.match.link,
    };
  }

  get match() {
    const { params } = this.props.match;
    return find(fixtures, item => item._links.self.href === `http://api.football-data.org/v1/fixtures/${params.slug}`) || fixtures[1];
  }

  render() {
    const match = this.match;
    const { activeLink } = this.state;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <div className="matchDetail">
              <div className="matchDetailInfo">
                <div className="team">
                  <img src={match._links.homeTeam.crestUrl} alt={match.homeTeamName} className="teamFlag home"/>
                  <span className="teamName">{match.homeTeamName}</span>
                </div>
                <div className="middle">
                  <div>World Cup 2018 Russia</div>
                  <div className="time">{moment(match.date).format("LT")}</div>
                  <div>{moment(match.date).format('L')}</div>
                </div>
                <div className="team">
                  <span className="teamName">{match.awayTeamName}</span>
                  <img src={match._links.awayTeam.crestUrl} alt={match.awayTeamName} className="teamFlag away" />
                </div>
              </div>
              <div className="liveBox">
                <iframe src={activeLink} width="100%" />
              </div>
              <div className="links">
                <div>
                  <p>Lives</p>
                  <ul>
                    {
                      match.linksLive ? match.linksLive.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => this.setState({activeLink: item})}
                          className={item === activeLink ? 'active' : ''}
                        >
                          {item}
                        </li>
                      )) : <li>No data available</li>
                    }
                  </ul>
                </div>
                <div>
                  <p>SoftCast</p>
                  <ul>
                    {match.linksSoftCast ?
                      match.linksSoftCast.map((item, index) => (<li key={index}>{item}</li>)) :
                      (<li>No data available</li>)
                    }
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Detail.propTypes = {

};


export default Detail;
