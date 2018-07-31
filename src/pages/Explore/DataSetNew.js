import React from 'react';
import {Grid, Image, Container, Form, Card, Icon, Segment, Item,
  Radio, Button, Label, List,Input, Transition} from 'semantic-ui-react'
import {Route, Redirect} from 'react-router'
import agent from '../../services/agent'
import {Link} from 'react-router-dom'
import closeTop from '@/assets/icons/closeTop.svg';
import addPlus from '@/assets/icons/addplus.svg';
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {Dataset} from '@/services/Wallets/Tokens/Dataset';

class DataSetNew extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      images: [],
      values: [],
      datasetName: '',
      datasettype:'buyer',
      description:'',
      Quantity:"",
      Amount:"",
      classifiy:'',
      messageForm:'',
      isLoading:false
    };
    this.dataset = new Dataset();
    this.dataset.createFromWallet(MasterWallet.getWalletDefault('ETH'));
  }

  componentDidMount() {

  }

  createUI() {
    return this.state.values.map((el, i) =>
      <div className="two fields" key={i}>
        <div className="field">
          <input className='ui input' placeholder='Classify' type="text" value={el || ''}
                 onChange={this.handleChange.bind(this, i)}/>
        </div>
        <div className="field">
          <input className='icon' type='button' value='Remove' onClick={this.removeClick.bind(this, i)}/>
        </div>
      </div>
    )
  }

  createUI2() {
    return this.state.values.map((el, i) =>
          <Label as='a' basic color='teal'>  {el || ''} <Icon name='delete' onClick={this.removeClick.bind(this, i)} /> </Label>
    )
  }

  removeClick(i) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({values});
  }

  handleChangeInput = (e, {name, value}) => this.setState({[name]: value})

  handleChange(i, event) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({values});

    if (values[i].length == 1 && i == this.state.values.length - 1) {
      this.setState(prevState => ({values: [...prevState.values, '']}))
    }
  }

  handleChangeClass(){
    //this.state.classifiy
    //this.setState(prevState => ({values: [...prevState.values, '']}))
    let values = [...this.state.values];
    let clas = this.state.classifiy.trim();
    if(clas ==""){
      return;
    }
    //fruits.indexOf("Apple");
    if( values.indexOf(clas) >=0){
      return;
    }
    this.setState({
      values: [ ...values, clas ],
      classifiy:'',
    });

  }

  handleSubmit(event) {
    let self = this;
    event.preventDefault();
    //name
    // desc
    // request_goal
    // request_eth_amount
    // created_by_id

    let name = this.state.datasetName;
    if(name.trim()==""){
      this.setState({messageForm:" Name is required"})
      return;
    }
    let desc = this.state.description;
    if(desc.trim()==""){
      this.setState({messageForm:" Description is required"})
      return;
    }
    let created_by_id = this.props.auth.dataset_profile.id;

    if(this.state.values.length==0){
      this.setState({messageForm:" Label classification list must contain at least 1 class"})
      return;
    }

    let datafrom={name, desc, created_by_id }

    if(this.state.datasettype ==="buyer"){

        let request_goal = this.state.Quantity;
        if(request_goal.trim()=="" ||  parseFloat(request_goal) < 0){
          this.setState({messageForm:" Request quantity is invalid"})
          return;
        }
        let request_eth_amount = this.state.Amount;
        if(request_eth_amount.trim()=="" || parseFloat(request_eth_amount) < 0){
          this.setState({messageForm:" ETH amount is invalid"})
          return;
        }
        datafrom={name, desc, created_by_id, request_goal ,request_eth_amount }
    }
    this.setState({isLoading: true, messageForm:"", submitting: true});

    agent.req.post(agent.API_ROOT + '/api/category/',datafrom ).set('authorization', `JWT ${this.props.token}`).type('form').then(async (response) => {
      let resBody = response.body;

      const receipt = await this.dataset.getTransactionReceipt(resBody.tx);
      if (!receipt.status) {
        this.setState({isLoading: false, messageForm: 'Something\'s wrong. Please try again later.'});
        return;
      }

      let requestTx;
      if (this.state.datasettype ==="buyer"){
        requestTx = this.dataset.request(resBody.id, this.state.Amount);
      }

      let category = resBody.id;
      for (let i = 0; i < self.state.values.length; i++) {
        let name = self.state.values[i];
        if (!!name) {
          agent.req.post(agent.API_ROOT + '/api/classify/', {
            category,
            name
          }).set('authorization', `JWT ${this.props.token}`).type('form').then((response) => {
            let resBody = response.body;
          }).catch((e) => {
          })
        }
      }

      if (requestTx) {
        const tx = await requestTx;
        const data = {
          category: resBody.id,
          tx: tx.transactionHash
        };
        agent.req.post(agent.API_ROOT + '/api/buy/', data).set('authorization', `JWT ${this.props.token}`).type('form')
          .then((response) => {
            console.log('buy resp', response);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.setState({isLoading: false, datasetName:'', description:'',values:[], Quantity:'',Amount:'',messageForm:"Create dataset successfully." })
    }).catch((e) => {
      console.log("creating dataset failed", e);
      let message = '';
      if (e.message.indexOf('insufficient funds') > -1 || e.message.indexOf('insufficient coin') > -1) {
        message = 'You have insufficient coin to make the transfer. Please top up and try again.';
      } else {
        message = 'Something\'s wrong. Please try again later.';
      }
      this.setState({isLoading: false, messageForm: message});
    })
  }

  render() {
    let self = this;
    return (
      // <Segment loading={this.state.isLoading} vertical style={{marginTop:'-5em',background:'white',zIndex:'55555'}}>
      //  <h2 className="my-h2-dataset-new">
      <Segment vertical  loading={this.state.isLoading}  id="segment-detail">
          <h2 className="my-h2-dataset-new" >
          Create new Dataset
          <Link to={'/explore'}><Image src={closeTop} className="btn-Close-Top"/></Link>
       </h2>
        <Container>
          <Form onSubmit={()=>console.log("D")}>
            <Form.Group widths='equal'>
              <Form.Input label ="Dataset name" fluid placeholder='Dataset name' name='datasetName' value={this.state.datasetName}
                          onChange={this.handleChangeInput}/>

              <Form.Input label ="Description" fluid placeholder='Description' name='description' value={this.state.description}
                          onChange={this.handleChangeInput}/>

              <Form.Input label ="Multi-label classification" fluid placeholder='Classification'
                          name='classifiy' value={this.state.classifiy}
                          onChange={this.handleChangeInput}
                          />
                <Image src={addPlus} className="btn-add-class" onClick={()=>this.handleChangeClass()} />

            </Form.Group>
            <Form.Group >
                {this.createUI2()}
            </Form.Group>

            <Form.Group inline style={{marginTop:'10px'}}>
              <label>You're a ? </label>
              <Form.Radio
                label='Buyer'
                value='buyer'
                name="datasettype"
                checked={this.state.datasettype === 'buyer'}
                onChange={this.handleChangeInput}
              />
              <Form.Radio
                name="datasettype"
                label='Provider'
                value='provider'
                checked={this.state.datasettype === 'provider'}
                onChange={this.handleChangeInput}
              />
              </Form.Group>
              <div style={{display: this.state.datasettype==="buyer" ? "block":"none"}}>

              <Form.Input
               label ="Request quantity"
               type='number' pattern="[0-9]*"
               fluid placeholder='00' name='Quantity' value={this.state.Quantity}
                          onChange={this.handleChangeInput}/>

              <Form.Input
              label ="Amount"
              type='number' pattern="[0-9.]*"
              fluid placeholder='1 ETH' name='Amount' value={this.state.Amount}
                          onChange={this.handleChangeInput}/>
              </div>

            <Form.Field style={{ marginTop: '10px', textAlign:'left', color:'red'}}>
                <label  style={{color:'red'}} >{this.state.messageForm} </label>
            </Form.Field>

            <Form.Button fluid primary content='Submit' size='large'
                style={{background:'#21c364',marginTop:'30px'}} onClick={this.handleSubmit} />
          </Form>
        </Container>
      </Segment>
    )
  }
}

export default DataSetNew;
