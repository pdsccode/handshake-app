import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import { loadMyHandshakeList } from '@/reducers/me/action';
import { API_URL } from '@/constants';
// componentimport
import { Grid, Row, Col } from 'react-bootstrap';
import Feed from '@/components/core/presentation/Feed';
import NoData from '@/components/core/presentation/NoData';
import './Me.scss';

class Me extends React.Component {

  componentDidMount() {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }

  getStatusById(id) {
    switch (id) {
      case 2:
        return (<span className="done">Done</span>);
      case 3:
        return (<span className="new">New</span>);
      default:
        return (<span className="pending">Pending</span>);
    }
  }

  render() {
    const { list } = this.props.me;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            {
              list && list.length > 0 ? (
                list.map(handshake => (
                  <div className="my-feed-wrapper" key={handshake.id} onClick={() => alert('show detail')}>
                    <div className="head">
                      <div className="from"><span className="email">From:</span>&nbsp;{handshake.fromEmail}</div>
                      <div className="status">{this.getStatusById(handshake.status)}</div>
                    </div>
                    <Feed className="my-feed">
                      <p className="description">{handshake.description}</p>
                    </Feed>
                  </div>
                ))
              ) : (
                <NoData message="NO DATA AVAILABLE" />
              )
              
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

Me.propTypes = {
  me: PropTypes.object.isRequired,
  loadMyHandshakeList: PropTypes.func.isRequired,
};

const mapState = state => ({
  me: state.me,
});

const mapDispatch = ({
  loadMyHandshakeList,
});

export default connect(mapState, mapDispatch)(Me);
