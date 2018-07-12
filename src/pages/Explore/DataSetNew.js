import React from 'react';
import {Grid, Image, Container, Form, Card, Icon, Segment, Item, 
  Radio, Button, Label, List,Input, Transition} from 'semantic-ui-react'
import {Route, Redirect} from 'react-router'
import agent from '../../services/agent'

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
      isLoading:false,
    };
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
    // alert('A name was submitted: ' + this.state.values.join(', '));
    console.log(this.state);
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
      this.setState({messageForm:" classification list must contain at least 1 class"})
      return;
    }
    
    let datafrom={name, desc, created_by_id }

    if(this.state.datasettype ==="buyer"){ 

        let request_goal = this.state.Quantity;
        if(request_goal.trim()==""){
          this.setState({messageForm:" Request Quantity is required"})
          return;
        } 
        let request_eth_amount = this.state.Amount;
        if(request_eth_amount.trim()==""){
          this.setState({messageForm:" ETH amount is required"})
          return;
        } 
        datafrom={name, desc, created_by_id, request_goal ,request_eth_amount }
    }   
    this.setState({isLoading: true, messageForm:""})

    agent.req.post(agent.API_ROOT + '/api/category/',datafrom ).set('authorization', `JWT ${this.props.token}`).type('form').then((response) => {
      let resBody = response.body;
      console.log(resBody);
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
      this.setState({isLoading: false, datasetName:'', description:'',values:[], Quantity:'',Amount:'',messageForm:"Create dataset successfull." })
    }).catch((e) => {
      this.setState({isLoading: false})
    })
  }

  render() {
    let self = this;
    return (
      <Segment loading={this.state.isLoading} vertical style={{marginTop:'-5em',background:'white',zIndex:'55555'}}>
       <h2 className="my-h2-dataset-new">Create new Dataset</h2>
        <Container>
          <Form onSubmit={()=>console.log("D")}>
            <Form.Group widths='equal'>
              <Form.Input required fluid placeholder='Dataset name' name='datasetName' value={this.state.datasetName}
                          onChange={this.handleChangeInput}/>

              <Form.Input required fluid placeholder='Description' name='description' value={this.state.description}
                          onChange={this.handleChangeInput}/>
              
              <Form.Input fluid placeholder='Classification' 
                          name='classifiy' value={this.state.classifiy}
                          onChange={this.handleChangeInput}
                          />    
              <Button icon className="my-icon-add">
                <Icon name='add circle ' style={{color:'#21c364'}} onClick={()=>this.handleChangeClass()} />
              </Button> 

            </Form.Group>
            <Form.Group >
                {this.createUI2()}
            </Form.Group>

            <Form.Group inline>
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
               type='number' pattern="[0-9]*"
               fluid placeholder='Request quantity' name='Quantity' value={this.state.Quantity}
                          onChange={this.handleChangeInput}/> 

              <Form.Input  type='number' pattern="[0-9.]*"
              fluid placeholder='I will pay for (ETH)' name='Amount' value={this.state.Amount}
                          onChange={this.handleChangeInput}/>
              </div>

            <Form.Field style={{ marginTop: '10px', textAlign:'left', color:'red'}}>
                <label  style={{color:'red'}} >{this.state.messageForm} </label>
            </Form.Field>

            <Form.Button fluid primary content='Submit' size='large' 
                style={{background:'#21c364',marginTop:'1em'}} onClick={this.handleSubmit} />
          </Form>
        </Container>
      </Segment>
    )
  }
}

export default DataSetNew; 
