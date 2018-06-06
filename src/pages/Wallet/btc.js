const bitcore = require('bitcore-lib');
const requestPromise = require('request-promise');
const bluebird = require('bluebird');
const BigNumber = require('bignumber.js');
const satoshi = require('satoshi-bitcoin');


class Bitcoin {
  constructor(btcServer) {
    this.btcServer = btcServer;
  }

  getBalance(address) {
    const server = this.btcServer;
    return new bluebird.Promise(((resolve, reject) => {
      const url = `${server}/addr/${address}/balance`;

      requestPromise(url)
        .then((balance) => {
          console.log('satoshi.toBitcoin(balance)', satoshi.toBitcoin(balance));
          resolve(satoshi.toBitcoin(balance));
        })
        .catch((err) => {
          // console.log("err:"+err);
          reject(err);
        });
    }));
  }


  transfer(privateKey, to, amount) {
    const server = this.btcServer;
    if (server.toString().includes('test')) {
      bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
    }

    const prKey = bitcore.HDPrivateKey(privateKey).privateKey.toString();

    const pubKey = bitcore.HDPublicKey(privateKey);

    const address = new bitcore.Address(pubKey.publicKey).toString();

    // return prKey;

    // console.log("transfered from address:" + address);

    // each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
    const amountBig = new BigNumber(amount.toString());
    const satoShiRate = new BigNumber('100000000');
    amount = amountBig.times(satoShiRate).toString();

    const data = {};

    utxosForAmount(server, address, Number(amount))
      .then((utxos) => {
        data.utxos = utxos;

        return getFee(server, 4);
      })
      .then((fee) => {
        data.fee = fee;

        const transaction = new bitcore.Transaction()
          .from(data.utxos)
          .change(address)
          .fee(data.fee)
          .to(to, Number(amount))
          .sign(prKey);

        // console.log(transaction);
        const rawTx = transaction.serialize();
        return sendRawTx(server, rawTx);
      })
      .then(txHash =>
        txHash,
        // console.log(txHash);
      )
      .catch(err =>
        // console.log(err);
        err);
  }
  transfer2(fromAddress, privateKey, to, amount) {
    const server = this.btcServer;
    if (server.toString().includes('test')) {
      bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
    }


    console.log(`transfered from address:${fromAddress}`);

    // each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
    const amountBig = new BigNumber(amount.toString());
    const satoShiRate = new BigNumber('100000000');
    amount = amountBig.times(satoShiRate).toString();

    const data = {};

    utxosForAmount(server, fromAddress, Number(amount))
      .then((utxos) => {
        data.utxos = utxos;

        return getFee(server, 4);
      })
      .then((fee) => {
        data.fee = fee;

        const transaction = new bitcore.Transaction()
          .from(data.utxos)
          .change(fromAddress)
          .fee(data.fee)
          .to(to, Number(amount))
          .sign(privateKey);

        // console.log(transaction);
        const rawTx = transaction.serialize();

        return sendRawTx(server, rawTx);
      })
      .then(txHash =>
        txHash,
        // console.log(txHash);
      )
      .catch(err =>
        // console.log(err);
        err);
  }
}


const retrieveUtxos = function (server, address) {
  return new bluebird.Promise(((resolve, reject) => {
    const url = `${server}/addr/${address}/utxo`;
    requestPromise(url)
      .then((utxos) => {
        utxos = JSON.parse(utxos);
        utxos.sort((a, b) => b.satoshis - a.satoshis);
        resolve(utxos);
      })
      .catch((err) => {
        reject(err);
      });
  }));
};


var utxosForAmount = function (server, address, amount) {
  return new bluebird.Promise(((resolve, reject) => {
    retrieveUtxos(server, address)
      .then((utxos) => {
        console.log(`utxos:${JSON.stringify(utxos)}`);

        const result = findUtxos(utxos, 0, amount, []);
        console.log(result);
        if (!result) { return reject({ error: 'Insufficent Balance' }); }

        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  }));
};

var findUtxos = function (utxos, pos, amount, result) {
  if (pos >= utxos.length) { return null; }

  const utxo = utxos[pos];
  result.push(utxo);
  // console.log("utxo.satoshis >= amount"+utxo.satoshis+":"+ amount);

  if (utxo.satoshis >= amount) { // in case of enough money
    return result;
  }

  amount -= utxo.satoshis;

  return findUtxos(utxos, pos + 1, amount, result);
};


var getFee = function (server, blocks) {
  return new bluebird.Promise(((resolve, reject) => {
    const url = `${server}/utils/estimatefee?nbBlocks=${blocks}`;
    requestPromise(url)
      .then((fee) => {
        fee = JSON.parse(fee);
        const txFee = bitcore.Unit.fromBTC(fee[blocks]).toSatoshis();
        console.log(`data.txFee${txFee}`);
        resolve(txFee);
      })
      .catch((err) => {
        reject(err);
      });
  }));
};


var sendRawTx = function (server, rawTx) {
  console.log('rawTx', rawTx);
  const uri = `${server}/tx/send`;
  console.log('uri', uri);

  return new bluebird.Promise(((resolve, reject) => {
    const options = {
      method: 'POST',
      uri,
      body: {
        rawtx: rawTx,
      },
      json: true, // Automatically stringifies the body to JSON
    };
    requestPromise(options)
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
  }));
};


module.exports = Bitcoin;


const testnet = 'https://test-insight.bitpay.com/api';

const btcTestnet = new Bitcoin(testnet);


// var tx = btcTestnet.transfer("tprv8j91JifmvkdWmQgqQKbYsXXagNc2fvqtj7TWc7ZjDJVjz49tK5dWQnLZqwGSPE5h7mzKdpbPR9PJpQawSq2aA1Jebiaj2NqS6FVPvqx3yqS","n1S1ySUAGedc6RM4tYUbhSrZXdUfv8uvYT", 0.001);
const tx2 = btcTestnet.transfer2('myQCKwZLwhZsrEvHXd8zSDdK4V5hCYaP2w', '86591c463220271f2d61a19f076d84a2017f850f9643675e49f07dd733f99c2d', 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr', 1);

console.log(tx2);

// btcTestnet.getBalance('muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr')
