// Security best practices ftw
function unlockAllAccounts(){
  for (var i = 0; i < web3.eth.accounts.length; i++) {
    personal.unlockAccount(web3.eth.accounts[i], "", 36000);
  }
}

function assert(condition, message) {
  if (!condition) throw message;
}

// We want 3 accounts for our tests
while (web3.eth.accounts.length < 3) {
  console.log("Creating test account...");
  personal.newAccount(""); // Empty passphrase
}

// set defaultAccount
// transactional mweb3.ethods are based on defaultAccount
web3.eth.defaultAccount = web3.eth.accounts[0];

// Set account to receive web3.ether (mining earns)
miner.setEtherbase(web3.eth.accounts[0]);

// Start the miner to validate all the transactions below
miner.start(2);

// Security best practices ftw
unlockAllAccounts();

var alice = web3.eth.accounts[0];
var bob = web3.eth.accounts[1];
var carol = web3.eth.accounts[2];

admin.sleepBlocks(1); // block reward for alice

// Alice sends some ether to bob and carol, so everybody will have ether and the possibility to send transactions
web3.eth.sendTransaction({from:alice, to:bob, value: web3.toWei(1, "ether")});
web3.eth.sendTransaction({from:alice, to:carol, value: web3.toWei(1, "ether")});
admin.sleepBlocks(3);
