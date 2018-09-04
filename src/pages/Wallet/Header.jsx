import React from 'react';
import PropTypes from 'prop-types';

import './Wallet.scss';


class Header extends React.Component {
  constructor(props) {
    super(props);
    // bind
    // this.open = this.open.bind(this);
    // this.close = this.close.bind(this);
  }

  open() {
    // this.modalRef && this.modalRef.classList.add('modal-custom-show');
  }

  close() {
    // this.modalRef && this.modalRef.classList.remove('modal-custom-show');
  }

  componentDidMount() {
    // this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    // this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  renderLink(){
    const { hasLink, title, icon, icon2, linkTitle, onLinkClick, onIcon2Click } = this.props;
    if (!hasLink) return "";
    let html ='';
    if (icon){
     html = <img onClick={onLinkClick} src={icon} />
    }
    else    
      html = <div onClick={onLinkClick} className="headerLink">{linkTitle}</div>
    if (icon2){
      html = <div> <img className="header-icon-2" onClick={onIcon2Click} src={icon2} />{html} </div>
    }
    return html;
    
  }

  render() {
    const { hasLink, title, linkTitle, onLinkClick } = this.props;
    return (
        <div className="headerBox">          
          <span className="headerText">{title}</span>  
          {this.renderLink()}
        </div>
    );
  }
}

Header.propTypes = {
  hasLink: PropTypes.bool,
  title: PropTypes.string,
  linkTitle: PropTypes.string,
  icon : PropTypes.any,
  icon2: PropTypes.any,
  onLinkClick: PropTypes.func,
  onIcon2Click: PropTypes.func,
};

export default Header;
