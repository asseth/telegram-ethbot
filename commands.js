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
var abi = [{"constant":true,"inputs":[],"name":"getSavingsAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getSavingsDeadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"expiration","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_expiration","type":"uint256"}],"payable":false,"type":"constructor"}];
var bytecode = '606060405230600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055503461000057604051602080610262833981016040528080519060200190919050505b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555080600081905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16316001819055505b505b61016a806100f86000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063116d156f1461006457806321e02992146100875780634665096d146100aa578063a69df4b5146100cd578063b69ef8a8146100dc575b610000565b34610000576100716100ff565b6040518082815260200191505060405180910390f35b346100005761009461010a565b6040518082815260200191505060405180910390f35b34610000576100b7610115565b6040518082815260200191505060405180910390f35b34610000576100da61011b565b005b34610000576100e9610164565b6040518082815260200191505060405180910390f35b600060015490505b90565b600060005490505b90565b60005481565b42600054101561016157600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b6001548156';

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

  if(!web3.isConnected()) {
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
 * deployContract
 * @param arg
 * @returns {Contract}
 */
var deployContract = function (chatId, arg, cb) {
  var SavingContract = web3.eth.contract(abi);
  console.log('arg//////////////////////////////////////////////', arg);

  return SavingContract.new(arg,
    {
      from: web3.eth.coinbase,
      data: bytecode, gas: 1000000
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
        bot.sendMessage(chatId,
          "contract SavingContract mined! Address: " + contract.address);
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
var getContractObject = function (abi, address, cb) {
  //console.log('abi, address------------', abi, address);
  var MyContract = web3.eth.contract(abi);
  // instantiate by address
  contractInstance = MyContract.at(address);
  console.log('contractInstance', contractInstance);
  cb(contractInstance);
};

bot.onText(/\/(.+)/, function (msg) {
  var chatId = msg.chat.id;

  switch (msg.text) {
    case '/hello':
      bot.sendMessage(chatId, 'Hi ' + msg.chat.username + '!');
      break;

    case '/deployContract':
      console.log('let\'s deploy a contract...');
      deployContract(chatId, 1680746287, function(contract, contractAddress) {
        getContractObject(contract.abi, contractAddress, function(contractInstance) {
          console.log('contractInstance----', contractInstance.getSavingsDeadline().toNumber());
          console.log('contractInstance----', contractInstance.getSavingsAmounts);
        });
      });
      break;

    case '/getSavingDeadline':
      contractInstance.getSavingsDeadline();

    case 'getSavingsAmount':
      contractInstance.getSavingsAmount();

    case '/createLenderAccount':
      users.push({name: msg.chat.username, chatId: msg.chat.id});
      break;

    default:
      bot.sendMessage(chatId, "I don't understand you");
  }
});
