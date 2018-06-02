import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// action, mock import { API_URL, HANDSHAKE_STATUS_NAME, HANDSHAKE_ID } from
// '@/constants'; componentimport
import { Grid, Row, Col } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import './Profile.scss';

class Profile extends React.Component {
  render() {
    return (
      <Grid className="profile">
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head">
                <p className="label">Phone Number</p>
                <div className="extend">
                  <Image src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Profile.propTypes = {
  //   me: PropTypes.object.isRequired,   loadMyHandshakeList:
  // PropTypes.func.isRequired,
};

const mapState = state => ({});

const mapDispatch = ({});

export default connect(mapState, mapDispatch)(Profile);
