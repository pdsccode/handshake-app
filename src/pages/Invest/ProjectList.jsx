import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetch_projects } from '@/reducers/invest/action'
import './ProjectList.scss'
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap'
import _ from 'lodash';
import Utils from './Utils'


class ProjectList extends Component {
  componentDidMount () {
    this.props.fetch_projects()
  }

  renderProjects () {
    return _.map(this.props.projects, project => {
      let progressPercentage = Math.floor(project.fundingAmount / project.target * 100);
      let displayName = `${project.User.firstName} ${project.User.lastName}`.trim() || "Anonymous"
      let displayLifeTime = Utils.duration(project.lifeTime)
      
      return (
        <div className='projectItem' key={project.id} >
          <h4>
            {project.name}
          </h4>
          <div className='progressBlock'>
            <span className='progressCount'>{progressPercentage}%</span>
            <ProgressBar now={progressPercentage} className='progressbar' />
            <div className='fundBlock'>
              <div className='fund-item'>
                <label htmlFor='' className='fund-label'>Req. Fund</label>
                <label htmlFor='' className='fund-item-value'>
                  {project.target} {project.currency}
                </label>
              </div>

              <div className='fund-item'>
                <label htmlFor='' className='fund-label'>Progress</label>
                <label htmlFor='' className='fund-item-value'>{project.fundingAmount} {project.currency}</label>
              </div>

              <div className='fund-item'>
                <label htmlFor='' className='fund-label'>
                  Inv. Period
                </label>
                <label htmlFor='' className='fund-item-value'>{displayLifeTime}</label>
              </div>
            </div>
            <hr />
            <div className='userInfoBlock clearfix'>
              <div className='userItem'>
                <img
                  src='http://35.198.235.226/img/2.png'
                  alt=''
                  className='userImage'
                />
                <span className='userName'>{displayName}</span>
              </div>
              <div className='star-ratings'>
                stars
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
        {this.renderProjects()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  if (!state.invest) {
    return { projects: [] }
  }
  return { projects: state.invest.projects }
}

export default connect(mapStateToProps, { fetch_projects })(ProjectList)
