import React from 'react';
import './FAQBetting.scss';

class FAQBetting extends React.PureComponent {
  render() {
    return (
      <dl className="faq-betting faq">
        <dt>Order book</dt>
        <dd>
        The table on this screen is the order book. You can see the volume of bets waiting for a match (Pool), and the corresponding Odds. Once bets are fully matched, they disappear off the order book.
        </dd>
        <dt>Market Volume (ETH)</dt>
        <dd>
        This is the total amount of ETH staked on this event, across all odds and outcomes.
        </dd>
        <dt>Pool (ETH)</dt>
        <dd>
        Each row shows the total bets on the corresponding odds, that Support or Oppose this outcome. Pools will be listed until fully matched. Once the order book entry is balanced, it disappears.
        </dd>
        <dt>Odds</dt>
        <dd>
        Ninja uses decimal odds. Multiply your stake by the decimal shown, and that’s your winnings! Example: If you stake 1 ETH on 1.5 odds, you could win 1.5 ETH (including your stake).
        </dd>
        <dt>Support or Oppose</dt>
        <dd>
        For each event, select the outcome you want to Support. Oppose works the same way. For example, if I think Brazil will not beat Mexico, I will select ‘Brazil beats Mexico’ and tap Oppose.
        </dd>
        <dt>Market odds</dt>
        <dd>
        These are odds suggested by Ninja. Most ninjas will choose to go with these odds, which means your bet will most likely be matched quickly. You can also choose to create your own odds and wait for another ninja to play against you.
        </dd>
        <dt>Market fee</dt>
        <dd>
        Each Prediction (event outcome) + Odds (likelihood) pair is a betting market, made up of all the bets that support or oppose the outcome. The creator of each market is free to set their own fees, as a percentage of the winning payout.
        </dd>
      </dl>
    );
  }
}

export default FAQBetting;
