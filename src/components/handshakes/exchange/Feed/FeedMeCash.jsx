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

class FeedMeCash extends React.PureComponent {
  handleClickMoreInfo = () => {
    console.log('click more info');
    const { onShowModalDialog } = this.props;
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

          <div className="d-table w-100">
            <div className="d-table-cell align-middle" style={{ width: '50px' }}>
              <img src={iconPhone} width="35px" />
            </div>
            <div className="d-table-cell align-middle">
              <div className="label-modal-more-info">Phone</div>
              <div className="phone-number">01225511558</div>
            </div>
          </div>

          <div className="d-table w-100 mt-3">
            <div className="d-table-cell align-middle" style={{ width: '50px' }}>
              <img src={iconStar} width="35px" />
            </div>
            <div className="d-table-cell align-middle">
              <div className="label-modal-more-info">Reviews</div>
              <div className="phone-number">
                <StarsRating className="d-inline-block" starPoint={3.2} startNum={5} />
                <span className="ml-2">(25 reviews)</span>
              </div>
            </div>
          </div>

        </div>
      ),
      propsModal: {
        className: 'modal-me-cash-more-info'
      }
    })
  };

  render() {
    console.log('thisss', this.props);
    return (
      <div className="feed-me-cash">
        <div>
          <div className="d-inline-block">
            <div className="status">Deleting your station</div>
            <div className="status-explanation">Please wait a few minute</div>
          </div>
          <div className="countdown float-right">
            <img src={iconSpinner} width="14px" />
            <span className="ml-1">16:05:07</span>
          </div>
        </div>
        <div className="order-type">Buyer order</div>
        <div className="info-wrapper">
          <div className="label">Cash inventory</div>
          <div className="price">14,000,000,000 VND</div>
        </div>
        <div className="info-wrapper">
          <div className="label">Coin inventory</div>
          <div className="price">0.05 BTC</div>
        </div>
        <hr className="hrLine" />
        <div className="d-table w-100">
          <div className="d-table-cell align-middle" style={{ width: '42px' }}>
            <img src={iconAvatar} width="35px" alt="" />
          </div>
          <div className="d-table-cell align-middle address-info">
            <div>0x..233</div>
            <div
              className="text-truncate d-inline-block"
              style={{ maxWidth: '120px' }}
            >
              7956 Liberty Lane BakersfieldBak aw fe
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
          <div
            className="d-table-cell text-right align-middle"
            style={{ width: '50px' }}
          >
            <button className="d-inline-block p-0">
              <img src={iconChat} width="35px" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <span className="d-inline-block w-50 pr-1">
            <button className="btn btn-block btn-confirm">Confirm</button>
          </span>
          <span className="d-inline-block w-50 pl-1">
            <button className="btn btn-block btn-cancel">Cancel</button>
          </span>
        </div>
      </div>
    );
  }
}

export default FeedMeCash;
