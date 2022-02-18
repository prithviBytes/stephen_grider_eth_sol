const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

const initialString = "Hello World!"
let accounts = [];
let inbox;
beforeEach(async() => {
    // Get List of all the Accounts
    accounts = await web3.eth.getAccounts()

    // Use one of the Accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [initialString] })
    .send({ from: accounts[0], gas: "1000000" });
})


describe('Inbox', () => {
    it('created accounts', () => {
        assert.notEqual(accounts.length, 0)
    });

    it("deployed contract", () => {
        assert.ok(inbox.options.address)
    })

    it('has default message', async () => {
        const message = await inbox.methods.message().call()
        assert.equal(message, initialString)
    })

    it('can change the message', async () => {
        await inbox.methods.setMessage('Bye').send({ from: accounts[0] })
        const message = await inbox.methods.message().call();
        assert.equal( message, "Bye")
    })
});












// class Car {
//     park() {
//         return 'parked'
//     }
//     stop() {
//         return 'stopped'
//     }
// }

// let car;

// beforeEach(() => {
//     car = new Car()
// })

// describe('Car', () => {
//     it('can park', () => {
//         assert.equal(car.park(), 'parked')
//     })
//     it('can stop', () => {
//         assert.equal(car.stop(), 'stopped')
//     })
// })