import React from 'react';
import { injectIntl } from 'react-intl';

import './ContentForPexInstruction.scss';

import iconCard from '@/assets/images/landing/cash-for-business/card.svg';
import iconEarnMore from '@/assets/images/landing/cash-for-business/earn-more-customers.svg';
import iconIphone from '@/assets/images/landing/cash-for-business/iphone.svg';
import iconLine from '@/assets/images/landing/cash-for-business/line.svg';
import iconMinimumEffort from '@/assets/images/landing/cash-for-business/minimum-effort.svg';
import iconSteadyIncome from '@/assets/images/landing/cash-for-business/steady-income.svg';


class ContentForPexInstruction extends React.Component {
  renderIntroduce() {
    return (
      <div className="wrapperPexIntroducer">
        <h1 className="font-weight-bold">Getting Started with Ninja Prediction Exchange.</h1>
        <p className="mt-3">Hello!</p>
        <p>Cian here from the Prediction team. We’ve built the world a shiny new prediction exchange.</p>
        <p>If you’re thinking, <i>‘That’s great and all. But, how does it work and where do I start?’</i></p>
        <p>You’ve landed in the right place.</p>
        <p>In this piece, we’ll cover everything to help you get started with <strong>Prediction</strong>.</p>
      </div>
    );
  }
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="wrapperContentPexInstruction mt-5">
        <div className="row mt-5">
          <div className="col">
            {this.renderIntroduce()}
            <h3 className="font-weight-bold">How does the Prediction Exchange work?</h3>
            <p><strong>Prediction</strong> is a electronic prediction system that allows any two anonymous parties from anywhere in the world to bet directly against each other without the need for a trusted third party.</p>
            <p>It’s been designed so anyone, anywhere can easily place bets and create their own markets.</p>
            <p><strong>ICE.</strong></p>
            <p><strong>BROKEN.</strong></p>
            <p><strong><i>Now let’s get you up and running.</i></strong></p>
            <h3 className="font-weight-bold">Step 1: Play with Ether or Bitcoin</h3>
            <p>If you have already have Ether or Bitcoin, you can just transfer it straight from your wallet into our in-app one.</p>
            <div>
              <img src="https://cdn-images-1.medium.com/max/800/1*RaVlNRW1a9DPkW9bmEUgSQ.png" width="33%" />
              <img src="https://cdn-images-1.medium.com/max/800/1*GhS52cbUKPpM03rSJQiykQ.png" width="33%" />
              <img src="https://cdn-images-1.medium.com/max/800/1*CflUyUVua_LnRgrV3M5Kmg.png" width="33%" />
            </div>
            <br />
            <p>No problem if you don’t, you can buy some directly in-app with your credit card.</p>
            <div>
              <img src="https://cdn-images-1.medium.com/max/1200/1*GhS52cbUKPpM03rSJQiykQ.png" width="50%" />
              <img src="https://cdn-images-1.medium.com/max/1200/1*8oWKidEY3Chcd6kaJiU2vg.png" width="50%" />
            </div>
            <p>Or you can also use popular coin exchanges like <a target="__blank" className="landing-link" href="https://www.coinbase.com/">Coinbase</a> or <a className="landing-link" target="__blank" href="https://www.binance.com">Binance</a>.</p>
            <h3 className="font-weight-bold">Step 2: Top up your Wallet.</h3>
            <p>You can top up funds by transferring your coin into the in-app Wallet. It’s completely decentralized and the private key is held on your phone and only you can access it. Once that’s done, you’re all set to start forecasting.</p>
            <div>
              <img src="https://cdn-images-1.medium.com/max/1200/1*6FeTaLo2_H_syZkskqAAfA.png" width="50%" />
              <img src="https://cdn-images-1.medium.com/max/1200/1*89pdFA-zod73a94CwqzoWw.png" width="50%" />
            </div>

            <h3 className="font-weight-bold">Step 3: Place a bet.</h3>
            <p>First, pick a market (i.e. Man. City— Newcastle), the outcome (Man. City wins) and the side (support or bet against the outcome).</p>
            <div>
              <img src="https://cdn-images-1.medium.com/max/1200/1*E5zwqplJ5b2fUrs-uLMAlA.png" width="50%" />
              <img src="https://cdn-images-1.medium.com/max/1200/1*BTUNagXRRoL0V95gNBPipQ.png" width="50%" />
            </div>
            <br />
            <p>Then enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 3/1).</p>
            <p><strong>Example</strong>: The odds 3/1 means you could win 3 ETH for every 1 ETH you put down.</p>
            <p>The stake will be put into an escrow smart contract. The <strong>Prediction Matching Engine</strong> will then find another user to bet against the odds you’ve set.</p>
            <p><a target="__blank" className="landing-link" href="https://www.youtube.com/watch?v=fvjpNkvbQdQ&t=1m34s">Check out our video for more information on the odds and the simple and advanced options.</a></p>
            <h3 className="font-weight-bold">Step 4: Wait for the result.</h3>
            <p>Once the event ends, the reporter of the market will report the result within the reporting window (set by the market creator).</p>
            <div>
              <img src="https://cdn-images-1.medium.com/max/1200/1*LcIPVZDZpLDXLsi7vCFEoQ.png" />
            </div>
            <br />
            <p>Generally, you should expect to have the report within minutes. If you win, your winnings will be automatically transferred from the escrow smart contract to your account.</p>
            <p>And that’s it!</p>
            <p>Easy huh?</p>
            <p><strong>Happy forecasting Ninjas!</strong></p>
            <p>Check out <a target="__blank" className="landing-link" href="https://ninja.org/prediction">ninja.org/prediction</a> on your mobile</p>
            <p>Connect with us on telegram: <a target="__blank" className="landing-link" href="https://t.me/ninja_org">http://t.me/ninja_org</a></p>
          </div>
        </div>
      </div>
    );
  }
}

ContentForPexInstruction.propTypes = {};

export default injectIntl(ContentForPexInstruction);
