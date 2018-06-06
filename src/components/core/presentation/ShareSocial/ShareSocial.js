import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service
import Helper from '@/services/helper';
import { showAlert } from '@/reducers/app/action';
// style
import CopyLink from '@/assets/images/icon/copy-link.svg';
import './ShareSocial.scss';
const FacebookSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/facebook.svg';
// const LinkedinSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/linkedin.svg';
const TwitterSVG = 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/twitter.svg';
const Clipboard = (function(window, document, navigator) { var textArea, copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() { var range, selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); } } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function(text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy: copy }; })(window, document, navigator);


class ShareSocial extends PureComponent {
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
    {
      img: CopyLink,
      title: 'COPY'
    }
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
      case 'COPY':
        // TODO: Short link
        // copy to clip board
        Clipboard.copy(shareUrl);
        // show alert
        this.props.showAlert({
          message: <div className="text-center">Copied to clipboard!</div>,
          timeOut: 3000,
          type: 'success',
        });
        return;
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
  showAlert: PropTypes.func,
};

ShareSocial.defaultProps = {
  className: '',
};

const mapDispatch = ({
  showAlert,
});

export default connect(null, mapDispatch)(ShareSocial);
