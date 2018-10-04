import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetch_projects } from '@/reducers/invest/action'
import { Grid, Row, Col, ProgressBar, Button } from 'react-bootstrap'
import _ from 'lodash'
import Utils from './Utils'
import './ProjectList.scss'
import createForm from '@/components/core/form/createForm'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'
import InvestNavigation from './InvestNavigation'


const FormInvest = createForm({
  propsReduxForm: {
    form: 'FormInvest'
  }
})

class LinkWallet extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showCode: false
    }
  }

  componentDidMount() {
    this.checkCodeExpireInterval = setInterval(() => this.checkCodeExpire(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.checkCodeExpireInterval);
  }

  checkCodeExpire(){
    if (this.state.showCode && this.state.expire > new Date()){
      this.setState({
        showCode: false,
        verifyCode: null,
        expire: null
      })
    }
  }

  async showVerifyCode () {
    //TODO: show loading icon

    //fetch data
    let verifyCode = await Utils.fetchData("http://")
    this.setState({
      showCode: true,
      verifyCode: verifyCode.verifyCode,
      expire: verifyCode.expire
    })
    //TODO: not show loading

  }

  render () {
    // render show code
    if (this.state.showCode) {
      var body = (
        <div>
          <InputGroup style={{ marginTop: 10 }}>
            <label style={{ width: '100%' }} htmlFor='' className='label'>
              Your secret key
            </label>
            <Input readOnly value={this.state.verifyCode} />
          </InputGroup>
          <InputGroup style={{ marginTop: 15, marginBottom: 10 }}>
            <label htmlFor='' className='label'>
              Your password to encrypt the wallet. Required to decrypt on another device.
            </label>
            <Input placeholder='Enter your password' />
          </InputGroup>
          <Button className='invest-submit-button' size='lg'>Submit</Button>
          {' '}
        </div>
      )
    } else {
      var body = (
        <div>
          <label htmlFor='' className='label'>
              Link this wallet to other device. Before proceeding, make sure you already opened the page that allow to link Ninja wallet. (ex: NinjaFund desktop website)
            </label>
          <Button
            className='invest-submit-button'
            size='lg'
            onClick={() => this.showVerifyCode()}
          >
            Start
          </Button>
          {' '}
        </div>
      )
    }

    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <div className='invest-button-form-block'>
          <FormInvest>
            {body}
          </FormInvest>
        </div>
      </div>
    )
  }
}

export default LinkWallet
