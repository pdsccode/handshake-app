/**
 * Handshake component.
 */
import React from 'react';
// service

// style
import './LandingPage.scss';
import ninjaIcon from '@/assets/images/icon/landingpage/ninja.svg';
import telegramAppIcon from '@/assets/images/icon/landingpage/telegram_app.svg';
import blockchainDescriptionImage from '@/assets/images/icon/landingpage/blockchain_description_image.svg';
import shakeNinjaText from '@/assets/images/icon/landingpage/shakeninjatext.svg';

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
                    <p>DECENTRALIZED BETTING EXCHANGE</p>
                  </div>
                </div>
                <h1>Bet against your <br /> fellow ninjas.</h1>
                <p className="subTitle">Create your own odds and bet directly with anyone who thinks you’re wrong. No bookies, books, or ridiculous margins. Win cryptocurrencies.</p>
                <p className="telegramDescription">
                  <strong>As a ninja,</strong> <span className="orange">you are 100% anonymous</span>. <br />
                  No downloads. No sign ups.
                </p>
                <a href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww" target="_blank" className="btnTelegram" onClick={
                  () => { ga('send', 'event', 'ShakeNinja', 'Click button Join our secret channel'); }}
                >
                  <img src={telegramAppIcon} alt="telegram app icon" />
                  <span>Join our secret channel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={`container text-center blockChainContent`}>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h3>Built on <span>blockchain technologies</span></h3>
              <p>Shake Ninja is a decentralized prediction exchange that runs smart contracts, ensuring that all agreements happen exactly as agreed. In short: <span className="green">no fraud, no cheating, no flakes.</span></p>
              <img src={blockchainDescriptionImage} alt="block chain description image" className="img-fluid" />
            </div>
          </div>
        </div>
        {/*<div className={`container text-center countdownBlock`}>*/}
          {/*<div className="row">*/}
            {/*<div className="col-md-12 col-sm-12 col-xs-12">*/}
              {/*<h3>Find your perfect match</h3>*/}
              {/*<p className="countDownSubTitle">Shake on the blockchain, Shake like a Ninja. Kick off the first game and snap up the best pools.</p>*/}
              {/*<div className={`countDown text-center`}>*/}
                {/*<p className="countDownTitle">Shake Ninja is live on the testnet.</p>*/}
                {/*<CountdownTimer endDate={moment('06/06/2018 23:59:59', 'DD/MM/YYYY hh:mm:ss')} afterCountFinish={() => {}} />*/}
              {/*</div>*/}
              {/*<a href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww" target="_blank" className="btnTelegram" onClick={*/}
                {/*() => { ga('send', 'event', 'ShakeNinja', 'Click button Join the nobody network of everybody'); }*/}
              {/*}>*/}
                {/*<img src={telegramAppIcon} alt="telegram app icon" />*/}
                {/*<span>Join the nobody network of everybody</span>*/}
              {/*</a>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default Handshake;
