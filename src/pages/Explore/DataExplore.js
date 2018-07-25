import React from 'react';
import {Grid, Menu, Modal,List, Image, Container, Transition, Card, Icon, Segment, Item, Visibility, Button, Confirm, Input} from 'semantic-ui-react'
// import {AuthConsumer} from './AuthContext'
import {Route, Redirect} from 'react-router'
import agent from '../../services/agent'
import {Link} from 'react-router-dom'

import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {Dataset} from '@/services/Wallets/Tokens/Dataset';

import {iosHeartOutline, iosCopyOutline, iosHeart, iosCheckmarkOutline,  iosPlusOutline} from 'react-icons-kit/ionicons'
import { withBaseIcon } from 'react-icons-kit'
const SideIconContainer =  withBaseIcon({ size:20})


import activity_active_icon from '@/assets/icons/activityactive.svg';

import activity_icon from '@/assets/icons/activity.svg';

import plus_active_icon from '@/assets/icons/pluscheck.svg';

import plus_icon from '@/assets/icons/plus.svg';

import newboard from '@/assets/icons/newboard.svg';

const fee = 0.005; // eth

const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
    width:'80%',
  }
};

function ImageGrid(props) {
  if (props.displayImages.length <=2 ) {
    return (
      <Image src={props.displayImages[0]} />
    );
  }

  return (
    <div>
        <Grid columns={1} padded>
        <Grid.Column fluid>
            <Image src={props.displayImages[0]} className="fistgridimage" />
         </Grid.Column>
        </Grid>
        <Grid columns={2} padded>
          <Grid.Column fluid>
           <Image src={props.displayImages[1]} />
          </Grid.Column>
          <Grid.Column fluid>
           <Image src={props.displayImages[2]} />
          </Grid.Column>
        </Grid>
     </div>
  );
}

function LikedIcon(props) {
  if (props.followed) {
    return (
      <a href='javascript:void(0);' style={{color:'#333'}} onClick={props.onUnfollow}>
         <img className="my-icon" src={activity_active_icon}/>
      </a>
    );
  }
  return (
    <a href='javascript:void(0);'style={{color:'#333'}} onClick={props.onFollow}>
        <img className="my-icon"  src={activity_icon}/>
    </a>
  );
}

class DataExplore extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {
      isLoading: false,
      categories: [],
      nextURL: '',
      calculations: {
        bottomVisible: false,
      },
      open:false,
      selectedItem: null,
      walletSelected: null
    };
  }

  show = size => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  Copy(item){
    console.log("copy",item);
    const el = document.createElement('textarea');
    el.value = item;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("Copped!");
  }

  showConfirm(item){
    this.setState({ selectedItem: item, open: true })
  }

  async handleConfirmBuy() {
    this.setState({ isLoading: true });

    let tx;
    try {
      const dataset = new Dataset();
      dataset.createFromWallet(MasterWallet.getWalletDefault('ETH'));
      // tx = await dataset.buy(this.state.selectedItem.id, (this.state.selectedItem.total_images/1000) + fee);
      tx = await dataset.buy(this.state.selectedItem.id, 1);
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false, open: false });
      return;
    }

    const data = {
      category: this.state.selectedItem.id,
      tx: tx?.transactionHash||''
    };
    agent.req.post(agent.API_ROOT + '/api/buy/', data).set('authorization', `JWT ${this.props.token}`).type('form')
      .then((response) => {
        console.log(response);
        this.setState({ isLoading: false, open: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ isLoading: false, open: false });
      });
  }

  componentDidMount() {
    //document.title = 'Data oscar'
    this.setState({isLoading: true})

    const req = agent.req.get(agent.API_ROOT + '/api/explore-category/');

    req.set('authorization', `JWT ${this.props.token}`);

    req.then((response) => {
      const body = response.body;
      console.log(body);

      this.setState({isLoading: false});
      this.setState({categories: body.results, nextURL: body.next});
    }).catch((e) => {
    })
  }

  handleUpdate = (e, {calculations}) => {
    let self = this;
    this.setState({calculations})
    if (calculations.direction === "down" & calculations.percentagePassed > 0.3) {
      if (!!this.state.nextURL && this.state.isLoading == false) {
        this.setState({isLoading: true})
        agent.req.get(this.state.nextURL).then((response) => {
          let resBody = response.body;
          this.setState({isLoading: false})
          if (resBody.next != self.state.nextURL) {
            let newData = this.state.images.concat(resBody.results)
            this.setState({images: newData, nextURL: resBody.next})
          }
        }).catch((e) => {
        })
      }
    }
  }

  handleFollowCategory(e, i) {

    e.preventDefault();
    const id = this.state.categories[i].id;

    agent.req.post(agent.API_ROOT + '/api/profile-category/follow/')
      .send({ category: id })
      .set('authorization', `JWT ${this.props.token}`)
      .set('accept', 'application/json')
      .then((resp) => {
        const categories = this.state.categories.slice();
        categories[i].followed = true;
        this.setState({categories});
      })
      .catch((err) => {
      });
  }

  handleUnfollowCategory(e, i) {

    e.preventDefault();
    const id = this.state.categories[i].id;

    agent.req.del(agent.API_ROOT + '/api/profile-category/unfollow/')
      .send({ category: id })
      .set('authorization', `JWT ${this.props.token}`)
      .set('accept', 'application/json')
      .then((resp) => {
        const categories = this.state.categories.slice();
        categories[i].followed = false;
        this.setState({categories});
      })
      .catch((err) => {
      });
  }

  renderLikedIcon(i) {
    return (
      <LikedIcon
        followed={this.state.categories[i].followed}
        onFollow={e => this.handleFollowCategory(e, i)}
        onUnfollow={e => this.handleUnfollowCategory(e, i)}
      />
    );
  }

  render() {
    return (
      <Visibility once={true} onUpdate={this.handleUpdate}>
        <Segment vertical >
            <Card.Group centered  >
                  <Card  className="my-card" style={{background:'#21c364' ,    marginBottom: '12px'}}>
                    <Link className="ui image" to={'/explore/create'}>
                      <Card.Content style={{textAlign:'left'}}>
                          {/* <Icon size="large" name='newspaper outline'
                           style={{color: 'white',margin: '0.7em',float:'left' }}  /> */}
                           <Image src={newboard} style={{ borderRadius:'0!important', margin:'15px',float:'left' }} />
                           <span style={{color: 'white',fontSize: '16px', float:'left', marginTop:'8px'}} >Create new Dataset</span>
                      </Card.Content>
                    </Link>
                  </Card>
                  {this.state.categories.map((cat, i) => {
                    return (
                      <Card key={i} className="my-card">
                        <Link className="ui image" to={'/explore/' + cat.id}>
                            {/* <ImageGrid displayImages={cat.display_images} />  className="fistgridimage"  */}
                            <Image src={cat.display_images[0]}/>
                        </Link>
                        <Card.Content style={{marginBottom: '10px'}}>
                          <div style={{float: 'left', marginTop:'-8px'}}>
                            <p  className="title">{cat.name}</p>
                            <p  style={{color:'#232323' , opacity:'0.4',     fontSize:'12px'}}>{cat.total_images} img</p>
                          </div>
                          <div style={{float: 'right',marginTop:'-8px' }}>
                              <div style={{display: 'inline'}}>
                               {this.renderLikedIcon(i)}
                              </div>
                            <div style={{display: 'inline'}}>
                               <Button onClick={()=>this.showConfirm(cat)}  size="mini" basic color='black' className="my-btn-buy-eth"> {"Buy "+ ( Math.round((cat.total_images/10000 + 0.005) * 10000) /10000  )+ " ETH"}</Button>
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    )
                  })}
               </Card.Group>
        </Segment>
        <Segment vertical loading={this.state.isLoading}>
          <Confirm
            content={
              <div class='content'>
                <h3>You want to buy this dataset?</h3>
                <p>By click OK you will send ETH in your wallet to the DAD SmartContract address.</p>
              </div>
            }
            open={this.state.open}
            onCancel={this.close}
            onConfirm={() => this.handleConfirmBuy()}
            confirmButton={<Button positive loading={this.state.isLoading} style={{width: 'auto', height: 'auto'}}>OK</Button>}
            cancelButton={<Button positive style={{background: 'none',color:'#333',fontWeight:'500'}} disabled={this.state.isLoading}>Cancel</Button>}
          />
        </Segment>
        <Segment vertical loading={this.state.isLoading}/>
      </Visibility>
    )
  }
}

export default DataExplore;

//  props => (<AuthConsumer>
//     {({login, token, isLoading, isAuth}) => {
//       return <Explore {...props} login={login} isAuth={isAuth} isLoading={isLoading} token={token} />
//     }}
//   </AuthConsumer>
// )
