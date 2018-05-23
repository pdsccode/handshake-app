import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import {connect} from "react-redux";
import CreditCard from './components/CreditCard'

class Exchange extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('loadOffers');
    // this.props.loadOffers();
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <CreditCard/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchange);
