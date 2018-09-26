import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_projects } from '@/reducers/invest/action';
import './ProjectList.scss';
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';

class ProjectList extends Component {
  componentDidMount() {
    this
      .props
      .fetch_projects();
  }

  render() {
    console.log(this.props.projects);
    return (
      <div
        style={{
        backgroundColor: '#eee',
        minHeight: '100vh',
      }}
      >
        <div className="projectItem">
          <h4>Tesla new project
          </h4>
          <div className="progressBlock">
            <span className="progressCount">30%</span>
            <ProgressBar now={60} className="progressbar" />
            <div className="fundBlock">
              <div className="fund-item">
                <label htmlFor="" className="fund-label">Requested Fund</label>
                <label htmlFor="" className="fund-item-value">200,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-item-value">2,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Investing Period</label>
                <label htmlFor="" className="fund-item-value">6 months</label>
              </div>
            </div>
            <hr />
            <div className="userInfoBlock clearfix">
              <div className="userItem">
                <img src="http://35.198.235.226/img/2.png" alt="" className="userImage" />
                <span className="userName">Alex Becker</span>
              </div>
              <div className="star-ratings">
              stars
              </div>
            </div>
          </div>
        </div>

        <div className="projectItem">
          <h4>Tesla new project
          </h4>
          <div className="progressBlock">
            <span className="progressCount">30%</span>
            <ProgressBar now={60} className="progressbar" />
            <div className="fundBlock">
              <div className="fund-item">
                <label htmlFor="" className="fund-label">Requested Fund</label>
                <label htmlFor="" className="fund-item-value">200,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-item-value">2,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Investing Period</label>
                <label htmlFor="" className="fund-item-value">6 months</label>
              </div>
            </div>
            <hr />
            <div className="userInfoBlock clearfix">
              <div className="userItem">
                <img src="http://35.198.235.226/img/2.png" alt="" className="userImage" />
                <span className="userName">Alex Becker</span>
              </div>
              <div className="star-ratings">
              stars
              </div>
            </div>
          </div>
        </div>

        <div className="projectItem">
          <h4>Tesla new project
          </h4>
          <div className="progressBlock">
            <span className="progressCount">30%</span>
            <ProgressBar now={60} className="progressbar" />
            <div className="fundBlock">
              <div className="fund-item">
                <label htmlFor="" className="fund-label">Requested Fund</label>
                <label htmlFor="" className="fund-item-value">200,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-item-value">2,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Investing Period</label>
                <label htmlFor="" className="fund-item-value">6 months</label>
              </div>
            </div>
            <hr />
            <div className="userInfoBlock clearfix">
              <div className="userItem">
                <img src="http://35.198.235.226/img/2.png" alt="" className="userImage" />
                <span className="userName">Alex Becker</span>
              </div>
              <div className="star-ratings">
              stars
              </div>
            </div>
          </div>
        </div>

        <div className="projectItem">
          <h4>Tesla new project
          </h4>
          <div className="progressBlock">
            <span className="progressCount">30%</span>
            <ProgressBar now={60} className="progressbar" />
            <div className="fundBlock">
              <div className="fund-item">
                <label htmlFor="" className="fund-label">Requested Fund</label>
                <label htmlFor="" className="fund-item-value">200,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-item-value">2,000 ETH</label>
              </div>

              <div className="fund-item">
                <label htmlFor="" className="fund-label">Investing Period</label>
                <label htmlFor="" className="fund-item-value">6 months</label>
              </div>
            </div>
            <hr />
            <div className="userInfoBlock clearfix">
              <div className="userItem">
                <img src="http://35.198.235.226/img/2.png" alt="" className="userImage" />
                <span className="userName">Alex Becker</span>
              </div>
              <div className="star-ratings">
              stars
              </div>
            </div>
          </div>
        </div>

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

export default connect(mapStateToProps, { fetch_projects })(ProjectList);
