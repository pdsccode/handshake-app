import React from 'react';
import PropTypes from 'prop-types';
// service
import Helper from '@/services/helper';
// style
const FacebookSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/facebook.svg';
// const LinkedinSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/linkedin.svg';
const TwitterSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/twitter.svg';
import './ShareSocial.scss';

class ShareSocial extends React.Component {
  constructor(props) {
    super(props);
    this.clickShare = ::this.clickShare;
    this.socialList = [{
      img: FacebookSVG,
      title: 'FACEBOOK'
    },{
      img: TwitterSVG,
      title: 'TWITTER'
    },
    // {
    //   img: LinkedinSVG,
    //   title: 'LINKEDIN'
    // }
    ];
  }

  clickShare(e, shareType) {
    e.stopPropagation();
    const { title, shareUrl } = this.props;
    let rawUrlShare = '';
    switch(shareType) {
      case 'TWITTER':
        rawUrlShare = `http://twitter.com/intent/tweet?status=${title}+${shareUrl}`;
        break;
      // case 'LINKEDIN':
      //   rawUrlShare = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&summary=${title}&source=LinkedIn`;
      //   break;
      default:
        // facebook
        rawUrlShare = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&amp;title=${title}`;
        break;
    }
    Helper.popupCenter(rawUrlShare, 'facebook', 670, 340);
  }
 
  render() {
    const { className } = this.props;

    return (
      <div className={`share-social ${className}`}>
        {
          this.socialList.map((social, index) => (
            <img key={index+1} src={social.img} alt={social.title} onClick={e => {this.clickShare(e, social.title)}} />
          ))
        }
      </div>
    )
  }
}

ShareSocial.propTypes = {
  shareUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

ShareSocial.defaultProps = {
  className: '',
};

export default ShareSocial;
