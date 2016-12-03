var bot = require('./server/telethBot');
var Web3 = require('web3');
var web3;
//var web3 = web3(new web3.providers.HttpProvider('http://localhost:8545'));
//console.log('web3', web3);
// Instanciate Web3
var users = [{
  name: '',
  chatId: ''
}];
var contractInstance;
var contractAddress = '';
var abi = [{"constant":true,"inputs":[],"name":"getSavingsAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getSavingsDeadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"expiration","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"balance","type":"uint256"}],"name":"setBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_expiration","type":"uint256"}],"payable":false,"type":"constructor"}];
var bytecode = '606060405230600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c01000000000000000000000000908102040217905550346100005760405160208061027e833981016040528080519060200190919050505b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555080600081905550620f42406001819055505b505b6101bc806100c26000396000f360606040523615610070576000357c010000000000000000000000000000000000000000000000000000000090048063116d156f1461007557806321e02992146100985780634665096d146100bb578063a69df4b5146100de578063b69ef8a8146100ed578063fb1669ca14610110575b610000565b3461000057610082610141565b6040518082815260200191505060405180910390f35b34610000576100a561014c565b6040518082815260200191505060405180910390f35b34610000576100c8610159565b6040518082815260200191505060405180910390f35b34610000576100eb61015f565b005b34610000576100fa6101a8565b6040518082815260200191505060405180910390f35b346100005761012b60048080359060200190919050506101ae565b6040518082815260200191505060405180910390f35b600060015490505b90565b6000426000540390505b90565b60005481565b4260005410156101a557600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b60015481565b60008191508190505b91905056';
/**
 * connect
 * @param host
 * @param port
 * @returns {boolean}
 */
function connect(host, port) {
  uri = 'http://' + host + ':' + port;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  }
  else {
    /* set the provider you want from Web3.providers */
    process.stdout.write('Setting Http provider : ' + uri + "\n")
    var prov = new Web3.providers.HttpProvider(uri);
    web3 = new Web3(prov);
  }
  if (!web3.isConnected()) {
    process.stdout.write('Cannot reach ' + uri + "\n");
    return false;
  }
  else {
    process.stdout.write('Connected to ' + uri + "\n");
    return true;
  }
}
connect('localhost', 8545);
/**
 *
 */


/**
 * deployContract
 * @param arg
 * @returns {Contract}
 */
var deployContract = function (chatId, arg, cb) {
  // set defaultAccount
  // transactional methods are based on defaultAccount
  web3.eth.defaultAccount = web3.eth.accounts[0];
  var SavingContract = web3.eth.contract(abi);
  console.log('arg//////////////////////////////////////////////', arg);
  return SavingContract.new(arg,
    {
      from: web3.eth.coinbase,
      data: bytecode,
      gas: 2100000
    }, function (error, contract) {
      if (error) {
        console.error(error);
        return;
      }
      if (!contract.address) {
        console.log('contract.address IF');
        bot.sendMessage(chatId,
          "contract -- SavingContract -- sending. Transaction hash is: " + contract.transactionHash);
      } else {
        console.log('contract.address ELSE');
        contractAddress = contract.address;
        bot.sendMessage(chatId,
          "contract SavingContract mined! Address: " + "https://testnet.etherscan.io/address/" + contract.address);
        web3.eth.sendTransaction({
          from: web3.eth.defaultAccount,
          to: contract.address,
          value: web3.toWei(1, "ether")
        }, function (x) {
          console.log('xxxxx-----------', x);
        });
        cb(SavingContract, contract.address);
      }
    });
};

/**
 * getContractObject
 * @param abi
 * @param address
 * @param cb
 */
var getContractObject = function (contract, address, cb) {
  // instantiate by address
  contractInstance = contract.at(address);
  console.log('address', address);
  console.log('web3.eth.defaultAccount', web3.eth.defaultAccount);
  console.log('contractInstance', contractInstance);
  cb(contractInstance);
};

bot.onText(/\/help/, function (msg) {
  console.log('help');
  "use strict";
  bot.sendMessage(msg.chat.id,
    '/hello \n' +
    '/deployContract TIMESTAMP \n' +
    '/getSavingsDeadline \n' +
    '/getSavingsAmount \n' +
    '/setBalance \n' +
    '/stopLending \n' +
    '/price base/quote \n' +
    '/setAlert \n');
});

bot.onText(/\/hello/, function (msg) {
  "use strict";
  bot.sendMessage(msg.chat.id, 'Hi ' + msg.chat.username + '!');
});

bot.onText(/\/price (.+)/, function (msg) {
  "use strict";
  var request = require('request');
  request({
    url: "https://www.cryptocompare.com/api/data/price?fsym=ETH&tsyms=USD",
    method: "GET"
  }, function(error, response, body) {
    body = JSON.parse(body);
    console.log(body.Data[0]);
    bot.sendMessage(msg.chat.id, body.Data[0]);
  });
});

bot.onText(/\/getSavingsDeadline/, function (msg) {
  "use strict";
  console.log('contractInstance.getSavingsDeadline()', contractInstance.getSavingsDeadline().toString(10));
  bot.sendMessage(msg.chat.id, contractInstance.getSavingsDeadline().toString(10));
});

bot.onText(/\/getSavingsAmount/, function (msg) {
  "use strict";
  console.log('contractInstance.getSavingsAmount()', contractInstance.getSavingsAmount().toNumber());
  bot.sendMessage(msg.chat.id, contractInstance.getSavingsAmount().toNumber());
});


bot.onText(/\/setBalance (.+)/, function (msg) {
  "use strict";
  //console.log('contractInstance.getSavingsAmount()', contractInstance.setBalance.sendTransaction({to:, value: }));
  bot.sendMessage(msg.chat.id, contractInstance.setBalance() + '');
});

bot.onText(/\/default/, function (msg) {
  "use strict";
  bot.sendMessage(msg.chat.id, 'I don\'t understand you');
});


bot.onText(/\/deployContract (.+)/, function (msg) {
  console.log('deployContract msg', msg);
  var chatId = msg.chat.id;
  var date = msg.date;
  console.log('let\'s deploy a contract...');
  deployContract(chatId, date, function (contract, contractAddress) {
    getContractObject(contract, contractAddress, function (contractInstance) {
      console.log('contractInstance----', contractInstance.getSavingsDeadline().toNumber());
      console.log('contractInstance----', contractInstance.getSavingsAmount().toNumber());
    });
  });
});

/**
 * SWITCH
 */
/*
switch (msg.text) {
  default:
    bot.sendMessage(chatId, "I don't understand you");
}
*/