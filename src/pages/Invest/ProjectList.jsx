import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetch_projects } from '@/reducers/invest/action'

class ProjectList extends Component {
  componentDidMount () {
    this.props.fetch_projects()
  }

  render () {
    console.log(this.props.projects)
    return <div>ProjectList</div>
  }
}

function mapStateToProps (state) {
  if (!state.invest) return { projects: [] }
  return {
    projects: state.invest.projects
  }
}

export default connect(mapStateToProps, { fetch_projects })(ProjectList)
