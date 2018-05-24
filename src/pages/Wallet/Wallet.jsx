import React from 'react';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    // var Mnemonic = require('bitcore-mnemonic');
    // var code = new Mnemonic(Mnemonic.Words.English);
    // console.log("code", code.toString()); 
    // var valid = Mnemonic.isValid(code);
    // console.log("valid", valid); 
    // var xpriv = code.toHDPrivateKey();
    // console.log("xpriv", xpriv);

    var bip39 = require('bip39')
    var hdkey = require('hdkey')
    var ethUtil = require('ethereumjs-util') 

    const mnemonic = bip39.generateMnemonic(); //generates string

    console.log("mnemonic", mnemonic);

    const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer

    console.log("seed", seed);

    const root = hdkey.fromMasterSeed(seed);

    console.log("root", root);

    const masterPrivateKey = root.privateKey.toString('hex');

    console.log("masterPrivateKey", masterPrivateKey);

    const addrNode = root.derive("m/44'/60'/0'/0/0"); //line 1

    console.log("addrNode", addrNode);

    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);

    console.log("pubKey", pubKey);

    const addr = ethUtil.publicToAddress(pubKey).toString('hex');

    console.log("addr", addr);

    const address = ethUtil.toChecksumAddress(addr);

    console.log("address", address);

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            wallet
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Wallet;
