import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from '@sindresorhus/class-names';
import { FormattedMessage, injectIntl } from 'react-intl';

import { DISCOVER } from '@/constants';
import ListHorizontal from '@/components/core/ListHorizontal';
import MultiLanguage from '@/components/core/controls/MultiLanguage';
import Image from '@/components/core/presentation/Image';
import DiscoverBetting from '@/components/handshakes/betting/Discover/Discover';
import ExchangeBetting from '@/components/handshakes/exchange/Discover/Discover';

import loadingSVG from '@/assets/images/icon/loading.gif';

import TABS from './tabs';

class DiscoverPage extends React.Component {
  static propTypes = {
    selectedId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      selectedId: this.props.selectedId,
    };

    this.setLoading = ::this.setLoading;
    this.selectId = ::this.selectId;
  }

  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  selectId(item) {
    if (this.state.selectedId !== item.id) {
      this.setState({ selectedId: item.id, isLoading: true });
    }
  }

  discoverContent() {
    switch (this.state.selectedId) {
      case DISCOVER.TABS.PREDICTION.ID:
        return <DiscoverBetting setLoading={this.setLoading} />;
      case DISCOVER.TABS.EXCHANGE.ID:
        return <ExchangeBetting setLoading={this.setLoading} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="discover-page">
        <div className={cn('discover-overlay', { show: this.state.isLoading })}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-9">
              <ListHorizontal
                idActive={this.state.selectedId}
                onRef={(category) => { this.categoryRef = category; return null; }}
                onItemClick={this.selectId}
                list={TABS}
              />
            </div>
            <div className="col-3 discover-select-language">
              <MultiLanguage />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {this.discoverContent()}
            </div>
          </div>
          <div className="row app-product-info">
            <div className="col-12">
              <FormattedMessage id="product_info" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(state => ({ selectedId: state.app.discoverTabSelectedId }))(DiscoverPage));
