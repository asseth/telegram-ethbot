var bot = require('./server/telethBot');
var web3 = require('web3');

var web3 = web3(new web3.providers.HttpProvider('http://localhost:8545'));
console.log('web3', web3);


// Instanciate Web3


var users = [{
  name: '',
  chatId: ''
}];
var contractInstance;
var abi = '[{"constant":true,"inputs":[],"name":"expiration","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDeadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_expiration","type":"uint256"}],"payable":false,"type":"constructor"}]';
var bytecode = '606060405234610000576040516020806101e5833981016040528080519060200190919050505b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c01000000000000000000000000908102040217905550806000819055505b505b61016a8061007b6000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634665096d146100645780635f8d96de14610087578063a69df4b5146100aa578063b69ef8a8146100b9578063d321fe29146100dc575b610000565b34610000576100716100ff565b6040518082815260200191505060405180910390f35b3461000057610094610105565b6040518082815260200191505060405180910390f35b34610000576100b7610110565b005b34610000576100c6610159565b6040518082815260200191505060405180910390f35b34610000576100e961015f565b6040518082815260200191505060405180910390f35b60005481565b600060005490505b90565b42600054101561015657600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b60015481565b600060015490505b9056';


/*
 var getContractObject = function () {
 var MyContract = web3.eth.contract(abiArray);
 // instantiate by address
 contractInstance = MyContract.at([address]);
 console.log('contractInstance', contractInstance);
 };
 */


/**
 * deployContract
 * @param arg
 * @returns {Contract}
 */
var deployContract = function (arg) {
  var SavingContract = web3.eth.contract(abi);
  bot.sendMessage('gygy');

  return SavingContract.new(arg,
    {
      from: eth.coinbase,
      data: bytecode, gas: 1000000
    }, function (error, contract) {
      if (error) {
        console.error(error);
        return;
      }
      if (!contract.address) {
        bot.sendMessage(
          "contract SavingContract creation transaction: " + contract.transactionHash);
      } else {
        bot.sendMessage("contract SavingContract mined! Address: " + contract.address);
      }
    });
};


bot.onText(/\/(.+)/, function (msg) {
  var chatId = msg.chat.id;

  switch (msg.text) {
    case '/hello':
      bot.sendMessage(chatId, 'Hi ' + msg.chat.username + '!');
      break;

    case '/deployContract':
      deployContract();
      break;

    case '/createLenderAccount':
      users.push({name: msg.chat.username, chatId: msg.chat.id});
      break;

    default:
      bot.sendMessage(chatId, "I don't understand you");
  }
});
