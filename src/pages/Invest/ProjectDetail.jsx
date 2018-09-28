import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_projects } from '@/reducers/invest/action';
import { Grid, Row, Col, ProgressBar ,Button } from 'react-bootstrap';
import _ from 'lodash';
import Utils from './Utils';
import StarRatings from 'react-star-ratings';
import './ProjectList.scss';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import createForm from '@/components/core/form/createForm';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import InvestNavigation from './InvestNavigation';

// Refer to FeedCreditCard.jsx

export const CRYPTO_ICONS = {
  ETH: iconEthereum,
  BTC: iconBitcoin,
  USDT: iconUsd,
};


const CRYPTO_CURRENCY_INVEST = {
  USDT: 'USDT',
  BTC: 'BTC',
  ETH: 'ETH',
};
const CRYPTO_CURRENCY_NAME = [
  'USDT',
  'BTC',
  'ETH',
];

const FormInvest = createForm({
  propsReduxForm: {
    form: 'FormInvest',
  },
});

class ProjectDetail extends Component {
  componentDidMount() {
    this.props.fetch_projects();
  }
  renderProjects() {
    const project= this.props.projects[0];
      return (
        <div key={project.id} style={{ marginTop: '1em' }} >
          <div className="projectItem">
            <h5>
              {project.name}
            </h5>
            <div className="progressBlock">
              <span className="progressCount">{project.progressPercentage}%</span>
              <ProgressBar now={project.progressPercentage} className="progressbar" />

              <div className="userInfoBlock clearfix userInfoBlockProjectDetails">
                <div className="userItem">
                <img
                  src="https://randomuser.me/api/portraits/men/9.jpg"
                  alt=""
                  className="userImage"
                />
                <span className="userName">{project.displayName}</span>
                <div className="star-ratings">
                  <StarRatings
                    className="stars"
                    rating={3}
                    isSelectable={false}
                    starDimension="12px"
                    starRatedColor="#546FF7"
                    starSpacing="3px"
                    numberOfStars={5}
                    name="rating"
                  />
                  <span className="rating-count">(26)</span>
                </div>
              </div>
              </div>
              <div className="fundBlock clearfix">
                <div className="fund-item float-left">
                <label htmlFor="" className="fund-label">Req. Fund</label>
                <label htmlFor="" className="fund-label">Inv. Period</label>
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-label">Deadline</label>
                <label htmlFor="" className="fund-label">Target Earning</label>
                <label htmlFor="" className="fund-label">Number of investor</label>
              </div>


                <div className="fund-item float-right">
                <label htmlFor="" className="fund-item-value">{project.displayLifeTime}</label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
              </div>
              </div>
            </div>
          </div>
          <div className="invest-button-form-block">
            <FormInvest>
              <label htmlFor="amountfield" className="fund-label">Amount to invest</label>
              <InputGroup className="inputGroupInvestButton">
                <Input placeholder="Enter Quantity" type="number" className="inputGroupInvestField" />
                <InputGroupAddon addonType="append"className="inputGroupInvestIcon"><img src={CRYPTO_ICONS[CRYPTO_CURRENCY_NAME[0]]} width={24} alt="icon" /></InputGroupAddon>
              </InputGroup>
              <Button className="invest-submit-button" size="lg">Invest now</Button>{' '}
            </FormInvest>
          </div>
        </div>
    );
  }

  render() {
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <InvestNavigation header="Project" history={this.props.history} />
        {this.props.projects && this.props.projects.length > 0 && this.renderProjects()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (!state.invest) {
    return { projects: [] };
  }
  return { projects: state.invest.projects };
}

export default connect(mapStateToProps, { fetch_projects })(ProjectDetail);
