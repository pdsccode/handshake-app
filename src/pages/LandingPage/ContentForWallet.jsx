import React from "react";
import imgNinjawallet from '@/assets/images/landing/pay-for-devs/ninja-wallet.png';
import imgAnywhere from '@/assets/images/landing/pay-for-devs/anywhere.png';
import imgChargeBack from '@/assets/images/landing/pay-for-devs/chargeback.png';
import imgFastPayments from '@/assets/images/landing/pay-for-devs/fast-payments.svg';
import imgSaveMoney from '@/assets/images/landing/pay-for-devs/save-money.svg';
import imgSimpleUse from '@/assets/images/landing/pay-for-devs/simple-use.svg';
import imgBgWhy from '@/assets/images/landing/pay-for-devs/bg-why.png';

import './ContentForWallet.scss';
const Wallet = () => (

  <div className="content-for-wallet">
    <div className="position-relative">
      <section className="section section-lg section-shaped">
        <div className="shape shape-style-1 shape-default">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="container py-lg-md d-flex">
          <div className="col px-0">
            <div className="row">
              <div className="col-lg-6">
                <h1 className="display-3  text-white">Ninja Wallet</h1>
                <p className="text-white">No downloads. No signups. No fees.<br/>A decentralized cryptocurrency wallet that lets you stay 100% anonymous.</p>
                <div className="btn-wrapper">
                  <p className="text-white">Access Ninja Wallet on your mobile browser</p>
                  <a href="https://ninja.org/wallet" className="btn btn-white btn-icon mb-3 mb-sm-0">
                    <span className="btn-inner--text">Try now!</span>
                  </a>
                </div>
              </div>
              <div className="col-lg-6 main-screen text-center">
                <img width="300" src="assets/img/brand/iphone1.png" />
              </div>
            </div>
          </div>
        </div>
        <div className="separator separator-bottom separator-skew">
          <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
    </div>

    <section className="section section-lg   section-nucleo-icons pb-50">
      <div className="container">
        <div className="row row-grid align-items-center">
          <div className="col-md-6 order-md-2">
            <div className="icons-container mt-5 on-screen" data-toggle="on-screen">
              <i className="icon floating"><img src="assets/img/icons/btc.svg" /></i>
              <i className="icon floating"><img src="assets/img/icons/xrp.svg" /></i>
              <i className="icon floating"><img src="assets/img/icons/eth.svg" /></i>
              <i className="icon floating"><img src="assets/img/icons/zec.svg" /></i>
              <i className="icon floating"><img src="assets/img/icons/ltc.svg" /></i>
            </div>
          </div>
          <div className="col-md-6 order-md-1">
            <div className="pr-md-5">
              <h3>Hold multiple cryptocurrencies with a decentralized wallet </h3>
              <p>Ninja Wallet - free, no downloads, no sign ups, and no KYC. Allowing users to remain 100% anonymous, with all transactions secured on the blockchain.</p>
              <p>It currently supports BTC, ETH, BCH, ERC20 tokens, and ERC721 collectibles such as CryptoKitties, CryptoStrikers, CryptoPunks. The currencies XRP, ZEC, LTC… and more will be added soon.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="section bg-secondary pt-lg pb-lg">
      <div className="container">
        <div className="row row-grid align-items-center">
          <div className="col-md-7 transform-perspective-left">
              <img src="assets/img/theme/promo-1.png" className="img-fluid" />
          </div>
          <div className="col-md-5">
            <div className="pl-md-5">
              <h3>Multiple wallets </h3>
              <p>Quickly create, import and manage personal, business and testnet wallets in one secure location.</p>
              <p>We use hierarchical deterministic (HD) address generation for secure in-app wallet generation and back up.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="section pb-lg bg-gradient-default">
      <div className="container">
        <div className="row row-grid align-items-center">
          <div className="col-md-6 order-lg-2 ml-lg-auto">
            <div className="position-relative pl-md-5">
              <img src="assets/img/theme/1.png" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-6 order-lg-1  pb-100">
            <div className="d-flex">

              <div className="">
                <h4 className="display-3 text-white">All storage is on your device</h4>
                <p className="text-white">We want to ensure that our customers have a secure and private experience when using our wallet. That is why we don’t store any of your personal information, private keys, or data on our servers.</p>

              </div>
            </div>

            <div className="card shadow shadow-lg--hover mt-5">
              <div className="card-body">
                <div className="d-flex px-3">
                  <div>
                    <div className="icon icon-shape bg-gradient-warning rounded-circle text-white">
                      <i className="fa fa-lock" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="pl-4">
                    <p>Ninja Wallet uses device-based security. All private keys are stored locally on your device.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </section>
    <section className="section section-lg pt-150 pb-150">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h2 className="display-3">Don’t forget to backup your wallet</h2>
            <p className="lead text-muted">Keep your cryptocurrencies and crypto assets safe and make sure you backup your Ninja Wallet as soon as you create one.</p>
            <div className="btn-wrapper">
              <a target="_blank" href="https://medium.com/@ninja_org/how-to-back-up-your-ninja-wallet-its-really-quite-easy-d98a5ec1a671" className="btn btn-primary mb-3 mb-sm-0">Learn how to backup your wallet</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section section-lg bg-gradient-warning pt-150 pb-150">
      <div className="container pb-50">
        <div className="row text-center justify-content-center">
          <div className="col-lg-10">
            <h2 className="display-3 text-white">More features of Ninja Wallet</h2>


            <ul className="list-unstyled offset-md-2">
                <li className="py-2">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="badge badge-circle">
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Backup and restore wallet using standard BIP39 recovery phrases</h6>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="badge badge-circle">
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Payment gateway by Cryptocurrency </h6>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="badge badge-circle ">
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Configure gas price, gas</h6>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="badge badge-circle ">
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Push notifications</h6>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="badge badge-circle">
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">20+ currency conversion rates</h6>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="badge badge-circle">
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Paper wallet sweep import</h6>
                    </div>
                  </div>
                </li>
              </ul>
          </div>
        </div>
      </div>
      <div className="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </section>


    <section className="section section-lg">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h2 className="display-3">FAQ</h2>
            <div id="accordion">
              <div className="card">
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0  text-left">
                    <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      What is Ninja Wallet?
                    </button>
                  </h5>
                </div>

                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                  <div className="card-body text-left">
                    Ninja Wallet is a decentralized cryptocurrency wallet, that allows you to hold multiple cryptocurrencies. There are no downloads,  no sign ups and no fees.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingTwo">
                  <h5 className="mb-0  text-left">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      How many cryptocurrencies can I use with Ninja Wallet?
                    </button>
                  </h5>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                  <div className="card-body  text-left">
                    You can use BTC, BCH, ETH, ZEC, LTC, XRP, ERC20 Tokens and ERC721 Collectables

                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header" id="headingThree">
                  <h5 className="mb-0  text-left">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      How much does it cost to use?
                    </button>
                  </h5>
                </div>
                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                  <div className="card-body  text-left">
                Ninja Wallet is open source and free for all users
                </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header" id="headingFour">
                  <h5 className="mb-0  text-left">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                     How do I create an account?
                    </button>
                  </h5>
                </div>
                <div id="collapseFour" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                  <div className="card-body  text-left">
               You simply go to our website <a href="https://www.ninja.org/wallet">www.ninja.org/wallet</a>
It will auto creates your wallet BTC, ETH etc on your device. Or you can import/restore you have.

                </div>
                </div>
              </div>


              <div className="card">
                <div className="card-header" id="headingFive">
                  <h5 className="mb-0  text-left">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                      What countries can I use Ninja Wallet in?
                    </button>
                  </h5>
                </div>
                <div id="collapseFive" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                  <div className="card-body  text-left">
                Ninja Wallet is available globally - all you need is access to a mobile device and the internet.
                </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header" id="headingSix">
                  <h5 className="mb-0  text-left">
                    <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix text-left">
                      What happens if I swap/lose my phone? Will I lose my wallet?

                    </button>
                  </h5>
                </div>
                <div id="collapseSix" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                  <div className="card-body  text-left">
                    We recommend all users backup their wallets as soon as they start using Ninja. We have explained how to backup your Ninja Wallet <a target="_blank" href="https://medium.com/@ninja_org/how-to-back-up-your-ninja-wallet-its-really-quite-easy-d98a5ec1a671">here</a>.
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
);

export default Wallet;
