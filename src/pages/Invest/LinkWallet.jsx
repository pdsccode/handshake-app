import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_projects } from '@/reducers/invest/action';
import { Grid, Row, Col, ProgressBar, Button } from 'react-bootstrap';
import _ from 'lodash';
import Utils from './Utils';
import './ProjectList.scss';
import createForm from '@/components/core/form/createForm';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import InvestNavigation from './InvestNavigation';


const FormInvest = createForm({
  propsReduxForm: {
    form: 'FormInvest',
  },
});

class LinkWallet extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <div className="invest-button-form-block">
          <FormInvest>
            <label htmlFor="" className="label">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, vero.</label>
            <InputGroup style={{ marginTop: 10 }}>
              <Input placeholder="Enter 8 character code" />
            </InputGroup>
            <InputGroup style={{ marginTop: 15, marginBottom: 10 }}>
              <Input placeholder="Enter Wallet Address" />
            </InputGroup>
            <Button className="invest-submit-button" size="lg">Submit</Button>{' '}
          </FormInvest>
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

export default connect(mapStateToProps, { fetch_projects })(LinkWallet);
