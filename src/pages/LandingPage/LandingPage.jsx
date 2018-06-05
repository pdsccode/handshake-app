/**
 * Handshake component.
 */
import React from 'react';
// service

// style
import './LandingPage.scss';
import ninjaIcon from '@/assets/images/icon/landingpage/ninja.svg';
import telegramAppIcon from '@/assets/images/icon/landingpage/telegram_app.svg';
import blockchainDescriptionImage from '@/assets/images/icon/landingpage/chart-discount-time.svg';
import shakeNinjaText from '@/assets/images/icon/landingpage/shakeninjatext.svg';
import arrowsRightIcon from '@/assets/images/icon/landingpage/arrows_long_right.svg';

class Handshake extends React.Component {
  constructor(props) {
    super(props);
    this.injectFontPage = this.injectFontPage.bind(this);
  }

  componentDidMount() {
    if (window.addEventListener)
      window.addEventListener('load', this.injectFontPage, false);
    else if (window.attachEvent)
      window.attachEvent('onload', this.injectFontPage);
    else window.onload = this.injectFontPage;
  }

  componentWillReceiveProps() {
    this.injectFontPage();
  }

  injectFontPage() {
    if (!document.getElementById('anonymous-pro')) {
      const PoppinsElement = document.createElement('link');
      PoppinsElement.id = 'anonymous-pro';
      PoppinsElement.href = 'https://use.typekit.net/qow3iea.css';
      PoppinsElement.rel = 'stylesheet';
      document.body.appendChild(PoppinsElement);
    }
    if (!document.getElementById('azo-sans')) {
      const AzoSansElement = document.createElement('link');
      AzoSansElement.id = 'azo-sans';
      AzoSansElement.href = 'https://use.typekit.net/nfr2whb.css';
      AzoSansElement.rel = 'stylesheet';
      document.body.appendChild(AzoSansElement);
    }
  }

  render() {
    return (
      <div className="root">
        <div className="banner">
          <div className={`container mainContent`}>
            <div className={`row rowEqHeight`}>
              <div className="col-lg-6 col-md-12 d-none d-lg-block">
                {/*<img src={appScreenIcon} alt="app screen" className={`img-fluid ${s.appScreen}`} />*/}
                <div className="appScreen">
                   {/*<video src={appScreenVideo} autoPlay="autoplay" loop="loop" muted="muted" className={s.appScreenVideo} />*/}
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div className="headerLandingpage">
                  <img src={ninjaIcon} alt="ninja icon" />
                  <div>
                    <img src={shakeNinjaText} alt="ninja text icon" />
                    <p>ANONYMOUS PEER-TO-PEER BETTING EXCHANGE</p>
                  </div>
                </div>
                <h1>Meet <span className="blue">Shuriken</span>, the native coin of the Ninja network.</h1>
                <p className="subTitle">
                  You can use Shuriken to pay for any fees on the Ninja network such as betting fees, exchange fees, and market creation fees.
                  <br/>
                  <br/>
                  Paying with Shuriken allows you to slash fees and unlock the best rates.
                </p>
                <a
                  className="readTheWhitePaper"
                  href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8"
                >
                  <span>Read the whitepaper</span>
                  <img src={arrowsRightIcon} alt="arrow right icon" />
                </a>
                <p className="telegramDescription">
                  Coming soon.  To receive updates on token sales and airdrops:
                </p>
                <a href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww" target="_blank" className="btnTelegram" onClick={
                  () => { ga('send', 'event', 'ShakeNinja', 'Click button Join the conversation on telegram'); }}
                >
                  <img src={telegramAppIcon} alt="telegram app icon" />
                  <span>Join the conversation on telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={`container blockChainContent`}>
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <h3>Slash fees.</h3>
              <p className="text-left">Early adopters of Shuriken will benefit from large discounts on all the network fees. 2018 users will
                receive a <span className="green">100% discount and play completely free</span>. Preferred pricing will end in 2023. Shuriken is an
                ERC20 token and tradable on the blockchain. There will only be 100 million Shurikens. Ninja’s oath.</p>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
              <img src={blockchainDescriptionImage} alt="block chain description image" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className={`container text-center countdownBlock`}>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h3>Get Shuriken. Play for free.</h3>
              <a href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww" target="_blank" className="btnTelegram" onClick={
                () => { ga('send', 'event', 'ShakeNinja', 'Click button Join the nobody network of everybody'); }
              }>
                <img src={telegramAppIcon} alt="telegram app icon" />
                <span>Join Telegram channel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Handshake;
