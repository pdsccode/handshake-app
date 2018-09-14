import React from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import IconIdea from '@/assets/images/icon/idea.svg';
import StickyHeader from '@/components/StickyHeader/StickyHeader';

class PexCreateBtn extends React.PureComponent {
  static displayName = 'PexCreateBtn';
  render() {
    return (
      <StickyHeader elementId="PexCreateBtn">
        <div className="Idea">
          <img src={IconIdea} alt="" className="IconIdea" />
          <span>Got an idea?</span>
        </div>
        <Link to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}>
          <button className="btn btn-report">Create a bet</button>
        </Link>
      </StickyHeader>
    );
  }
}


export default PexCreateBtn;
