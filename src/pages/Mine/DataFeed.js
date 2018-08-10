import React from 'react';
import {Grid, Image, Form, Confirm, Container, Card, Icon, Segment, Item, Visibility, Button, Modal, List, Input,Label} from 'semantic-ui-react';
// import {AuthConsumer} from './AuthContext';
// import {Route, Redirect} from 'react-router';
import agent from '../../services/agent';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
//import filter from 'lodash.filter';
import { injectIntl } from 'react-intl';
// import {iosHeartOutline, iosCopyOutline,androidDone, iosHeart, iosCheckmarkOutline,  iosPlusOutline} from 'react-icons-kit/ionicons';
// import { withBaseIcon } from 'react-icons-kit';
import activity_active_icon from '@/assets/icons/activityactive.svg';
import activity_icon from '@/assets/icons/activity.svg';
import { submitHashTag } from '@/reducers/me/action';
import plus_active_icon from '@/assets/icons/pluscheck.svg';
import plus_icon from '@/assets/icons/plus.svg';
import { BASE_API } from '@/constants';
import addPlus from '@/assets/icons/addplus.svg';

// const SideIconContainer =  withBaseIcon({ size:28, color:'black'});
//{activeItem === 'history' ? <img class="my-menu-bar" src="/icons/activityactive.svg"/>: <img class="my-menu-bar" src="/icons/activity.svg"/> }
const TAG = "DataFeed";
function LikedIcon(props) {
  if (props.liked) {
    return (
      <a href='javascript:void(0);' onClick={props.onUnlike} style={{color:'#333'}}>
         <img className="my-icon" src={activity_active_icon}/>
      </a>
    );
  }
  return (
    <a href='javascript:void(0);' onClick={props.onLike} style={{color:'#333'}} >
        <img className="my-icon"  src={activity_icon}/>
    </a>
  );
}

function ClassifiedIcon(props) {
  if (props.classified) {
    return <a href='javascript:void(0);' style={{color:'#333'}}>
        <img className="my-icon" src={plus_active_icon}/>
    </a> ;
  }
  return (
    <a href='javascript:void(0);' onClick={props.onClassify} style={{color:'#333'}}>
       <img className="my-icon" src={plus_icon}/>
    </a>
  );
}

function RenderImage(props) {
  return (
    <Card className="my-card">
        <Image className="ui image" src={props.item.link}/>
      <Card.Content>
      {props.renderHashTag(props.item)}
      </Card.Content>
    </Card>
  );
}

class DataFeed extends React.Component {
  constructor(props) {
    super(props);
    // this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {
      isLoading: false,
      // categories: [],
      images: [],
      currentImage: 0,
      nextURL: '',
      calculations: {
        bottomVisible: false,
      },
      open:false,
      classifyName:'',
      selectcategory: null,
      modal: {
        open: false,
        imageIndex: null,
        classifies: [],
        classifyId: null,
        searchableClassfies: []
      },
      token: props?.token||'',
      confirmCategory: null,
      confirmImage: null
    };
    this.handleLikeImage = this.handleLikeImage.bind(this);
    this.handleClassifyImage = this.handleClassifyImage.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSelectedClassify = this.handleSelectedClassify.bind(this);
    this.submitClassify = this.submitClassify.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  closeConfirm = () => this.setState({ openConfirmAddClassify: false, confirmCategory: null })
  /* show = category => () => this.setState({ selectcategory:category, nameclassified:'', open: true }) */
  showConfirm(image, category) {
    this.setState({openConfirmAddClassify: true, confirmCategory: category, confirmImage: image});
  }

  handleAddClassify = () => {
    console.log(this.state)
    const category = this.state.confirmCategory;
    if (!category) {
      this.setState({openConfirmAddClassify: false});
      return;
    }

    const classifyName = this.state.classifyName;
    if (!classifyName) {
      this.setState({openConfirmAddClassify: false});
      return;
    }

    this.setState({isLoading: true});
    agent.req.post(agent.API_ROOT + '/api/classify/', {
      category: category.id,
      name: classifyName
    }).set('authorization', `JWT ${this.props.token}`).type('form').then((response) => {
      agent.req.post(agent.API_ROOT + '/api/image-profile/', {image: this.state.confirmImage.id, classify: response.body.id})
        .set('authorization', `JWT ${this.props.token}`).type('form').then(() => {
          const images = this.state.images;
          images.forEach((i) => {
            if (i.id == this.state.confirmImage.id) {
              i.category.classifies.push({
                id: response.body.id,
                name: response.body.name,
                checked: true
              });
              i.classified = true;
            }
          });
          this.setState({isLoading: false, openConfirmAddClassify: false, classifyName: '', images})
        });
    }).catch((e) => {
      console.log(e);
      this.setState({isLoading: false, openConfirmAddClassify: false, classifyName: ''});
    });
  }

  init_data(token){
    this.setState({isLoading: true})

    const req = agent.req.get(agent.API_ROOT + '/api/feed/');
    if (token) {
      req.set('authorization', `JWT ${token}`);
    }
    req.then((response) => {
      const body = response?.body||{};
      console.log(TAG," init_data body = ",body);
      // this.setState({isLoading: false});
      this.setState({images: body?.results, nextURL: body?.next,isLoading: false});
    }).catch((e) => {
    })
  }

  componentDidMount() {
    //document.title = 'DAD: Decentralized Autonomous Dataset';
    console.log("AHIHI ==== ",this.props.token);
    this.init_data(this.props.token);
  }
  componentWillReceiveProps(nextProps) {
    if(!this.state.token){
      this.setState({token: nextProps.token});
      this.init_data(nextProps.token);
    }
  }

  handleUpdate = (e, {calculations}) => {
    this.setState({calculations});
    if (calculations.direction === "down" && calculations.percentagePassed > 0.3) {
      if (this.state.nextURL && !this.state.isLoading) {
        this.setState({isLoading: true});

        var  request_url_tmp = this.state.nextURL;
        if (process.env.BASE_DATASET_PORT =="443" ){
           request_url_tmp = request_url_tmp.replace("http", "https");;
        }
        const req  = agent.req.get(request_url_tmp);
        if (this.props.isAuth && this.state.token !=undefined) {
          req.set('authorization', `JWT ${this.props.token}`);
        }

        req.then((response) => {
          let resBody = response?.body||{};
          this.setState({isLoading: false});
          if (resBody.next != this.state.nextURL) {
            let newData = this.state.images.concat(resBody.results);
            this.setState({images: newData, nextURL: resBody.next});
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

  clickTagItem = (item,itemId)=>{
    // console.log(TAG,' clickTagItem - - begin token = ',this.token());
    if(item && itemId){
      const imageId = item?.id||-1;
      const data = new FormData();
      data.append('image',imageId);
      data.append('classify',itemId);
      this.props.submitHashTag({
        BASE_URL: BASE_API.BASE_DATASET_API_URL,
        PATH_URL: 'image-profile/',
        METHOD: 'POST',
        headers: { 'Authorization': `JWT ${this.token()}` },
        data,
        successFn: (res) => {
          const id = res?.image || -1;
          if(String(imageId) === String(id)){
            const images = this.state.images;
            const classifies =  item?.category?.classifies||[];
            console.log(TAG,' clickTagItem - - success - ', res);
            console.log(TAG,' clickTagItem - - success - classifies ', classifies);
            const indexClassify  = classifies?.findIndex(item=>item.id ==res.classify);
            console.log(TAG,' clickTagItem - - success - index ', indexClassify);
            classifies[indexClassify]['checked'] = true;
            const itemList = classifies.findIndex(item);
            images[id] = item;
            this.setState({images});

          }
        },
        errorFn: (e) => {
          console.log(TAG,' clickTagItem - error - ', e);
        }
    });
    }
  }

  token = ()=>{
    return this.props?.token||'';
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
    //modal.searchableClassfies = filter(modal.classifies, isMatch);
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

  renderHashTag = (value,index)=>{
    const classifies  = value?.category?.classifies||[];
    const isNeedClick = true;// classifies.filter(item=> item.checked === true).length === 0 ;
    const listTagView  = classifies.map(item=>{
      // console.log(TAG," renderHashTag item = ",item);
      // return (
      // <Label color={item.checked?'yellow':undefined} key={String(item.id)||'-1'} as='a'
      //    style={{marginTop:2,marginBottom:2}} size='small' onClick={isNeedClick?()=>this.clickTagItem(value,item.id):undefined}>
      //   {item?.name||''}
      // </Label>);
      return (
        <Label basic color={item.checked?'tealqn':'black'} key={String(item.id)||'-1'}
          onClick={isNeedClick?()=>this.clickTagItem(value,item.id):undefined}>{item?.name||''}</Label>
      );
    });
    //console.log(value.category);
    return (<div style={{display:'flex',flex:1,flexWrap:'wrap'}}>
        <Image onClick={()=>this.showConfirm(value, value.category)} src={addPlus} style={{ width:'30px',marginTop:'-10px'}}/>
        {listTagView}
    </div>);
  }

  handleClassifyNameInput = (e, {name, value}) => this.setState({classifyName: value})

  renderImage() {
    return (
      <RenderImage
        item={this.state.images[this.state.currentImage]}
        renderHashTag={this.renderHashTag}
      />
    );
  }

  nextImage() {
    const currentImage = this.state.currentImage;
    console.log(currentImage, this.state.images.length - 1)
    if (currentImage < this.state.images.length - 1) {
      this.setState({currentImage: currentImage + 1})
      return;
    }

    console.log('init data')

    this.init_data(this.props.token);
    this.setState({currentImage: 0});
    this.renderImage();
  }

  render() {
    return (
      <Visibility once={true} onUpdate={this.handleUpdate}>
        <Segment vertical >
            <Card.Group centered>
              {this.state.images.length && this.renderImage()}
            </Card.Group>
            <Button color='black' style={{width: '45%', fontWeight: 'lighter'}} onClick={() => this.nextImage()}>SKIP</Button>
            <Button color='black' style={{width: '45%', fontWeight: 'lighter'}} onClick={() => this.nextImage()}>NEXT</Button>
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
                <h3 style={{letterSpacing:'-0.24'}}>Enter Label</h3>
                <Form.Input
                  autoFocus
                  type='text'
                  fluid placeholder='Label' name='classifyName' value={this.state.classifyName}
                              onChange={this.handleClassifyNameInput}/>
              </div>
            }
            open={this.state.openConfirmAddClassify}
            onCancel={this.closeConfirm}
            onConfirm={() => this.handleAddClassify()}
            confirmButton={<Button positive loading={this.state.isLoading} style={{padding: '10px 32px', width: 'auto', height: 'auto'}}>OK</Button>}
            cancelButton={<Button positive style={{background: 'none',color:'#333',fontWeight:'500'}} disabled={this.state.isLoading}>Cancel</Button>}
          />
        </Segment>

        <Segment vertical loading={this.state.isLoading}/>

      </Visibility>
    )
  }
}
// export default DataFeed;

// export default props => (<AuthConsumer>
//     {({login, token, isLoading, isAuth}) => {
//       return <DataFeed {...props} login={login} isAuth={isAuth} isLoading={isLoading} token={token} />
//     }}
//   </AuthConsumer>
// )
const mapState = state => ({

});

const mapDispatch = ({
  submitHashTag,
});
export default injectIntl(connect(mapState, mapDispatch)(DataFeed));
