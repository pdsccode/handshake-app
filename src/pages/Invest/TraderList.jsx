import React, {Component} from 'react'
import Web3 from './Web3'
import ('./TraderList.scss');
import StarRatings from 'react-star-ratings';
import ErrorBoundary from '../../components/ErrorBoundary';
const listTrading = [
    {
        id: 1,
        avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
        username: 'Booby Gabershek',
        rating: 1,
        average: -0.36,
        amount: 2000,
    },
    {
        id: 2,
        avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
        username: 'Quang Vo',
        rating: 3,
        average: 0.25,
        amount: 14567892000
    },
    {
        id: 3,
        avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg',
        username: 'Anonymous',
        rating: 3,
        average: 0.2,
        amount: 1000650
    }
];

const TraderItem = ({ avatarUrl, username, rating, average, amount, handleOnClick }) => (
    <div className="traderItem" onClick={handleOnClick}>
        <div className="userInfoBlock clearfix">
            <div className="traderItem-left">
            <img
                src={avatarUrl}
                alt=""
                className="userImage"
            />
            <label>{username}</label>
            <div className="star-ratings">
                <StarRatings
                className="stars"
                rating={rating}
                isSelectable={false}
                starDimension="14px"
                starRatedColor="#546FF7"
                starSpacing="3px"
                numberOfStars={5}
                name="rating"
                />
                <span className="rating-count">(26)</span>
            </div>
            </div>
            <div className="traderItem-right">
            <div>
                <label className={ average > 0 ? "green" : "red" }>{`${average*100}%`}</label>
                <label className="grey fontSmall">AVERAGE RETURNS</label>
            </div>
            <div>
                <label>${amount}</label>
                <label className="grey fontSmall">CUM EARNINGS</label>
            </div>
            </div>
        </div>
    </div>
);

const TraderItemBoudary = (props) => (
    <ErrorBoundary>
        <TraderItem {...props} />
    </ErrorBoundary>
);

export default class TraderList extends Component {
    
    navigateToDetail = (item) => {
        console.log(item);
        this.props.history.push(`/invest/trader/${item.id}`)
    }
    render() {
        return (
            listTrading.map((e, i) => (<TraderItemBoudary handleOnClick={this.navigateToDetail.bind(this, e)} key={i} {...e} />))
        )
    }
}
