import React from 'react';
import { HANDSHAKE_ID, HANDSHAKE_NAME, HANDSHAKE_ID_DEFAULT } from '@/constants';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import SearchBar from '@/components/core/controls/SearchBar';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';

import './Create.scss';

const CreatePromise = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/promise/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateBetting = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/betting/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateExchange = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/exchange/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateSeed = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/seed/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

const CreateWalletTransfer = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/handshakes/wallet/Create/Transfer')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

// style

const maps = {
  [HANDSHAKE_ID.PROMISE]: CreatePromise,
  [HANDSHAKE_ID.BETTING]: CreateBetting,
  [HANDSHAKE_ID.EXCHANGE]: CreateExchange,
  [HANDSHAKE_ID.SEED]: CreateSeed,
  [HANDSHAKE_ID.WALLET_TRANSFER]: CreateWalletTransfer,
};

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seletedId: HANDSHAKE_ID_DEFAULT,
    };
    // bind
    this.handshakeChange = this.handshakeChange.bind(this);
  }

  get handShakeList() {
    return Object.entries(HANDSHAKE_NAME).map(([key, value]) => ({
      id: key,
      name: value,
    }));
  }

  handshakeChange({ suggestion }) {
    const { id } = suggestion;
    this.setState({ seletedId: id });
  }

  render() {
    const CreateComponent = maps[this.state.seletedId];

    return (
      <Grid className="create">
        <Row>
          <Col md={12}>
            <SearchBar
              suggestions={this.handShakeList}
              onSuggestionSelected={this.handshakeChange}
              inputSearchDefault={HANDSHAKE_NAME[HANDSHAKE_ID_DEFAULT]}
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
