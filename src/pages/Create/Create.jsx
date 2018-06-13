import React from 'react';
import { HANDSHAKE_ID, HANDSHAKE_NAME, HANDSHAKE_ID_DEFAULT } from '@/constants';
import Helper from '@/services/helper';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import SearchBar from '@/components/core/controls/SearchBar';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';

import './Create.scss';

//
const CreatePromise = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/promise/Create/Promise')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateBetting = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/betting/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateBettingEvent = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/betting-event/Create/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateExchange = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/exchange/Create/Create.jsx')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateExchangeLocal = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/exchange/Create/CreateLocal.jsx')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateSeed = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/seed/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

//
const CreateWalletTransfer = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/wallet/Create/Transfer')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const maps = {
  [HANDSHAKE_ID.PROMISE]: CreatePromise,
  [HANDSHAKE_ID.BETTING]: CreateBetting,
  [HANDSHAKE_ID.BETTING_EVENT]: CreateBettingEvent,
  [HANDSHAKE_ID.EXCHANGE]: CreateExchange,
  [HANDSHAKE_ID.EXCHANGE_LOCAL]: CreateExchangeLocal,
  [HANDSHAKE_ID.SEED]: CreateSeed,
  [HANDSHAKE_ID.WALLET_TRANSFER]: CreateWalletTransfer,
};

class Create extends React.Component {
  constructor(props) {
    super(props);
    let seletedId = HANDSHAKE_ID_DEFAULT;
    // get default
    let { id } = Helper.getQueryStrings(location.search);
    id = parseInt(id, 10);
    if (id && Object.values(HANDSHAKE_ID).indexOf(id !== -1)) {
      seletedId = id;
    }
    this.state = {
      seletedId,
    };
    // bind
    this.handshakeChange = this.handshakeChange.bind(this);
  }

  get handshakeList() {
    const handshakes = Object.entries(HANDSHAKE_NAME).map(([key, value]) => ({
      id: key,
      name: value.name,
      priority: value.priority,
    }));
    return handshakes.sort((x, y) => x.priority > y.priority);
  }

  handshakeChange({ suggestion }) {
    const { id } = suggestion;
    this.setState({ seletedId: id });
  }

  render() {
    const { seletedId } = this.state;
    const CreateComponent = maps[seletedId];

    return (
      <Grid className="create">
        <Row>
          <Col md={12}>
            <SearchBar
              suggestions={this.handshakeList}
              onSuggestionSelected={this.handshakeChange}
              inputSearchDefault={HANDSHAKE_NAME[seletedId].name}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <CreateComponent {...this.props} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Create;
