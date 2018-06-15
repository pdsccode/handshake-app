import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { find } from 'lodash';
import fixtures from '../../data/liveStreaming/fixtures';
import moment from 'moment';

// components
import { Grid, Row, Col } from 'react-bootstrap';
import ShareSocial from '@/components/core/presentation/ShareSocial';

// self
import './LiveStreamingDetail.scss';
import russiaFlag from '../../assets/images/team-flag/russia-flag-logo.png';
import saudiArabia from '../../assets/images/team-flag/saudi-arabia-flag-logo.png';
const defaultLink = "https://www.youtube.com/embed/V15BYnSr0P8";

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
    const hasList = (list) => Array.isArray(list) && list.length > 0;
    const now = moment();
    const matchTime = moment(match.date);
    const isHideDefaultLink = now.isSameOrAfter(matchTime, 'milliseconds') && !!activeLink;
    console.log("isHideDefau", isHideDefaultLink);
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <div className="matchDetail">
              <div className="matchDetailInfo">
                <div className="team">
                  <span className="teamName">{match.homeTeamName}</span>
                </div>
                <div className="time">{moment(match.date).format("HH:mm")}</div>
                <div className="team">
                  <span className="teamName">{match.awayTeamName}</span>
                </div>
              </div>
              <div className="liveBox">
                <iframe src={isHideDefaultLink ? activeLink : defaultLink} width="100%" allowFullScreen autoPlay="autoPlay" />
              </div>
              <div className="share-block">
                <p className="text">Share to</p>
                <ShareSocial
                  className="share"
                  title={`${match.homeTeamName} vs ${match.awayTeamName}`}
                  shareUrl={window.location.href}
                />
              </div>
              <div className="links">
                <div>
                  <p>Lives</p>
                  <ul>
                    {
                      (hasList(match.linksLive) && isHideDefaultLink) ? match.linksLive.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => this.setState({activeLink: item})}
                          className={item === activeLink ? 'active' : ''}
                        >
                          Link {index + 1}
                        </li>
                      )) : <li className="noData">No data available</li>
                    }
                  </ul>
                </div>
                <div>
                  <p>SopCast</p>
                  <ul>
                    {(hasList(match.linksSoftCast) && isHideDefaultLink) ?
                      match.linksSoftCast.map((item, index) => (<li key={index}><a href={item}>Sopcast {index + 1}</a></li>)) :
                      (<li className="noData">No data available</li>)
                    }
                  </ul>
                </div>
              </div>

              {/* faceboo comment */}
              <div className="fbCommentsBox">
                <div className="fb-comments" data-href={window.location.href} data-numposts="5" />
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
