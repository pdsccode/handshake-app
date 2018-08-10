import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadDatasetHistory } from '@/reducers/history/action';
import { injectIntl } from 'react-intl';
import local from '@/services/localStore';
import { Label } from 'semantic-ui-react';
import {Link} from 'react-router-dom'
import './History.scss';
import { BASE_API } from '@/constants';
import {Grid, Image, Container, Card, Header,  Form,Divider, Segment, Dropdown, Visibility, Modal, List, Button, Icon, Confirm} from 'semantic-ui-react'
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {Dataset} from '@/services/Wallets/Tokens/Dataset';

import closeTop from '@/assets/icons/closeTop.svg';
import albumSVG from '@/assets/icons/album.svg';
const TAG = 'History';

class History extends React.Component {
  static propTypes = {
    // app: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    // me: PropTypes.object.isRequired,
    // history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    console.log(TAG, '- contructor - init');
    this.state = {
      auth: props.auth || {},
      isLoading: false,
      isLoadingbtn:false,
      datasets: [],
      balance: 0,
      open:false,
    };
    this.dataset = new Dataset();
    this.dataset.createFromWallet(MasterWallet.getWalletDefault('ETH'));
    this.withdraw = this.withdraw.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  show = () => () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  getDataSetProfile = () => this.state.auth?.dataset_profile || {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  componentDidMount() {
    this.fetchData();
    this.getBalance();
  }

  async getBalance() {
    try {
      const balance = await this.dataset.getDatasetBalance();
      this.setState({balance});
    } catch (e) {
      console.log('cannot get balance', e);
    }
  }

  async withdraw() {

    //Thanks! ... Minimum Ethereum withdrawal amount is 0.1006 ETH
    if(this.state.balance < 0.005){
      this.setState({ open: true })
      return;
    }
    this.setState({isLoading: true,isLoadingbtn:true});
    try {
      await this.dataset.withdraw();
      this.setState({isLoading: false,isLoadingbtn:false});
    } catch (e) {
      console.log('cannot withdraw', e);
      this.setState({isLoading: false,isLoadingbtn:false});
    }
  }

  fetchData = () => {
    const dataset_profile = this.getDataSetProfile();
    const userId = dataset_profile?.id || -1;
    console.log(TAG, ' fetchData - - begin - ', dataset_profile);
    if (userId > 0) {
      this.props.loadDatasetHistory({
        BASE_URL: BASE_API.BASE_DATASET_API_URL,
        PATH_URL: `profile/${userId}/`,
        METHOD: 'GET',
        headers: { Authorization: `JWT ${dataset_profile?.token}` },
        successFn: (res) => {
          console.log(TAG, ' fetchData - - success - ', res);
          this.setState({datasets:res.categories});
        },
        errorFn: (e) => {
          console.log(TAG, ' fetchData - error - ', e);
        },
      });
    }
  };
  render() {
     
    return (
      <Visibility once={true}>  
       <Segment vertical  id="segment-detail"> 
              <h2 className="my-h2-dataset-new" style={{marginBottom:'0px'}}>
              My Earnings
        </h2> 
         
              <Card.Group centered >  
                <Card className="my-card"  style={{ marginBottom: '1em', marginTop:'-10px'}}> 
                  <Grid container columns={2}>
                    <Grid.Column width={3}>
                      <img src={albumSVG} />
                    </Grid.Column>
                    <Grid.Column width={9}>
                    <div style={{  textAlign:'left'  }}>
                                <h4 style={{ margin:'5px 0px', color:'black'}}>Total earnings</h4>
                                <p><span style={{fontWeight:'700' }}>{ (Math.round(this.state.balance * 10000) /10000 ) } ETH</span></p> 
                            </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                    <Button size="mini" color='green'  loading={this.state.isLoadingbtn}  content='Withdraw' style={{ marginTop:'16px',marginLeft:'4px',width: 'auto', height: 'auto' }} onClick={this.withdraw}  ></Button>
                    </Grid.Column>
                  </Grid>
                  <hr className="history-hr"/>  
                </Card> 
                {this.state.datasets.map((item, i) => {
                  return (
                    <Card key={i} className="my-card"  style={{ marginBottom: '1.8em',marginTop:'12px'}}>
                          <Grid container columns={2}>
                              <Grid.Column width={3}>
                                  <img src={albumSVG} />
                              </Grid.Column>
                              <Grid.Column width={13}>
                                  <div style={{textAlign:'left'   }}>
                                      <h4 className="history-h3">{item.name}</h4> 
                                      <p className="history-p3" >{"Earned " + item.balance +" DADK"} </p> 
                                  </div>
                              </Grid.Column>
                        </Grid>  
                    </Card>

                  )
                })}
              </Card.Group> 
      </Segment> 
      <Segment vertical loading={this.state.isLoading}>
          <Confirm
            content={
              <div class='content'>  
                <p style={{lineHeight:'1.6em'}}>To save on gas, please withdraw at least 0.005 ETH.</p>
              </div>
            }
            open={this.state.open} 
            onConfirm={this.close}
            confirmButton={<Button positive loading={this.state.isLoading} style={{padding: '10px 32px',width: 'auto', height: 'auto' }}>OK</Button>}
            cancelButton={null}
          />
        </Segment>

    </Visibility>
    );
  }
}
const mapState = state => ({
  // me: state.me,
  // app: state.app,
  auth: state.auth,
});
const mapDispatch = {
  loadDatasetHistory,
};
export default injectIntl(connect(mapState, mapDispatch)(History));