import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';
import GA from '@/services/googleAnalytics';

class PexCreateBtn extends Component {
  static displayName = 'PexCreateBtn';

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const createBtn = document.getElementById('PexCreateBtn');
    if (window.pageYOffset > createBtn.offsetTop) {
      createBtn.classList.add('Sticky');
    } else {
      createBtn.classList.remove('Sticky');
    }
  };

  render() {
    return (
      <div id="PexCreateBtn">
        <div className="Idea">
          <img src={IconIdea} alt="" className="IconIdea" />
          <span>Wanna start a new bet?</span>
        </div>
        <Link to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}
          onClick={()=> {
            GA.clickCreateOwnEvent();
          }}
        >
          <button className="btn btn-report">Create now</button>
        </Link>
      </div>
    );
  }
}


export default PexCreateBtn;
