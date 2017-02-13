# finhacks2016

This project was done by Asseth at the Finaxys hackathon of December 2016. It is a Telegram-bot interface providing information on your ethereum miner, on your poloniex trades, and deploying a simple contract.


# Testnet
    $ geth --testnet --rpc --rpcapi 'web3,eth,debug, personal, miner' --rpccorsdomain="*"

    $ geth --testnet attach http://localhost:8545
    $ geth --preload autoSetup.js --testnet attach http://localhost:8545                 



# Private
    $ geth --dev --rpc --rpcapi 'web3,eth,debug' --rpccorsdomain="*" --datadir /tmp/ethereum_dev_mode
    $ geth --dev --preload autoSetup.js  attach ipc:/tmp/ethereum_dev_mode/geth.ipc


# Check balance
    web3.fromWei(eth.getBalance(eth.accounts[0]), "ether") + " ether"


# deploy a contract
## timestamp as parameter
    /deployContract 212212121
