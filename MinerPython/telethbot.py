import telepot

import requests

import time

import json

# import asyncio

from web3 import Web3, RPCProvider, IPCProvider, TestRPCProvider
#web3 = Web3(RPCProvider(host='ropsten.ethereum-android.com', port='81'))



# Initialising a Web3 instance with an RPCProvider:
web3rpc = Web3(TestRPCProvider())

# or specifying host and port.
web3 = Web3(TestRPCProvider(host="127.0.0.1", port="8545"))
#web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

def handle(msg):

    chat_id = msg['chat']['id']

    command = msg['text']

    print 'Got command: %s' % command

# /balance => lien vers la balance de 0xdbcbd5fc3693a8d6262b21376913c655d6e53c99

# /worker => info du worker 0xdbcbd5fc3693a8d6262b21376913c655d6e53c99 sur dwarfpool

    if command == '/balance':

        bot.sendMessage(chat_id, 'https://etherscan.io/address/0xdbcbd5fc3693a8d6262b21376913c655d6e53c99')

    elif command == '/worker':

        response = requests.get("http://dwarfpool.com/eth/api?wallet=0xdbcbd5fc3693a8d6262b21376913c655d6e53c99&email=mail@example.com")

        bot.sendMessage(chat_id, response.content)

    elif command == '/hashrate':

        response = requests.get("http://dwarfpool.com/eth/api?wallet=0xdbcbd5fc3693a8d6262b21376913c655d6e53c99&email=mail@example.com")

        bot.sendMessage(chat_id, json.loads(response.text)['workers']['']['hashrate_calculated'])

    elif command == '/alive':

        response = requests.get("http://dwarfpool.com/eth/api?wallet=0xdbcbd5fc3693a8d6262b21376913c655d6e53c99&email=mail@example.com")

        bot.sendMessage(chat_id, json.loads(response.text)['workers']['']['alive'])

    elif command == '/last_submit':

        response = requests.get("http://dwarfpool.com/eth/api?wallet=0xdbcbd5fc3693a8d6262b21376913c655d6e53c99&email=mail@example.com")

        bot.sendMessage(chat_id, json.loads(response.text)['workers']['']['last_submit'])

    elif command == '/last':

        response = requests.get("http://dwarfpool.com/eth/api?wallet=0xdbcbd5fc3693a8d6262b21376913c655d6e53c99&email=mail@example.com")

        bot.sendMessage(chat_id, json.loads(response.text)['workers']['']['last_submit'])

    elif command == '/lastblock':

        response = web3.eth.blockNumber

        bot.sendMessage(chat_id, response)




    elif command == '/lol':

        bot.sendMessage(chat_id, 'http://i.imgur.com/dPswPHD.jpg')

    elif command == '/sync':

        response =  web3.eth.syncing

        bot.sendMessage(chat_id, response)

    elif command == '/gasPrice':

        response =  web3.eth.gasPrice

        bot.sendMessage(chat_id, response)

    elif command == '/accounts':

        response =  web3.eth.accounts

        bot.sendMessage(chat_id, response)

    elif command == '/accounts':

        response =  web3.eth.accounts

        bot.sendMessage(chat_id, response)







    elif command == '/help':

        response = "/accounts " + "/gasPrice " + "/sync " + "/lol " + "/lastblock " + "/last_submit " + "/alive " + "/balance " + "/worker " + "/hashrate " + "/alive "

        bot.sendMessage(chat_id, response)







bot = telepot.Bot('243737862:AAGj06cra0ZmspVSgKiyFVjBvcPDeBJGxIQ')

bot.message_loop(handle)

print 'I am listening ...'

while 1:

    time.sleep(10)
