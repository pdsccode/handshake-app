import React from 'react';
import { injectIntl } from 'react-intl';

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
    const { messages, locale } = this.props.intl;
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
            <h1>{messages.MOT_TITLE}</h1>
          </div>
          <div className="col-lg-12 text-center">
            <p>
              {messages.MOT_CONTENT_0}
              <br/>
              {messages.MOT_CONTENT_1} <span className="website">www.ninja.org</span> {messages.MOT_CONTENT_2}
              <br />
              <span className="whiteColor">{messages.MOT_CONTENT_3}</span>
            </p>
          </div>
          <div className="col-lg-12">
            <div>
              <ul>
                {
                  locale === 'en' && (
                    <li>
                      <img src={shurikenIcon} alt="shuriken icon" /> Jump in for <a href="/shuriken">Airdrop</a>
                    </li>
                  )
                }
                {
                  messages.MOT_LIST_CONTENT.map((item, index) => (
                    <li key={index}>
                      <img src={shurikenIcon} alt="shuriken icon" /> {item.mainContent || ''} <a href={item.link} target="_blank">{item.placeHolderLink}</a> {item.mainContent1 || ''}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(MobileOrTablet);
