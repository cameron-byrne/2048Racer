import React from 'react';
import 'balloon-css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTrophy, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';

import TileContainer from './TileContainer.js';
import Timer from './Timer.js';
import Square from './Square.js';

import { connect, sendMsg, startServerTime } from "../api"

class Board extends React.Component {
  constructor(props) {
    super(props);
    connect();

    this.state = {
      timeStart: (new Date()).getTime(),
      timeStopped: false,
      highestTile: 0,
      chatHistory: [],
    }

    this.colors = {
      2: '#abb2bf',
      4: '#eee1c9',
      8: '#f3b27a',
      16: '#f69664',
      32: '#f77c5f',
      64: '#f75f3b',
      128: '#edd073',
      256: '#edcc62',
      512: '#edc950',
      1024: '#edc53f',
      2048: '#17a589'
    }

    this.send = this.send.bind(this);

    this.renderSquare = this.renderSquare.bind(this);
    this.onTimerMount = this.onTimerMount.bind(this);
    this.onBoardMount = this.onBoardMount.bind(this);
    this.callStopTime = this.callStopTime.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.updateHighestTile = this.updateHighestTile.bind(this);

    this.startTimeForAll = this.startTimeForAll.bind(this);
    
    this.timeStarter = null;
    this.timeStopper = null;
    this.boardSetter = null;

  }

  send() {
    console.log("Sending message...");
    sendMsg(`Highest tile: ${this.state.highestTile}.`);
  }

  renderSquare(i) {
    return <Square />;
  }

  onTimerMount(setter) {
    this.timeStopper = setter[0];
    this.timeStarter = setter[1];
  }
  onBoardMount(setter) {
    console.log(setter);
    this.boardSetter = setter;
  }

  startTimeForAll() {
    startServerTime();
  }

  callStopTime() {
    this.timeStopper();
  }
  resetBoard() {
    this.boardSetter();
  }
  
  updateHighestTile(update) {
    // winning condition
    if (update == 2048) {
      sendMsg('User Won');
    }

    this.setState({
      highestTile: update,
    });
  }

  showWonModal() {

  }

  componentDidMount() {
    connect((msg) => {
      // handles different messages
      let messageBody = JSON.parse(msg.data).body

      if (messageBody.includes("StartTime")) {
        this.timeStarter(Number(messageBody.slice(11)))
        this.resetBoard();
        messageBody = "Starting race..."
      }
      if (messageBody.includes("won")) {
        this.callStopTime();
        console.log(messageBody);
      } else {
        console.log(messageBody);
      }


      this.setState(prevState => ({
        chatHistory: [...prevState.chatHistory, messageBody],
      }))
    }
    );
  }

  
  

  render() {
    let divColor = 'grey';
    if (this.state.highestTile > 64) {
      divColor = this.colors[this.state.highestTile];
    }

    console.log(this.state.chatHistory)
    const messages = this.state.chatHistory.map((msg, index) => (
      <p key={index}>{msg}</p>
    ))
    console.log(messages)

    return (
      <div className="board">
        <div className="game">
          <main>
            <div className={["game-message", "game-lost"].join(" ")}>
              <p>Drip drop you need to stop.</p>
            </div>
            <div className={["game-message", "game-won"].join(" ")}>
              <p>Cowabunga you won!</p>
            </div>

            <div className="board-container">
                <div className="board-row">
                  {this.renderSquare(0)}
                  {this.renderSquare(1)}
                  {this.renderSquare(2)}
                  {this.renderSquare(3)}
                </div>
                <div className="board-row">
                  {this.renderSquare(4)}
                  {this.renderSquare(5)}
                  {this.renderSquare(6)}
                  {this.renderSquare(7)}
                </div>
                <div className="board-row">
                  {this.renderSquare(8)}
                  {this.renderSquare(9)}
                  {this.renderSquare(10)}
                  {this.renderSquare(11)}          
                </div>
                <div className="board-row">
                  {this.renderSquare(12)}
                  {this.renderSquare(13)}
                  {this.renderSquare(14)}
                  {this.renderSquare(15)}          
                </div>
            </div>
            <TileContainer 
                colors={this.colors}
                stopTime={this.callStopTime} 
                onMount={this.onBoardMount}
                updateHighestTile={this.updateHighestTile}/>
          </main> 
          <aside>
            <div className="heading">
              <h1 className="title">4096</h1>
            </div>
            <Timer onMount={this.onTimerMount}/>
            <div id="highest-tile" style={{color: divColor}}>
              <FontAwesomeIcon icon={ faTrophy } className="inlineIcon"/>
              {this.state.highestTile}
            </div>
            <button onClick={this.startTimeForAll}>
              Start Race
            </button>
            <div className="ChatHistory">
              {messages}
            </div>
            
          </aside>
        </div>
        <div className="bottom">
          
            <div className={"reset-board"}
                  tabIndex={"0"}
                  onClick={this.resetBoard}
                  aria-label="Reset board"
                  data-balloon-pos="down">
              <FontAwesomeIcon icon={ faRedo } />
            </div>
        </div>
      </div>
    );
  }
}

export default Board;