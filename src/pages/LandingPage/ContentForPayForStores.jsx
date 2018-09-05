import React from "react";
import imgBTC from '@/assets/images/landing/wallet/btc.svg';
import imgLTC from '@/assets/images/landing/wallet/ltc.svg';
import imgETH from '@/assets/images/landing/wallet/eth.svg';
import imgXRP from '@/assets/images/landing/wallet/xrp.svg';
import imgZEC from '@/assets/images/landing/wallet/zec.svg';
import imgIPHONE from '@/assets/images/landing/wallet/iphone1.png';
import img1 from '@/assets/images/landing/wallet/1.png';
import imgPromo1 from '@/assets/images/landing/wallet/promo-1.png';
import imgLock from '@/assets/images/landing/wallet/lock-solid.svg';
import imgCheck from '@/assets/images/landing/wallet/check-solid.svg';

import './ContentForPayForStores.css';
import './ContentForPayForStores.scss';
const PayForStores = () => (

  <div className="content-for-wallet position-relative">
    <div class="position-relative">
      <section class="section section-lg section-shaped  main-screenc">
        <div class="container py-lg-md d-flex">
          <div class="col px-0">
            <div class="row">
              <div class="col-lg-6 offset-lg-4">
                <h1 class="display-3  text-white">Pay for Stores</h1>
                <p class="text-white">We want the millions of people around the world who are holding cryptocurrency to be able to use it in their everyday lives. </p>
                <p class="text-white">With more people accepting cryptocurrency as a payment method, Pay for Stores brings mass adoption one step closer, now.</p>
                <div class="btn-wrapper">
                  <p class="text-white">Connect with the ever growing number of cryptocurrency users worldwide.</p>
                  <a href="https://ninja.org/wallet" class="btn btn-white btn-icon mb-3 mb-sm-0">
                    <span class="btn-inner--text">Get Pay for Stores</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="separator separator-bottom separator-skew">
          <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <polygon class="fill-white" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
    </div>
    <section class="section section-lg section-nucleo-icons pb-50">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-md-6 order-md-2">
            <img width="250" src="assets/img/theme/iphone2.png" class="img-fluid " />
          </div>
          <div class="col-md-6 order-md-1">
            <div class="pr-md-5">
              <h3>The whats</h3>
              <p>Pay for Stores has been tailor made for offline retailers and businesses, to help seamlessly integrate cryptocurrency payments into their business.</p>
              <p>Through scanning the store’s QR code the customer will be directed to Ninja Wallet, where they can confirm the outgoing payment. Yep, that’s it!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section bg-secondary pt-lg pb-lg">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-md-6">
            <img width="500" src="assets/img/theme/coffee-shop.png" class="img-fluid" />
          </div>
          <div class="col-md-6">
            <div class="pl-md-5">
              <h3>The why</h3>
              <p>We wanted to make it easier for <b>everyone</b> to accept and use cryptocurrency payments.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section pb-lg bg-blue1">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-md-6 order-lg-2 ml-lg-auto">
            <div class="position-relative pl-md-5">
              <img src="assets/img/brand/scanqrcode.jpg" class="img-fluid" />
            </div>
          </div>
          <div class="col-lg-6 order-lg-1  pb-100">
            <div class="d-flex">
              <div class="">
                <h4 class="display-3 text-white">The hows </h4>
                <p class="text-white">Integrating Pay for Stores into your business is effortless.</p>
                <p class="text-white">All you need is:</p>
                <p class="text-white">QR Codes<br/>Links to Ninja Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-white" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </section>
    <section class="section section-lg pt-150 pb-150">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h2 class="display-3">The costs</h2>
            <p>Spend less money on fees, and much more on fun. </p>
            <p>Pay for Stores has no setup fees and no monthly costs.</p>
            <div class="btn-wrapper">
            <p>For all things Ninja</p>
              <a target="_blank" href="https://t.me/ninja_org" class="btn btn-primary mb-3 mb-sm-0">Join us on Telegram</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
);

export default PayForStores;
