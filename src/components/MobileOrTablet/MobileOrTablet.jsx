import React from 'react';
// style
import onlyMobileTabletSVG from '@/assets/images/ninja/ninja-header.svg';
import shurikenIcon from '@/assets/images/ninja/shuriken-icon.svg';
import './MobileOrTablet.scss';

const whitePaperLink = 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8';
const mediumLink = 'https://t.me/ninja_org';
const countryList = [
  'ENG',
  'JP',
  'CN',
  'ES',
  'RUS',
];

class MobileOrTablet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countryActive: countryList[0],
    };
    this.isCountryActivated = ::this.isCountryActivated;
  }

  componentDidMount() {
    const appContainer = document.getElementById('app');
    appContainer.style.backgroundColor = '#161616';
  }

  isCountryActivated(countryName) {
    return this.state.countryActive === countryName;
  }

  render() {
    return (
      <div className="container mobile-tablet">
        <div className="row">
          <div className="col-lg-12">
            <div className="chooseLanguage">
              {/*{*/}
                {/*countryList.map((item, index) => (*/}
                  {/*<div*/}
                    {/*key={index}*/}
                    {/*className={`countryName ${this.isCountryActivated(item) ? 'countryActive' : ''}`}*/}
                  {/*>*/}
                    {/*{item}*/}
                  {/*</div>)*/}
                {/*)*/}
              {/*}*/}
            </div>
          </div>
          <div className="col-lg-12 text-center">
            <img className="img-fluid imageHeader" src={onlyMobileTabletSVG} alt="ninja" />
            <h1>Anonymous Peer-to-Peer Prediction Exchange</h1>
          </div>
          <div className="col-lg-12 text-center">
            <p>
              The Ninja network is only accessible via mobile.
              <br/>
              Open <span className="website">www.ninja.org</span> on your mobile browser to gain anonymous entry.
              <br />
              <span className="whiteColor">No download needed. No sign up required.</span>
            </p>
          </div>
          <div className="col-lg-12">
            <div>
              <ul>
                <li>
                  <img src={shurikenIcon} /> Read the <a href={whitePaperLink} target="_blank">whitepaper</a>
                </li>
                <li>
                  <img src={shurikenIcon} /> We answered your <a href="/faq">FAQ</a>
                </li>
                <li>
                  <img src={shurikenIcon} /> Join the dojo on <a href={mediumLink} target="_blank">Telegram</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MobileOrTablet;
