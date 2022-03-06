import "./App.css";
import React from "react";
import lottery  from './lottery'
import web3 from "./web3";
class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    isManager: false
  };

  async componentDidMount(){
    await this.updateData();
    const accounts = await web3.eth.getAccounts();
    if ( this.state.manager === accounts[0] ){
      this.setState({ isManager: true });
    }
  }

  async updateData() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    if ( parseFloat(this.state.value) <= 0.1 ){
      this.setState({
        message: "Minimum entry amount is 0.1",
        value: ""
      });
      return
    }
    this.setState({
      message: "Waiting for trasaction to complete!!!"
    })
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({
      message: "Transaction Completed!!!"
    })
    this.updateData();
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: "Waiting for transaction success"
    })
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({
      message: "Picked a Winner!!!"
    })
  }
  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by: <b>{this.state.manager}</b>.<br/>
          There are currently {this.state.players.length} people entered in they current round.<br/>
          Competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.<br/>
        </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              value={this.state.value}
              placeholder="Amount greater than 0.1"
              onChange={event => this.setState({ value: event.target.value})}
            />
            <button>Enter</button>
          </div>
        </form>
        <hr/>
        {
          this.state.isManager && <button onClick={this.onClick}>Pick Winner</button>
        }
        <hr/>
        <h3>{this.state.message}</h3>
      </div>
    );
  }
}
export default App;
