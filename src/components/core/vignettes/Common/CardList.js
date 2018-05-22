/**
 * Created by thaibao on 4/3/18.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Badge,
} from 'reactstrap';

class CardList extends Component {
  constructor(props) {
    super(props);
    this.renderListCards = this.renderListCards.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  deleteItem(event) {
    let target = event.target;
    this.props.deleteItem(target.getAttribute('data-key'));
  }

  renderListCards() {
    if (this.props.cards !== undefined) {
      return this.props.cards.map((item, key) => (
        <Row className="my-1">
          <Col sm="1">{item.type}</Col>
          <Col sm="1"><code className="text-dark">.... {item.lastDigits}</code></Col>
          <Col sm="7"><code className="text-dark">{item.expiredDate}</code></Col>
          <Col sm="1" className="text-right"><Badge pill color="info">{item.default ? 'DEFAULT' : ''}</Badge></Col>
          <Col sm="2">
            <a href="javascript:void(0);" onClick={this.deleteItem} data-key={item.code}>
              <i className="fa fa-close"/>&nbsp;Delete</a>
            &nbsp; &nbsp;
            <a href="" style={{ display: 'none' }}>
              <i className="fa fa-edit"/>&nbsp; Edit
            </a>
          </Col>
        </Row>
      ));
    } else {
      return (<Row className="my-1">
          No data
        </Row>
      );
    }
  }


  render() {
    return (
      <Row>
        <Col sm="12">
          {this.renderListCards()}
        </Col>
      </Row>
    );
  }
}

CardList.propsType = {
  metadata: PropTypes.object.isRequired,
  deleteItem: PropTypes.function,
};

export default CardList;
