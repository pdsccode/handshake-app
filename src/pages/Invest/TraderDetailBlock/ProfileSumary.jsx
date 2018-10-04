import './TraderDetail.scss';
import React from 'react';
import StarRatings from 'react-star-ratings';
import { wrapBoundary } from '../../../components/ErrorBoundary';
import {
    ACTIVE_PROJECTS,
    CUM_VALUE_OF_MANAGED_FUNDS,
    AVERAGE_RETURN,
    CUM_EARNINGS
} from './Messages';
import { currencyFormat } from '../../../utils/number'

const ProfileSumary = wrapBoundary(({ rating, avatarUrl, name, activeProjects, managedFunds = 0, averageReturn, cumEarning = 0 }) => (
    <div className="profile">
        <div className="relativeLine">
            <div className="profile-picture">
                <img src={avatarUrl} />
                <label>{name}</label>
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
        </div>
        <div style={{ height: '50px' }}></div>
        <div className="profile-banner"></div>
        <div className="relativeLine">
            <div className="profile-sumary">
                <div className="block block-b1">
                    <label className="black">{activeProjects}</label>
                    <label className="grey">{ACTIVE_PROJECTS}</label>
                </div>
                <div className="block block-b2">
                    <label className="black">{currencyFormat.format(managedFunds)}</label>
                    <label className="grey">{CUM_VALUE_OF_MANAGED_FUNDS}</label>
                </div>
                <div className="block block-b2">
                    <label className="green">{`${averageReturn*100}%`}</label>
                    <label className="grey">{AVERAGE_RETURN}</label>
                </div>
                <div className="block block-b1">
                    <label className="black">{currencyFormat.format(cumEarning)}</label>
                    <label className="grey">{CUM_EARNINGS}</label>
                </div>
            </div>
        </div> 
        <div style={{ height: '200px' }}></div>
    </div>
));

export default ProfileSumary;
