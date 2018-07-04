import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { loadMatches } from '@/reducers/betting/action';
import { BASE_API, API_URL } from '@/constants';
import md5 from 'md5';
import { Alert } from 'reactstrap';
import $http from '@/services/api';
import './Admin.scss';
import { showAlert } from '@/reducers/app/action';

let token = null;
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedMatch: 1,
      selectedOutcome: 1,
      selectedResult: 0,
      matches: [],
      outcomes: [],
      activeMatchData: {},
      login: false,
      disable: false,
      final: [],
      errorMessage: '',
    };
    this.toggle = this.toggle.bind(this);
    // side: 0 (unknown), 1 (support), 2 (against)
  }

  componentDidMount() {
    if (this.checkToken() != null) {
      this.setState({
        login: true,
      });
    }
    this.fetchMatches();
  }

  setInitials(matches) {
    matches.length > 0 && this.setState({
      matches,
      outcomes: matches[0].outcomes,
      activeMatchData: matches[0],
      selectedMatch: matches[0].name,
    });
  }

  fetchMatches() {
    this.props.loadMatches({
      PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES}?report=1`,
      successFn: (res) => {
        const { data } = res;
        this.setInitials(data);
        console.log('loadMatches success', data);
      },
      errorFn: (e) => {
        console.log('loadMatches failed', e);
      },
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  fillOutcome() {
    const updatedMatch = this.state.matches.filter((item) => {
      if (item.id === this.state.selectedMatch) {
        return item;
      }
    });
    if (updatedMatch[0].outcomes && updatedMatch[0].outcomes.length > 0) {
      const final = [];
      updatedMatch[0].outcomes.map((item) => {
        const obj = {
          outcome_id: item.id,
          side: 0,
        };
        final.push(obj);
        return final;
      });
      this.setState({
        outcomes: updatedMatch[0].outcomes,
        activeMatchData: updatedMatch[0],
        selectedOutcome: updatedMatch[0].outcomes[0].id,
        final,
      });
    } else {
      this.setState({
        outcomes: [],
      });
    }
  }

  onChangeEvent=(event, type) => {
    this.setState({ [type]: Number(event.target.value.split(':')[1]) }, this.fillOutcome);
    this.setState({ errorMessage: '' });
  }
  onChangeOutcome=(event, type) => {
    this.setState({
      selectedOutcome: Number(event.target.value.split(',id:')[1]),
    });
  }
  onChangeResult=(event, type) => {
    this.setState({
      [type]: Number(event.target.value),
    });
  }

  onChangeScore=(event, type) => {
    const activeMatchData = this.state.activeMatchData;
    activeMatchData[type] = event.target.value;
    this.setState({
      activeMatchData,
    });
  }

  loginUser=(event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const email = data.get('email');
    const password = data.get('password');

    const auth = $http({
      url: `${BASE_API.BASE_URL}/cryptosign/auth`,
      data: {
        email,
        password,
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    });
    auth.then((response) => {
      if (response.data.status === 1) {
        token = response.data.data.access_token;
        localStorage.setItem('Token', token);
        localStorage.setItem('TokenInit', new Date());
        this.setState({
          login: true,
        });
      }
    });
  }

  disablePage() {
    localStorage.setItem('disable', true);
    setTimeout(() => {
      localStorage.setItem('disable', false);
      this.fetchMatches();
      this.setState({
        disable: false,
      });
    }, 1000);
  }

  checkToken() {
    if (localStorage.getItem('Token') !== null) {
      return localStorage.getItem('Token');
    }
    return null;
  }
  onSubmit= (event) => {
    const radios = [];
    if (localStorage.getItem('disable') === false) {
      return null;
    }
    if (this.state.outcomes && this.state.outcomes.length === 0) {
      return null;
    }
    if (document.getElementsByTagName('form')) {
      const inputs = document.getElementsByTagName('form')[0].elements;
      // Loop and find only the Radios
      for (let i = 0; i < inputs.length; ++i) {
        if (inputs[i].type == 'radio') {
          radios.push(inputs[i]);
        }
      }
    }
    const valid = radios.length > 0 && radios.map((item) => {
      if (item.checked) {
        return true;
      }
      return false;
    });
    const trueValues = valid.filter(item => item == true);
    if (trueValues.length < radios.length / 3) {
      this.props.showAlert({
        message: <div className="text-center">Please select atleast 1 option in each row.</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {},
      });
    } else {
      const tokenValue = token || this.checkToken();
      const url = `${BASE_API.BASE_URL}/cryptosign/match/report/${this.state.activeMatchData.id}`;
      const submit = $http({
        url,
        data: {
          result: this.state.final,
        },
        headers: { Authorization: `Bearer ${tokenValue}`, 'Content-Type': 'application/json' },
        method: 'post',
      });
      submit.then((response) => {
        response.data.status === 1 && this.setState({
          disable: true,
        }, this.disablePage);
        response.data.status === 1 && this.props.showAlert({
          message: <div className="text-center">Success!</div>,
          timeOut: 3000,
          type: 'success',
          callBack: () => {},
        });
        response.data.status === 0 && this.props.showAlert({
          message: <div className="text-center">{response.data.message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {},
        });
      });
    }
  }
  onChangeFinal=(item, result) => {
    console.log(item, result);
    const finalCopy = [...this.state.final];
    finalCopy.map((outcomeItem) => {
      if (outcomeItem.outcome_id === item.id) {
        outcomeItem.side = result;
      }
      return outcomeItem;
    });
    this.setState({
      final: finalCopy,
    });
  }

  render() {
    return (!this.state.login ?
      <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }} onSubmit={this.loginUser}>
        <FormGroup>
          <Label for="login">Login</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            required
          />
          <br />
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
          />
          <br />
          <Button type="submit">Submit</Button>
          <br />
        </FormGroup>
      </Form>
      :
      <div className="form-admin">
        <Form style={{ margin: '1em', WebkitAppearance: 'menulist' }}>
          <FormGroup disabled={this.state.disable}>
            <Label for="matchSelect">Select Match</Label>
            <Input type="select" name="select" id="matchSelect" onChange={(event) => { this.onChangeEvent(event, 'selectedMatch'); }} disabled={this.state.disable}>
              {this.state.matches && this.state.matches.length > 0 && this.state.matches.map(item => <option key={item.id}>{item.name} id:{item.id}</option>)}
            </Input>
          </FormGroup>
          <Label for="outcomeSelect">Outcomes</Label><br />
          {/* <FormGroup id="outcomeSelect" onChange={(event) => { this.onChangeOutcome(event, 'selectedOutcome'); }} disabled={this.state.disable}> */}
          {this.state.outcomes && this.state.outcomes.length > 0 && this.state.outcomes.map(item => (<Label check key={item.id} style={{}}>{`${item.name},id:${item.id}`}<br />
            {/* side: 0 (unknown), 1 (support), 2 (against) */}
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, 0); }} required value="0" />{' '}
              Unknown
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, 1); }} value="1" />{' '}
              Support
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name={`selectedOption-${item.id}`} onChange={() => { this.onChangeFinal(item, 2); }} value="2" />{' '}
              Against
              </Label>
            </FormGroup><br /><br />
                                                                                                     </Label>))}
          <br /> <br />
          {/* <FormGroup>
            <Label for="homescore">Home Score</Label>
            <Input
              type="number"
              name="homeScore"
              id="homescore"
              placeholder="Home Score"
              value={this.state.activeMatchData.homeScore || ''}
              onChange={(event) => { this.onChangeScore(event, 'homeScore'); }}
              disabled={this.state.disable}
            />
          </FormGroup>
          <FormGroup>
            <Label for="awayscore">Away Score</Label>
            <Input
              type="number"
              name="awayScore"
              id="awayscore"
              placeholder="Away Score"
              value={this.state.activeMatchData.awayScore || ''}
              disabled={this.state.disable}
              onChange={(event) => { this.onChangeScore(event, 'awayScore'); }}
            />
          </FormGroup> */}
          <Button disabled={this.state.disable} onClick={this.onSubmit}>Submit</Button>

        </Form>
        {
          this.state.disable &&
          <div><br />
            <Alert color="success">
            Match details submitted. Please wait.
            </Alert>
          </div>
      }
      </div>
    );
  }
}

const mapState = state => ({
  matches: state.betting.matches,
});

const mapDispatch = ({
  loadMatches,
  showAlert,
});

export default connect(mapState, mapDispatch)(Admin);
