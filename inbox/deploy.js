const HDWalletProvider = require('@truffle/hdwallet-provider');
const {interface, bytecode} = require('./compile');
const Web3 = require('web3');

const provider = new HDWalletProvider(
    'crumble stereo output laundry tray wash hotel meadow ceiling magic grant will',
    'https://rinkeby.infura.io/v3/d0f4e2e6d715404f937f6ae4209e4a56',
);

const web3 = new Web3(provider);

(async function(){
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy( { data: bytecode, arguments: ['Hi There!']} )
    .send( { gas: '1000000', from: accounts[0]} )

    console.log('Contract deployed to address', result.options.address);
    provider.engine.stop()
})()