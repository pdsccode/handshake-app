import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { showAlert } from "@/reducers/app/action";
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from "react-intl";
// import VideoYoutube from '@/components/core/controls/VideoYoutube';
//
// import playVideoButton from '@/assets/images/ninja/play-video-button.svg';
// import videoLeftCover from '@/assets/images/ninja/video-left-cover.jpg';
// style
import "./Cash.scss";
import tradeCoinExchangeRussia from "@/assets/images/icon/landingpage/trade-coin-exchange-russia.svg";
import tradeThirdContainer from "@/assets/images/icon/landingpage/trade-third-container.svg";
import ExpandArrowSVG from "@/assets/images/icon/expand-arrow-white.svg";
import iconLogo from "@/assets/images/landing/cash/logo.svg";
import iconBox from "@/assets/images/landing/cash/icon-box.svg";
import iconChart from "@/assets/images/landing/cash/icon-chart.svg";
import iconLock from "@/assets/images/landing/cash/icon-lock.svg";
import iconStar from "@/assets/images/landing/cash/icon-star.svg";

class Collapse extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true
    };
    this.toggle = ::this.toggle;
  }

  toggle() {
    this.setState(state => ({ isCollapsed: !state.isCollapsed }));
  }

  render() {
    const { isCollapsed } = this.state;
    const { label, content, isList, index } = this.props;
    return (
      <div className="collapse-custom">
        <div className="head" onClick={this.toggle}>
          <div className="label">
            <div className="index">
              {index}
              {index > 9 ? "." : ". "}
            </div>
            <div>{label}</div>
          </div>
          <div className="extend">
            <img
              className={isCollapsed ? "rotate" : ""}
              src={ExpandArrowSVG}
              alt="arrow"
            />
          </div>
        </div>
        <div
          className={`content ${isList ? "" : "noList"} ${
            !isCollapsed ? "" : "d-none"
          }`}
        >
          {isList ? (
            <dl>
              {content.map((item, index) => [
                <dt>{item.title}</dt>,
                <dd>{item.content}</dd>
              ])}
            </dl>
          ) : (
            content
          )}
        </div>
      </div>
    );
  }
}

// import background from '@/assets/images/landing/cash/bg.svg';
const features = [
  {
    icon: iconStar,
    msg: <FormattedMessage id="ex.landing.features.label.1" />
  },
  {
    icon: iconLock,
    msg: <FormattedMessage id="ex.landing.features.label.2" />
  },
  {
    icon: iconBox,
    msg: <FormattedMessage id="ex.landing.features.label.3" />
  },
  {
    icon: iconChart,
    msg: <FormattedMessage id="ex.landing.features.label.4" />
  }
];

const menuItems = [
  {
    txt: <FormattedMessage id="ex.landing.menu.about" />,
    url: "#"
  },
  {
    txt: <FormattedMessage id="ex.landing.menu.blog" />,
    url: "#"
  },
  {
    txt: <FormattedMessage id="ex.landing.menu.faq" />,
    url: "#"
  },
  {
    txt: <FormattedMessage id="ex.landing.menu.contact" />,
    url: "#"
  }
];

class Handshake extends React.Component {
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="landing-page-cash">
        <div className="container navigation-bar mb-4 py-3">
          <div className="row">
            <div className="col">
              <a href="/">
                <img src={iconLogo} />
              </a>
              <div className="menu float-right">
                {menuItems.map((item, index) => {
                  const { txt, url } = item;
                  return (
                    <a key={index} href={url} className="item-menu">
                      {txt}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="container video-intro mb-5">
          <div className="row">
            <div className="col">
              <div className="label-1">
                <FormattedMessage id="ex.landing.intro.label.1" />
              </div>
              <div className="label-2">
                <FormattedMessage id="ex.landing.intro.label.2" />
              </div>
              <div className="youtube-video mt-5">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/YYZJlLDzeEs?rel=0&amp;showinfo=0"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container description mb-5">
          <div className="row">
            <div className="col">
              <div className="label-1">
                <FormattedHTMLMessage id="ex.landing.description.label.1" />
              </div>
              <div className="label-2">
                <FormattedHTMLMessage id="ex.landing.description.label.2" />
              </div>
            </div>
          </div>
        </div>
        <div className="container features mb-5">
          <div className="row">
            {features.map((feature, index) => {
              const { icon, msg } = feature;
              return (
                <div key={index} className="col">
                  <div>
                    <img src={icon} />
                  </div>
                  <div className="txt">{msg}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container join-telegram mb-5">
          <div className="row">
            <div className="col">
              <div className="text-try-telegram mb-2">
                <FormattedMessage id="ex.landing.tryTelegram.label" />
              </div>
              <div className="text-center">
                <button className="btn btn-join-telegram">
                  <FormattedMessage id="ex.landing.tryTelegram.btn" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`container thirdContainer`}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <img
                src={
                  locale === "ru"
                    ? tradeCoinExchangeRussia
                    : tradeThirdContainer
                }
                alt="third container"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
        {/*
        <div className={`container fourContainer text-center`}>
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={paymentMethodIcon} height={80} />
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_THIRD_BOX_1.title}</p>
              <p className="description">{messages.COIN_EXCHANGE_LP_THIRD_BOX_1.description}</p>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={fastAnOnIcon} width={80} height={80} />
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_THIRD_BOX_2.title}</p>
              <p className="description">{messages.COIN_EXCHANGE_LP_THIRD_BOX_2.description}</p>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={safeIcon} width={70} height={80} />
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_THIRD_BOX_3.title}</p>
              <p className="description">{messages.COIN_EXCHANGE_LP_THIRD_BOX_3.description}</p>
            </div>
          </div>
        </div>
        */}
        <div className={`container fiveContainer`}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_FAQ_TITLE}</p>
              <div>
                {messages.COIN_EXCHANGE_LP_FAQ.map((item, index) => (
                  <Collapse
                    label={item.question}
                    content={item.answer}
                    isList={item.isList}
                    key={index}
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Handshake.propTypes = {
  showAlert: PropTypes.func.isRequired
};

const mapDispatch = {
  showAlert
};

export default injectIntl(connect(null, mapDispatch)(Handshake));
