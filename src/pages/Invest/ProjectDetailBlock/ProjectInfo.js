import React from 'react';
import { getSMProjectInfo } from '../../../reducers/invest/action';
import LoadingSVG from '../loading.svg';

class ProjectInfo extends React.Component {
    constructor(props) {
      super(props);
      this.props.getSMProjectInfo(props.project.id).catch(err => console.log('err', err))
    }
    render() {
      const { project, smProject } = this.props;
      const progressPrev = (Number(project.fundingAmount || 0)/Number(project.target|| 1) * 100).toFixed(2);
      const progress = smProject ? (Number(smProject.fundingAmount || 0)/Number(smProject.target|| 1) * 100).toFixed(2) : progressPrev;
      const numFunder = smProject ? smProject.numFunder : (<img src={LoadingSVG} style={{ width: '50px', height: '50px' }} />);
      return (
        <div className="fund-item float-right">
          <label htmlFor="" className="fund-item-value">{project.displayLifeTime}</label>
          <label htmlFor="" className="fund-item-value">
            {project.target} {project.currency}
          </label>
          <label htmlFor="" className="fund-item-value">
            {project.lifeTime} {'days'}
          </label>
          <label htmlFor="" className="fund-item-value">
            {progress} % 
          </label>
          <label htmlFor="" className="fund-item-value">
            {new Date(project.deadline).toDateString()}
          </label>
          <label htmlFor="" className="fund-item-value">
            {numFunder}
          </label>
        </div>
      )
    }
  }
  const projectMapState = (state) => ({
    smProject: state.invest && state.invest.smProject ? state.invest.smProject : null
  })
  export default connect(projectMapState, { getSMProjectInfo })(ProjectInfo)
  