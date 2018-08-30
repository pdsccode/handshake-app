import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

class PexCreateBtn extends Component {
  static displayName = 'PexCreateBtn';
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

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
        <div className="Idea">Got an idea?</div>
        <Link to={{ pathname: URL.HANDSHAKE_PEX_CREATOR }}>
          <button className="btn btn-report">Create your own bet</button>
        </Link>
      </div>
    );
  }
}


export default PexCreateBtn;
