import React from "react";
import Feed from '@/components/core/presentation/Feed/Feed';
import {Link} from "react-router-dom";
import Rate from '@/components/core/controls/Rate';

import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
import iconChat from '@/assets/images/icon/icons8-chat.svg';
import iconPhone from '@/assets/images/icon/icons8-phone.svg';


class FeedMePresentation extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      from, email, statusText, message, isCreditCard,
      showChat, chatUsername,
      nameShop, phone , phoneDisplayed,
      address , messageMovingCoin,
      actionButtons
    } = this.props;

    console.log('FeedMePresentation', this.props);

    return (
      <div className="feed-me-exchange">
        {/* <div>id: {this.offer.id}</div> */}
        {/* <div>userType: {this.userType}</div> */}
        {/* <div>status: {status}</div> */}
        <div className="mb-1">
          <span style={{ color: '#C8C7CC' }}>{from}</span> <span style={{ color: '#666666' }}>{email}</span>
          <span className="float-right" style={{ color: '#4CD964' }}>{statusText}</span>
        </div>
        <Feed
          className="feed text-white"
          background="linear-gradient(-225deg, #EE69FF 0%, #955AF9 100%)"
        >
          <div className="d-flex mb-4">
            <div className="headline">{message}</div>
            {
              !isCreditCard && showChat && (
                <div className="ml-auto pl-2 pt-2" style={{ width: '50px' }}>                {/* to-do chat link */}
                  <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
                    <img src={iconChat} width="35px" alt="" />
                  </Link>
                </div>
              )
            }

          </div>

          <div className="mb-1 name-shop">{nameShop}</div>
          {
            phone && phone.split('-')[1] !== '' && ( // no phone number
              <div className="media mb-1 detail">
                <img className="mr-2" src={iconPhone} width={20} alt="" />
                <div className="media-body">
                  <div><a href={`tel:${phoneDisplayed}`} className="text-white">{phoneDisplayed}</a></div>
                </div>
              </div>
            )
          }
          {
            address && (
              <div className="media mb-1 detail">
                <img className="mr-2" src={iconLocation} width={20} alt="" />
                <div className="media-body">
                  <div>{address}</div>
                </div>
              </div>
            )
          }
          { messageMovingCoin && (<div className="mt-2">{messageMovingCoin}</div>) }
        </Feed>
        {actionButtons}
        <Rate onRef={e => this.rateRef = e} startNum={5} onSubmit={this.handleSubmitRating} ratingOnClick={this.handleOnClickRating} />
      </div>
    );
  }
}

export default FeedMePresentation;
