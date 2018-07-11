import React from 'react';
import {Grid, Image, Container, Card, Header, Form,Divider, Segment, Dropdown, Visibility, Modal, List, Button, Icon} from 'semantic-ui-react'
// import {AuthConsumer} from './AuthContext'
import {Route, Redirect} from 'react-router'
import agent from '../../services/agent'
import {Link} from 'react-router-dom'
//import filter from 'lodash.filter'

import {iosHeartOutline, iosCopyOutline,androidDone, iosHeart, iosCheckmarkOutline,  iosPlusOutline} from 'react-icons-kit/ionicons'
import { withBaseIcon } from 'react-icons-kit'
const SideIconContainer =  withBaseIcon({ size:28, color:'black'})

 
import activity_active_icon from '@/assets/icons/activityactive.svg';
import activity_icon from '@/assets/icons/activity.svg';

import plus_active_icon from '@/assets/icons/pluscheck.svg';
import plus_icon from '@/assets/icons/plus.svg';
 

//{activeItem === 'history' ? <img class="my-menu-bar" src="/icons/activityactive.svg"/>: <img class="my-menu-bar" src="/icons/activity.svg"/> }

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
      category: null
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
    console.log("DatasetDetail ", this.props.token)
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
      console.log(response.body);
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
        agent.req.get(this.state.nextURL).set('authorization', `JWT ${this.props.token}`).then((response) => {
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
        isAuth={this.props.isAuth}
        liked={this.state.images[i].liked}
        onLike={e => this.handleLikeImage(e, i)}
        onUnlike={e => this.handleUnlikeImage(e, i)}
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

  render() {
    let self = this;
    return (
      <Visibility once={true} onUpdate={this.handleUpdate}> 
        <h2 className="header my-card-header">
                <Image style={{marginLeft:'-20px'}} src={"https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl="+(this.state.category ? this.state.category.contract_address : '')+"&choe=UTF-8"}/>
                <span style={{float:'left',marginTop:'-50px',marginLeft: '80px'}}> {this.state.category ? this.state.category.name :''} </span>
                <Header.Subheader>
                  </Header.Subheader>
                <div className='ui three'>
                    <Button basic color='grey' content={this.state.category && this.state.category.total_followers ? `F ${this.state.category.total_followers}` : 'Followers 0'} ></Button>
                    <Button basic color='grey' content={this.state.category && this.state.category.total_images ? `Img ${this.state.category.total_images}` : 'Images 0'} ></Button>
                    <Button basic color='grey' content='BUY NOW' ></Button>
                </div>
            </h2>
        <Segment vertical>   
           <Container> 
                <Card.Group centered >
                  {this.state.images.map((item, i) => {
                    return (
                      <Card key={i} className="my-card">
                          <Link className="ui image" to={"/explore/" + item.category.id}>
                              <Image src={item.link}/>
                            </Link>
                        <Card.Content>
                          <div style={{float: 'left',marginTop:'-8px'}}>  
                          </div>
                          <div style={{float: 'right', marginTop:'-10px'}}>
                            <div style={{display: 'inline', marginRight: '2em'}}>
                              {this.renderLikedIcon(i)}
                            </div>
                            <div style={{display: 'inline'}}>
                              {this.renderClassifiedIcon(i)}
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    )
                  })}  
                </Card.Group> 
                </Container>
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
        <Segment vertical loading={this.state.isLoading}/>
      </Visibility>

    )
  }
}
export default DataDetail;
 