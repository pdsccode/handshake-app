import React from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';

class PexCreateBtn extends React.PureComponent {
  render() {
    return (
      <div id="PexCreateBtn">
        <div className="Idea">
          <img src={IconIdea} alt="" className="IconIdea" />
          <span>Wanna start a new bet?</span>
        </div>
        <Link to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}>
          <button className="btn btn-report">Create now</button>
        </Link>
      </div>
    );
  }
}


export default PexCreateBtn;
