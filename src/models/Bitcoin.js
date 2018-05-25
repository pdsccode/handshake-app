var bitcore=  require('bitcore-lib');
var requestPromise = require('request-promise');
var bluebird = require('bluebird');
var BigNumber = require('bignumber.js');


const testnetAPI = 'https://test-insight.bitpay.com/api';
const livenetAPI = 'https://insight.bitpay.com/api';

var blockchainApi;

var retrieveUtxos = function (address) {

  return new bluebird.Promise(function (resolve, reject) {

    var url = blockchainApi+'/addr/' + address + '/utxo';
    console.log(url);
    requestPromise(url)
      .then(function (utxos) {
        utxos = JSON.parse(utxos);
        utxos.sort(function(a, b) {
          return b.satoshis - a.satoshis;
        });
        resolve(utxos);
      })
      .catch(function (err) {
        reject(err);
      });

  });
};



var utxosForAmount = function (address, amount) {
  return new bluebird.Promise(function (resolve, reject) {
    retrieveUtxos(address)
      .then(function (utxos) {
        console.log("utxos:"+JSON.stringify(utxos))

        var result = findUtxos(utxos, 0, amount, []);
        console.log(result);
        if(!result)
          return reject({"success": false, "error": "Not enough utxos"});

        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

var findUtxos = function (utxos, pos, amount , result) {
  if(pos >= utxos.length)
    return null;

  var utxo = utxos[pos];
  result.push(utxo);
  console.log("utxo.satoshis >= amount"+utxo.satoshis+":"+ amount);

  if(utxo.satoshis >= amount){ //enough monney
    return result;
  }
  else{
    amount = amount - utxo.satoshis;

    return findUtxos(utxos, pos+1, amount, result);
  }
};


var getFee = function (blocks) {
  return new bluebird.Promise(function (resolve, reject) {
    var url = blockchainApi+'/utils/estimatefee?nbBlocks='+blocks;
    requestPromise(url)
      .then(function (fee) {
        fee = JSON.parse(fee);
        var txFee = bitcore.Unit.fromBTC(fee[blocks]).toSatoshis()
        console.log("data.txFee"+txFee);
        resolve(txFee);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};


var sendRawTx = function (rawTx) {
  return new bluebird.Promise(function (resolve, reject) {
    var options = {
      method: 'POST',
      uri: blockchainApi + '/tx/send',
      body: {
        rawtx: rawTx
      },
      json: true // Automatically stringifies the body to JSON
    };
    requestPromise(options)
      .then(function (data) {
        resolve(data);
      }).catch(function (err) {
      reject(err);
    });
  });
};



var safeMaths = function(first, operation, sec) {

  first = first.toString();
  sec = sec.toString();
  var a = new BigNumber(first);
  var b = new BigNumber(sec);

  // Figure out which operation to perform.
  var operator;
  switch(operation.toLowerCase()) {
    case '-':
      operator = function(a,b) { return a.minus(b); };
      break;
    case '+':
      operator = function(a,b) { return a.plus(b); };
      break;
    case '*':
    case 'x':

      operator = function(a,b) { return a.times(b); };
      break;
    case '÷':
    case '/':

      operator = function(a,b) { return a.div(b); };
      break;
    case '^':
      operator  = function(a,b){ return a.pow(b);};
      break;

    // Let us pass in a function to perform other operations.
    default:
      operator = operation;
  }

  var result = operator(a,b);

  return result.toString();
};


var transferBTC = function(privateKey, to, amount,network){

  if(network==='testnet'){
    blockchainApi = testnetAPI;
  }
  else{
    blockchainApi = livenetAPI
  }

  if(network === 'testnet'){
    bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
  }

  var private = bitcore.HDPrivateKey(privateKey).privateKey.toString();

  var publicKey = bitcore.HDPublicKey(privateKey);
  var address = new bitcore.Address(publicKey.publicKey).toString();

  console.log("address transfer:" + address);

  //each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
  amount = safeMaths(amount,'*','100000000');

  var data = {};



  utxosForAmount(address,Number(amount))
    .then(function(utxos){
      data.utxos = utxos;

      return getFee(3);
    })
    .then(function(fee){

      data.fee = fee;


      console.log("amount"+amount);

      var transaction = new bitcore.Transaction()
        .from(data.utxos)
        .change(address)
        .fee(data.fee)
        .to(to,Number(amount))
        .sign(private);



      console.log(transaction);
      var rawTx = transaction.serialize();
      return sendRawTx(rawTx);

    })
    .then(function(txHash){
      console.log(txHash);
    })
    .catch(function(err){
      console.log(err);
    });

};


async function checkBalance(blockchainApi, address) {
  return new bluebird.Promise(function (resolve, reject) {

    var url = blockchainApi+'/addr/' + address + '/balance';
    console.log(url);

    requestPromise(url)
      .then(function (balance) {
        console.log(balance);
        resolve(balance);
      })
      .catch(function (err) {
        reject(err);
      });

  });
}


async function createAddress() {
  var Mnemonic = require('bitcore-mnemonic');

  var code = new Mnemonic();

  var xpriv1 = code.toHDPrivateKey();

  console.log(xpriv1);

  var hdPrivateKey = new bitcore.HDPrivateKey(xpriv1);
  var hdPublicKey = hdPrivateKey.hdPublicKey;

  var address = new bitcore.Address(hdPublicKey.publicKey, bitcore.Networks.livenet);
  console.log(hdPrivateKey.xprivkey);

  console.log("1:"+address.toString());

}

module.exports = function(seed) {
  /**
   * generate hd wallet private key.
   */
  /*/!*var HDPrivateKey = bitcore.HDPrivateKey;

  var hdPrivateKey = new HDPrivateKey("testnet");
  //var retrieved = new HDPrivateKey(seed);
  var derived = hdPrivateKey.derive("m/0'");
  var derivedByNumber = hdPrivateKey.derive(1).derive(2, true);
  var derivedByArgument = hdPrivateKey.derive("m/1/2'");
  //assert(derivedByNumber.xprivkey === derivedByArgument.xprivkey);

  var address = derived.privateKey.toAddress();

// obtain HDPublicKey
  var hdPublicKey = hdPrivateKey.hdPublicKey;
  //var wif = derived.privateKey.toWIF();

  console.log(address + "," + hdPublicKey + "," + derived.xprivkey);*!/
  console.log("network"+derived.network);*/

  checkBalance(testnetAPI,"n1MZwXhWs1unyuG6qNbEZRZV4qjzd3ZMyz").then(function (blc) {
    console.log("balance:" + blc)
  });
  transferBTC("tprv8ccSMiuz5MfvmYHzdMbz3pjn5uW3G8zxM975sv4MxSGkvAutv54raKHiinLsxW5E4UjyfVhCz6adExCmkt7GjC41cYxbNxt5ZqyJBdJmqPA","mrPJ6rBHpJGnsLK3JGfJQjdm5vkjeAb63M", 0.0001,"testnet");
  //createAddress();
}
