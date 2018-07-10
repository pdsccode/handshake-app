import React from 'react';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconSpinner from '@/assets/images/icon/icons8-spinner.svg';
import iconChat from '@/assets/images/icon/chat-icon.svg';
import iconAvatar from '@/assets/images/icon/avatar.svg';
import iconLogoWhite from '@/assets/images/icon/logo-white.svg';
import iconInfo from '@/assets/images/icon/icons8-info_filled.svg';
import iconPhone from '@/assets/images/icon/icon-phone.svg';
import iconStar from '@/assets/images/icon/icon-star.svg';
import './FeedMe.scss';
import './FeedMeCash.scss';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import { formatAmountCurrency, formatMoneyByLocale } from '@/services/offer-util';
import { upperFirst } from 'lodash';

class FeedMeCash extends React.PureComponent {
  handleClickMoreInfo = () => {
    console.log('click more info');
    const {
      onShowModalDialog, phone, phoneDisplayed, review, reviewCount,
    } = this.props;
    onShowModalDialog({
      show: true,
      modalContent: (
        <div className="modal-more-info-content">
          <button className="button-close" onClick={() => onShowModalDialog({ show: false })}>&times;</button>
          <div className="d-table w-100">
            <div className="d-table-cell align-middle" style={{ width: '50px' }}><img src={iconLogoWhite} width="35px" /></div>
            <div className="d-table-cell align-middle"><span className="heading-text">Information</span></div>
          </div>
          <hr className="line-hr" />

          {
            phone && phone.split('-')[1] !== '' && ( // no phone number
              <div className="d-table w-100">
                <div className="d-table-cell align-middle" style={{ width: '50px' }}>
                  <img src={iconPhone} width="35px" />
                </div>
                <div className="d-table-cell align-middle">
                  <div className="label-modal-more-info">Phone</div>
                  <div className="phone-number"><a href={`tel:${phoneDisplayed}`} >{phoneDisplayed}</a></div>
                </div>
              </div>
            )
          }

          <div className="d-table w-100 mt-3">
            <div className="d-table-cell align-middle" style={{ width: '50px' }}>
              <img src={iconStar} width="35px" />
            </div>
            <div className="d-table-cell align-middle">
              <div className="label-modal-more-info">Reviews</div>
              <div className="phone-number">
                <StarsRating className="d-inline-block" starPoint={review} startNum={5} />
                <span className="ml-2">({reviewCount} reviews)</span>
              </div>
            </div>
          </div>

        </div>
      ),
      propsModal: {
        className: 'modal-me-cash-more-info',
      },
    });
  };

  render() {
    const {
      statusText, message, isCreditCard,
      showChat, chatUsername,
      nameShop,
      address, messageMovingCoin,
      actionButtons,
      amount,
      fiatAmount,
      currency,
      fiatCurrency,
    } = this.props;
    console.log('thisss', this.props);
    return (
      <div className="feed-me-cash">
        <div>
          <div className="d-inline-block">
            <div className="status">{statusText}</div>
            <div className="status-explanation">{messageMovingCoin}</div>
          </div>
          <div className="countdown float-right">
            <img src={iconSpinner} width="14px" />
            <span className="ml-1">16:05:07</span>
          </div>
        </div>
        <div className="order-type">{message}</div>
        <div className="info-wrapper">
          <div className="label">Cash inventory</div>
          <div className="price">{`${formatMoneyByLocale(fiatAmount, fiatCurrency)} ${fiatCurrency}`}</div>
        </div>
        <div className="info-wrapper">
          <div className="label">Coin inventory</div>
          <div className="price">{`${formatAmountCurrency(amount)} ${currency}`}</div>
        </div>
        <hr className="hrLine" />
        <div className="d-table w-100">
          <div className="d-table-cell align-middle" style={{ width: '42px' }}>
            <img src={iconAvatar} width="35px" alt="" />
          </div>
          <div className="d-table-cell align-middle address-info">
            <div>{nameShop}</div>
            <div
              className="text-truncate d-inline-block"
              style={{ maxWidth: '120px' }}
            >
              {address}
            </div>
          </div>
          <div className="d-table-cell text-right align-middle">
            <button
              className="d-inline-block p-0"
              onClick={this.handleClickMoreInfo}
            >
              <img src={iconInfo} width="35px" />
            </button>
          </div>

          {
            !isCreditCard && showChat && (
              <div
                className="d-table-cell text-right align-middle"
                style={{ width: '50px' }}
              >
                <button className="d-inline-block p-0">
                  <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
                    <img src={iconChat} width="35px" />
                  </Link>
                </button>
              </div>
            )
          }
        </div>
        {actionButtons}
      </div>
    );
  }
}

export default FeedMeCash;
