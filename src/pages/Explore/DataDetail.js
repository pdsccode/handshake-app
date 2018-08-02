import React from 'react';
import {Grid, Image, Container, Card, Header,  Form,Divider, Segment, Dropdown, Visibility, Modal, List,Label, Button, Icon, Confirm} from 'semantic-ui-react'
// import {AuthConsumer} from './AuthContext'
import {Route, Redirect} from 'react-router'
import agent from '../../services/agent'
import {Link} from 'react-router-dom'
//import filter from 'lodash.filter'

import {iosHeartOutline, iosCopyOutline,androidDone, iosHeart, iosCheckmarkOutline,  iosPlusOutline} from 'react-icons-kit/ionicons'
import { withBaseIcon } from 'react-icons-kit'
const SideIconContainer =  withBaseIcon({ size:28, color:'black'})

import {blockchainNetworks } from '@/constants';

import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {Dataset} from '@/services/Wallets/Tokens/Dataset';

import activity_active_icon from '@/assets/icons/activityactive.svg';
import activity_icon from '@/assets/icons/activity.svg';

import plus_active_icon from '@/assets/icons/pluscheck.svg';
import plus_icon from '@/assets/icons/plus.svg';
import copyTop from '@/assets/icons/copy.svg';
import closeTop from '@/assets/icons/closeTop.svg';
import UPLOAD_EARN from '@/assets/icons/UPLOAD_EARN.jpg';
import Input from '@/components/core/forms/Input/Input';

function LikedIcon(props) {
  if (props.liked) {
    return (
      <a href='javascript:void(0);' onClick={props.onUnlike} style={{color:'#333'}}>
         <img class="my-icon" src={activity_active_icon}/>
      </a>
    );
  }
  return (
    <a href='javascript:void(0);' onClick={props.onLike} style={{color:'#333'}} >
        <img class="my-icon"  src={activity_icon}/>
    </a>

  );
}


function FollowIcon(props) {

  if (props.followed) {
    return (
      <a href='javascript:void(0);' style={{color:'#333'}} onClick={props.onUnfollow}>
          <Button basic size="mini" basic color='black' className="my-btn-buy-eth" content='Following'/>
      </a>
    );
  }
  return (
    <a href='javascript:void(0);'style={{color:'#333'}} onClick={props.onFollow}>
         <Button basic size="mini" basic color='black' className="my-btn-buy-eth" content='Follow'/>
    </a>
  );

}

function ClassifiedIcon(props) {
  if (props.classified) {
    return <a href='javascript:void(0);' style={{color:'#333'}}>
        <img class="my-icon" src={plus_active_icon}/>
    </a> ;
  }
  return (
    <a href='javascript:void(0);' onClick={props.onClassify} style={{color:'#333'}}>
       <img class="my-icon" src={plus_icon}/>
    </a>
  );
}


class DataDetail extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.state = {
      isLoading: false,
      img: '',
      images: [],
      classifies: [],
      nextURL: '',
      calculations: {
        bottomVisible: false,
      },
      modal: {
        open: false,
        imageIndex: null,
        classifies: [],
        classifyId: null,
        searchableClassfies: []
      },
      category: null,
      open: false
    };
    this.handleLikeImage = this.handleLikeImage.bind(this);
    this.handleClassifyImage = this.handleClassifyImage.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSelectedClassify = this.handleSelectedClassify.bind(this);
    this.submitClassify = this.submitClassify.bind(this);
  }

  handleFile(e) {
    const link = e.target.files[0];
    let form = new FormData()
    form.append('link', link)
    //props.match.params.slug
    form.append('category', this.props.match.params.slug)
    console.log('submit image')
    agent.req.post(agent.API_ROOT + '/api/image/', form).set('authorization', `JWT ${this.props.token}`).then((response) => {

      agent.req.get(agent.API_ROOT + '/api/image/?category=' + this.props.match.params.slug).set('authorization', `JWT ${this.props.token}`).then((response) => {
        let resBody = response.body;
        this.setState({images: resBody.results, nextURL: resBody.next})
      }).catch((e) => {
      })

    }).catch((e) => {
    })
  }

  handleChange = (image, e, value) => {
    let classify = value;
    console.log(image, classify);
    agent.req.post(agent.API_ROOT + '/api/image-profile/', {image, classify})
      .set('authorization', `JWT ${this.props.token}`).type('form').then((response) => {
      let resBody = response.body;
    }).catch((e) => {
    })
  }


  componentDidMount() {
    this.setState({isLoading: true})
    //console.log("DatasetDetail ", this.props.token)
    // agent.req.get(agent.API_ROOT + '/api/classify/?category=' + this.props.match.params.categoryId).set('authorization', `JWT ${this.props.token}`).then((response) => {
    //   let resBody = response.body;
    //   let temp = [];
    //   for (let i = 0; i < resBody.results.length; i++) {
    //     temp.push({"text": resBody.results[i].name, "value": resBody.results[i].id})
    //   }
    //   this.setState({classifies: temp})
    // }).catch((e) => {
    // });
    agent.req.get(agent.API_ROOT + '/api/category/' + this.props.match.params.slug).set('authorization', `JWT ${this.props.token}`).then((response) => {
      this.setState({category: response.body})
      console.log("DatasetDetail", response);
    }).catch((e) => {
    })

    agent.req.get(agent.API_ROOT + '/api/image/?category=' + this.props.match.params.slug).set('authorization', `JWT ${this.props.token}`).then((response) => {
      let resBody = response.body;
      this.setState({isLoading: false})
      this.setState({images: resBody.results, nextURL: resBody.next})
    }).catch((e) => {
    })
  }

  handleUpdate = (e, {calculations}) => {
    let self = this;
    console.log(calculations)
    console.log(calculations.percentagePassed)
    this.setState({calculations})
    if (calculations.direction === "down" & calculations.percentagePassed > 0.3) {
      if (!!this.state.nextURL && this.state.isLoading == false) {
        this.setState({isLoading: true})

        var  request_url_tmp = this.state.nextURL;
        if (process.env.BASE_DATASET_PORT =="443" ){
           request_url_tmp = request_url_tmp.replace("http", "https");;
        } 

        agent.req.get(request_url_tmp).set('authorization', `JWT ${this.props.token}`).then((response) => {
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

  handleLikeImage(e, i) {
    if (!this.props.isAuth) {
      return;
    }

    e.preventDefault();
    const id = this.state.images[i].id;

    agent.req.post(agent.API_ROOT + '/api/image-profile/like/')
      .send({ image: id })
      .set('authorization', `JWT ${this.props.token}`)
      .set('accept', 'application/json')
      .then((resp) => {
        const images = this.state.images.slice();
        images[i].liked = true;
        this.setState({images});
      })
      .catch((err) => {
      });
  }

  handleUnlikeImage(e, i) {
    if (!this.props.isAuth) {
      return;
    }

    e.preventDefault();
    const id = this.state.images[i].id;

    agent.req.del(agent.API_ROOT + '/api/image-profile/unlike/')
      .send({ image: id })
      .set('authorization', `JWT ${this.props.token}`)
      .set('accept', 'application/json')
      .then((resp) => {
        const images = this.state.images.slice();
        images[i].liked = false;
        this.setState({images});
      })
      .catch((err) => {
      });
  }

  closeModal() {
    const modal = {...this.state.modal};
    modal.open = false;
    modal.imageIndex = null;
    modal.classifyId = null;
    modal.classifies = [];
    this.setState({modal});
  }

  submitClassify() {
    if (!this.state.modal.classifyId) {
      this.closeModal();
      return;
    }

    const imageIndex = this.state.modal.imageIndex;
    const imageId = this.state.images[imageIndex].id;
    const classifyId = this.state.modal.classifyId;
    agent.req.post(agent.API_ROOT + '/api/image-profile/', {image: imageId, classify: classifyId})
      .set('authorization', `JWT ${this.props.token}`).type('form').then((response) => {
        const images = this.state.images.slice();
        images[imageIndex].classified = true;
        this.setState({images});

        this.closeModal();
    }).catch((e) => {
    })
  }

  handleSelectedClassify(classifyId) {
    const modal = {...this.state.modal};
    modal.searchableClassfies.forEach(function(c) {
      if (c.value === classifyId) {
        if (c.active) {
          c.active = false;
          c.content = <List.Content>{c.text}</List.Content>;
          modal.classifyId = null;
        } else {
          c.active = true;
          c.content = (
            <List.Content>
              <List.Content floated='right'>
                <Icon name='checkmark' />
              </List.Content>
              <List.Content>
                {c.text}
              </List.Content>
            </List.Content>
          );
          modal.classifyId = classifyId;
        }
      } else {
        c.active = false;
        c.content = <List.Content>{c.text}</List.Content>;
      }
    });
    this.setState({modal});
  }

  handleClassifyImage(e, i) {
    e.preventDefault();

    const searchableClassfies = [];
    agent.req.get(agent.API_ROOT + `/api/classify/?category=${this.state.images[i].category.id}&limit=50`).set('authorization', `JWT ${this.props.token}`).then((response) => {
      const resBody = response.body;
      console.log(response);
      for (let i = 0; i < resBody.results.length; i++) {
        searchableClassfies.push({
          content: <List.Content>{resBody.results[i].name}</List.Content>,
          text: resBody.results[i].name,
          value: resBody.results[i].id,
          active: false
        });
      }

      const modal = {...this.state.modal};
      modal.open = true;
      modal.imageIndex = i;
      modal.classifies = searchableClassfies;
      modal.searchableClassfies = searchableClassfies;
      this.setState({modal});
    }).catch((e) => {
    });
  }

  handleModalSearch(text) {
    const modal = {...this.state.modal};
    if (!text) {
      modal.searchableClassfies = modal.classifies;
      this.setState({modal});
      return;
    }

    const re = new RegExp(text, 'i');
    const isMatch = result => re.test(result.text);
    modal.searchableClassfies = filter(modal.classifies, isMatch);
    this.setState({modal});
  }

  renderLikedIcon(i) {
    return (
      <LikedIcon
        liked={this.state.images[i].liked}
        onLike={e => this.handleLikeImage(e, i)}
        onUnlike={e => this.handleUnlikeImage(e, i)}
      />
    );
  }

  handleFollowCategory(e, i) {

    e.preventDefault();
    const id = this.state.category.id;

    agent.req.post(agent.API_ROOT + '/api/profile-category/follow/')
      .send({ category: id })
      .set('authorization', `JWT ${this.props.token}`)
      .set('accept', 'application/json')
      .then((resp) => {
        //const categories = this.state.categories.slice();
        //categories[i].followed = true;
        i.followed = true;
        this.setState({category: i});
      })
      .catch((err) => {
      });
  }

  handleUnfollowCategory(e, i) {

    e.preventDefault();
    const id = i.id;

    agent.req.del(agent.API_ROOT + '/api/profile-category/unfollow/')
      .send({ category: id })
      .set('authorization', `JWT ${this.props.token}`)
      .set('accept', 'application/json')
      .then((resp) => {
        //const categories = this.state.categories.slice();
        i.followed = false;
        this.setState({category: i});
      })
      .catch((err) => {
      });
  }

  renderFollowIcon(i) {
    return (
      <FollowIcon
        followed={ i ? i.followed : false }
        onFollow={e => this.handleFollowCategory(e, i)}
        onUnfollow={e => this.handleUnfollowCategory(e, i)}

      />
    );
  }


  renderClassifiedIcon(i) {
    return (
      <ClassifiedIcon
        isAuth={this.props.isAuth}
        classified={this.state.images[i].classified}
        onClassify={e => this.handleClassifyImage(e, i)}
      />
    );
  }

  showConfirm(){
    console.log('here')
    this.setState({ open: true })
  }
  close = ()=>{
    this.setState({ open: false });
  }
  async handleConfirmBuy() {
    this.setState({ isLoading: true });

    let tx;
    try {
      const dataset = new Dataset();
      dataset.createFromWallet(MasterWallet.getWalletDefault('ETH'));
      tx = await dataset.buy(this.state.category.id,   ( Math.round((this.state.category.total_images/10000 + 0.005) * 10000) /10000  ) );
    } catch (e) {
      console.log(e);
      this.setState({ open: false });
      return;
    }

    const data = {
      category: this.state.category.id,
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

  render() {
    let self = this;
    return (
      <Visibility once={true} onUpdate={this.handleUpdate}>
        <Segment vertical  id="segment-detail"> 
              <h2 className="my-h2-dataset-new" style={{    marginBottom:'0px'}}>
                  Datasets / {this.state.category ? this.state.category.name :''}
                  <Link to={'/datasets'}><Image src={closeTop} className="btn-Close-Top"/></Link>
              </h2>
                <Card.Group centered >
                  <Card className="my-card" style={{ marginBottom: '1em', paddingBottom: '1em'}}>
                    <Card.Content>
                     <Grid id="grid-detail-header" style={{ marginBottom:'0px'}}>
                        {/* <Grid.Column width={4}>
                        <Image style={{float:'left',  marginTop: '-18px'}} src={"https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl="+(blockchainNetworks.ethereum.contracts.dadsetTokenAddress )+"&choe=UTF-8"}/>
                        </Grid.Column> */}
                        <Grid.Column width={16} style={{textAlign:'left'}}>
                            <List>
                            <List.Item className="list-item-name">Name: {this.state.category ? this.state.category.name :''} </List.Item>
                            { (this.state.category!=null && this.state.category.desc !=null) ?
                              <List.Item><span style={{fontWeight:'700'}}>Desc: </span>{this.state.category ? this.state.category.desc :''}</List.Item>
                              :""
                            }
                            { (this.state.category!=null && this.state.category.classifies !=null) ?
                              <List.Item style={{    paddingRight: '12px'}}>
                                <span style={{fontWeight:'700'}}>Classifies: </span>
                                {this.state.category.classifies.map((item, i) => {
                                  return <span basic color="black" key={String(item.id)||'-1'}>{item?.name||''}, </span>
                                })}
                              </List.Item>
                              :""
                            }

                            <List.Item>
                              <span style={{fontWeight:'700'}}>Quantity: </span> {this.state.category && this.state.category.total_images > 1 ? `${this.state.category.total_images} Images` : '1 Image'} 
                            </List.Item>
                            <List.Item style={{ marginTop: '10px', marginLeft: '-20px'}} >
                            {this.renderFollowIcon(this.state.category  )}
                            <Button basic size="mini" basic color='black' className="my-btn-buy-eth" onClick={() => this.showConfirm()} >Buy now { this.state.category && this.state.category.total_images ? ( Math.round((  this.state.category.total_images/10000 + 0.005) * 10000) /10000  ): ''} ETH</Button></List.Item>
                            </List>
                        </Grid.Column>
                      </Grid>
                    </Card.Content>
                  </Card>
                  {this.state.images.length ==0 ?
                    <Card  className="my-card wrap-upload">
                      <Card.Content className="row wrap-upload">
                         <Link className="ui image" to={"/upload"}>
                          <label className="uploader" style={{width:'346px'}} >
                            <Icon name="cloud upload" style={{fontSize:'24px'}}/>
                            <p style={{marginTop: '60px',color:'#c1c1c1'}}>go to upload</p>
                          </label>
                          </Link>
                        </Card.Content>
                      </Card>
                    : ""
                  }
                  {this.state.images.map((item, i) => {
                    return (
                      <Card key={i} className="my-card2"  style={{ marginBottom: '1em'}}> 
                         <Image src={item.link}  className="ui image"/>
                      </Card>

                    )
                  })}
                </Card.Group>
               
              <Modal size='large'closeOnEscape closeIcon open={this.state.modal.open} onClose={this.closeModal} style={{height: '90%'}}>
                <Modal.Header>Choose classify</Modal.Header>
                <Modal.Content style={{height: '80%', overflowY: 'scroll'}}>
                  {/*<Input fluid onChange={(e, data) => this.handleModalSearch(data.value)} icon='search' placeholder='Search classify...' />*/}
                  <List divided selection items={this.state.modal.searchableClassfies} onItemClick={(e, data) => this.handleSelectedClassify(data.value)} />
                </Modal.Content>
                <Modal.Actions>
                  <Button fluid positive content='Done' onClick={this.submitClassify} style={{marginLeft: 0}} />
                </Modal.Actions>
              </Modal>
        </Segment>
       
        <Segment vertical loading={this.state.isLoading}>
        
          <Confirm
            content={
              <div class='content'>
                <h3 style={{letterSpacing:'-0.24'}}>Do you want to purchase this dataset?</h3>
                <p style={{lineHeight:'1.6em'}}>Please make sure you have enough ETH in your wallet.</p>
              </div>
            }
            open={this.state.open}
            onCancel={this.close}
            onConfirm={() => this.handleConfirmBuy()}
            confirmButton={<Button positive  loading={this.state.isLoading} style={{padding: '10px 32px' ,width: 'auto', height: 'auto' }}>OK</Button>}
            cancelButton={<Button positive style={{background: 'none',color:'#333',fontWeight:'500'}}>Cancel</Button>}
          />
        </Segment> 
      </Visibility>

    )
  }
}
export default DataDetail;
