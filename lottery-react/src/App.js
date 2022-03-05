import "./App.css";
import React from "react";
import lottery  from './lottery'
import web3 from "./web3";
class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: ""
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
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
        <form>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})}
            />
            <button>Enter</button>
          </div>
        </form>
      </div>
    );
  }
}
export default App;
