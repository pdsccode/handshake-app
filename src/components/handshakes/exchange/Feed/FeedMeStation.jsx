import React from 'react'
import './FeedMe.scss'
import './FeedMeStation.scss'
import { URL } from '@/constants'
import { daysBetween, formatAmountCurrency, formatMoneyByLocale } from '@/services/offer-util'
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconAvatar from '@/assets/images/icon/avatar.svg';
import StarsRating from '@/components/core/presentation/StarsRating';

class FeedMeStation extends React.PureComponent {

  render () {
    // console.log('thisss', this.props);
    return (
      <div>
        <div className="feed-me-station">
          <div className="d-table w-100">
            <div className="d-table-cell">
              <div className="status">Statusss</div>
              <div className="status-explanation">Message</div>
            </div>
            <div className="countdown d-table-cell text-right">
              <img src={iconSpinner} width="14px" />
              <span className="ml-1">16:00:00</span>
            </div>
          </div>

          <div>Scrolling</div>

          <div className="d-table w-100 mt-2">
            <div className="d-table-cell align-middle" style={{ width: '42px' }}>
              <img src={iconAvatar} width="35px" alt="" />
            </div>
            <div className="d-table-cell align-middle address-info">
              <div>Shop name</div>
              <div>
                <StarsRating className="d-inline-block" starPoint={3.2} startNum={5} />
                <span className="ml-2">(25 reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 d-table w-100 station-info">
            <div className="d-table-cell align-middle label">Transaction succesfl/fail</div>
            <div className="d-table-cell align-middle text-right info">60/30</div>
          </div>
          <div className="d-table w-100 station-info">
            <div className="d-table-cell align-middle label">Transationc pending</div>
            <div className="d-table-cell align-middle text-right info">30</div>
          </div>
        </div>
        <button className="btn btn-primary btn-block">Backup</button>
      </div>
    )
  }
}

export default FeedMeStation
