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

import closeTop from '@/assets/icons/closeTop.svg';
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
      datasets: [],
    };
  }

  getDataSetProfile = () => this.state.auth?.dataset_profile || {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  componentDidMount() {
    this.fetchData();
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
    const color1 = "linear-gradient(62deg, #f56b96, #f69372 100%, #f69372)";
    const color2 = "radial-gradient(circle at 95% 4%, #a241e2, #534dfd)"; 

    return (
      <Visibility once={true}>  
      <Segment vertical  style={{marginTop:'-5em',background:'white',zIndex:'55555'}}>    
          <h2 className="my-h2-dataset-new">
                History
                <Link to={'/mine'}><Image src={closeTop} className="btn-Close-Top"/></Link>
            </h2> 
         <Container style={{marginLeft:'-20px',float:'left',background:'white' }}> 
              <Card.Group centered >  
                {this.state.datasets.map((item, i) => {
                  return (
                    <Card key={i} className="my-card"  style={{ marginBottom: '1em'}}>
                        {/* <Link className="ui image" to={"/explore/" + item.category_id}> */}
                           
                          <div style={{ padding:'10px', textAlign:'left', backgroundImage: (i%2==0 ? color1 : color2) }}>
                              <h4 style={{ marginTop: '10px',color:'black'}}>{item.name}</h4>  
                              <p>Balance: {item.balance}</p>
                              <Button basic size="mini" basic color='black' className="my-btn-buy-eth" style={{   position: 'absolute',top: '30px',right: '10px', color:'black'}} content='WITHDRAW'/>
                           </div>  
                        {/* </Link> */}
                    </Card>
                    
                  )
                })}
              </Card.Group>
              </Container> 
      </Segment>
      <Segment vertical loading={this.state.isLoading}/> 
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
