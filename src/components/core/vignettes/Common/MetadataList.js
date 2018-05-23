/**
 * Created by thaibao on 4/3/18.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
} from 'reactstrap';

class MetadataList extends Component {
  constructor(props) {
    super(props);
    this.renderListMetadata = this.renderListMetadata.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  deleteItem(event) {
    let target = event.target;
    this.props.deleteItem(target.getAttribute('data-key'));
  }

  renderListMetadata() {
    if (this.props.metadata !== undefined) {
      let temp = [];
      let index = 1;
      for (let key in this.props.metadata) {
        if (this.props.metadata.hasOwnProperty(key)) {
          let value = this.props.metadata[key];
          temp.push(
            <Row className="my-1" key={index}>
              <Col sm="3">{key}</Col>
              <Col sm="7">{value}</Col>
              <Col sm="2"><a onClick={this.deleteItem} href="javascript:void(0);" data-key={key}><i
                className="fa fa-close"/>&nbsp; Delete</a></Col>
            </Row>
          );
          index++;
        }
      }
      return temp;
    } else {
      <Row className="my-1">
        No data
      </Row>;
    }
  }


  render() {
    return (
      <Row>
        <Col sm="12">
          {this.renderListMetadata()}
        </Col>
      </Row>
    );
  }
}

MetadataList.propsType = {
  metadata: PropTypes.object.isRequired,
  deleteItem: PropTypes.function,
};

export default MetadataList;
