/**
 * Created by thaibao on 4/3/18.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

class PaginationCustom extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      total: 1,
    };

    this.renderPage = this.renderPage.bind(this);
    this.choosePage = this.choosePage.bind(this);
  }

  componentDidMount() {
    this.setState({
      currentPage: this.props.page,
    });
  }

  async choosePage(event) {
    let pageTxt = event.target.text;
    let page = this.state.currentPage;
    if (pageTxt === 'Prev') {
      page = page - 1;
    } else if (pageTxt === 'Next') {
      page = page + 1;
    } else {
      page = parseInt(pageTxt);
    }
    this.props.callBack(page);
    await this.setState({
      currentPage: page,
    });
  }

  renderPage() {
    let count = Math.ceil(this.props.total / this.props.pageSize);
    let result = [];
    result.push(
      <PaginationItem active key={this.state.currentPage}>
        <PaginationLink onClick={this.choosePage}>{this.state.currentPage}</PaginationLink>
      </PaginationItem>
    );
    for (let i = this.state.currentPage + 1; i <= count && i < this.state.currentPage + 3; i++) {
      result.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={this.choosePage}>{i}</PaginationLink>
        </PaginationItem>
      );
    }
    if (this.state.currentPage <= count - 3) {
      result.push(
        <PaginationItem key="...">
          <PaginationLink>...</PaginationLink>
        </PaginationItem>
      );
    }
    if (this.state.currentPage < count) {
      result.push(
        <PaginationItem key="next">
          <PaginationLink onClick={this.choosePage}>Next</PaginationLink>
        </PaginationItem>
      );
    }
    for (let i = this.state.currentPage - 1; i >= 1 && i > this.state.currentPage - 3; i--) {
      result.unshift(
        <PaginationItem key={i}>
          <PaginationLink onClick={this.choosePage}>{i}</PaginationLink>
        </PaginationItem>
      );
    }
    if (this.state.currentPage > 3) {
      result.unshift(
        <PaginationItem key="...">
          <PaginationLink>...</PaginationLink>
        </PaginationItem>
      );
    }
    if (this.state.currentPage > 1) {
      result.unshift(
        <PaginationItem key="prev">
          <PaginationLink onClick={this.choosePage}>Prev</PaginationLink>
        </PaginationItem>
      );
    }
    return result;
  }

  render() {
    return (
      <div>
        <h6>{this.props.total} results</h6>
        <Pagination>
          {this.renderPage()}
        </Pagination>
      </div>
    );
  }
}

PaginationCustom.propsType = {
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  callBack: PropTypes.function,
}

export default PaginationCustom;
