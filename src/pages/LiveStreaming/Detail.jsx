import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants

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
    const { params } = this.props.match;
    const match = data[params.slug]
    this.state = {
      activeLink: match.link,
    };
  }

  render() {
    const { params } = this.props.match;
    const match = data[params.slug];
    const { activeLink } = this.state;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <div className="matchDetail">
              <div className="matchDetailInfo">
                <div className="team">
                  <img src={match.teamHomeFlag} alt={match.teamHomeName} className="teamFlag home"/>
                  <span className="teamName">{match.teamHomeName}</span>
                </div>
                <div className="middle">
                  <div>{match.league}</div>
                  <div className="time">{match.time}</div>
                  <div>{match.date}</div>
                </div>
                <div className="team">
                  <span className="teamName">{match.teamAwayName}</span>
                  <img src={match.teamAwayFlag} alt={match.teamAwayName} className="teamFlag away" />
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
                      match.linksLive.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => this.setState({activeLink: item})}
                          className={item === activeLink ? 'active' : ''}
                        >
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div>
                  <p>SoftCast</p>
                  <ul>
                    {match.linksLive.map((item, index) => (<li key={index}>{item}</li>))}
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
