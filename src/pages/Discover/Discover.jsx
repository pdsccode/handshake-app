import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { URL } from '@/config';
import { load } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Button from '@/components/core/controls/Button';
import Error from '@/components/core/presentation/Error';
import Feed from '@/components/core/presentation/Feed';
import Modal from '@/components/core/controls/Modal';
import { handShakeList } from '@/data/shake.js';
import BetFeed from '@/components/Betting/BetFeed';
// style
import './Discover.scss';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  get feedHtml() {
    console.log(handShakeList.data);
    return handShakeList.data.map(handShake => (
      <Col md={12} xs={12} key={handShake.id} className="feedWrapper">
        <Feed className="feed">
          {handShake.industries_type === 18 ?  <BetFeed item={handShake}/>: 
            <div>
            <p className="description">{handShake.description}</p>
            <p className="email">{handShake.from_email}</p>
          </div>}
          {/*<p className="description">{handShake.description}</p>
        <p className="email">{handShake.from_email}</p>*/}
        </Feed>
        <Button block>Shake now</Button>
      </Col>
    ));
  }

  render() {
    return (
      <Grid>
        <Row>
          {this.feedHtml}
        </Row>
      </Grid>
    );
  }
}

Dashboard.propTypes = {
  discover: PropTypes.object,
  load: PropTypes.func
};

const mapState = (state) => ({
  discover: state.discover,
});

const mapDispatch = ({
  load
});



// export default Dashboard;
// export default connect(null, ({ load }))(Dashboard);
export default connect(mapState, mapDispatch)(Dashboard);
