import React from 'react';
import 'balloon-css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTrophy } from '@fortawesome/free-solid-svg-icons';

import BoardContainer from './BoardContainer.js'
import TileContainer from './TileContainer.js';

import ChatHistory from './ChatHistory';
import Timer from './Timer.js';
import Modal from './Modal.js';
import Square from './Square.js';

import { connect, sendMsg, startServerTime, getSocket} from "../api"

class Board extends React.Component {
  constructor(props) {
    super(props);

    /**
     * 
     * 
     * 
     * Change this later
     * 
     * 
     * 
     */
    this.isConnected = false;


    this.state = {
      timeStart: (new Date()).getTime(),
      timeStopped: false,
      highestTile: 0,
      chatHistory: [],
    }

    this.send = this.send.bind(this);

    this.renderSquare = this.renderSquare.bind(this);
    this.onTimerMount = this.onTimerMount.bind(this);
    this.onBoardMount = this.onBoardMount.bind(this);
    this.callStopTime = this.callStopTime.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.updateHighestTile = this.updateHighestTile.bind(this);

    this.startTimeForAll = this.startTimeForAll.bind(this);
    this.hideModals = this.hideModals.bind(this);

    this.timeStarter = null;
    this.timeStopper = null;
    
    this.setGameState = null;
    this.getGameState = null;
    this.resetGameState = null;

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
  onBoardMount(importFuncs) {
    this.setGameState = importFuncs[0];
    this.getGameState = importFuncs[1];
    this.resetGameState = importFuncs[2];
  }

  startTimeForAll() {
    if (this.isConnected) {
      startServerTime();
    } else {
      this.timeStarter((new Date()).getTime());
      this.resetBoard();
    }
    
  }

  callStopTime() {
    this.timeStopper();
  }
  resetBoard() {
    this.resetGameState();
    this.hideModals();
  }
  
  hideModals() {
    let winModal = document.querySelector("#game-won");
    let loseModal = document.querySelector("game-lose");
    if (!winModal.classList.contains("visually-hidden")) {
      winModal.classList.add("visually-hidden");
    }
    if (!loseModal.classList.contains("visually-hidden")) {
      loseModal.classList.add("visually-hidden");
    }
  }
  updateHighestTile(update) {
    let stateChanges = {
      highestTile: update,
    };

    // winning condition
    if (update == 2048) {
      this.callStopTime();
      sendMsg('User Won'); // keep in mind that this will break the DOM if client is attempting to connect to ws server
      let modal = document.querySelector("#game-won")
      modal.classList.remove("visually-hidden");
    }

    this.setState(stateChanges);
  }


  componentDidMount() {
    connect((msg) => {
      // handles different messages
      let messageBody = JSON.parse(msg.data).body;

      if (messageBody.includes("StartTime")) {
        this.timeStarter(Number(messageBody.slice(11)))
        this.resetBoard();
        messageBody = "Starting race..."
      }
      if (messageBody.includes("won")) {
        this.callStopTime();
        // and you didn't win
        if (!this.state.modal) {
          document.querySelector("#game-lost").classList.remove("visually-hidden");
        }
        console.log(messageBody);
      } else {
        console.log(messageBody);
      }


      this.setState(prevState => ({
        chatHistory: [...prevState.chatHistory, messageBody],
      }))
    });

    // change start button text based on singleplayer or multiplayer mode
    let btn = document.querySelector("#start-button");
    const isConnected = this.isConnected;

    btn.addEventListener("mouseover", function() {
      this.textContent = (isConnected == true ? "Multiplayer" : "Single player");
    })
    btn.addEventListener("mouseout", function() {
      this.textContent = "Start Race";
    })
  }

  
  

  render() {

    let divColor = 'grey';
    if (this.state.highestTile > 64) {
      divColor = getComputedStyle(document.documentElement).getPropertyValue(`--color-${this.state.highestTile}x`);
    }

   
    return (
      <div className="board">
        <div className="game">
          <aside>
            <div className="heading">
              <h1 className="title">4096</h1>
            </div>
            <div className="iconContainer">
              <Timer onMount={this.onTimerMount}/>
              <div id="highest-tile" style={{color: divColor}}>
                <FontAwesomeIcon icon={ faTrophy } className="inlineIcon"/>
                {this.state.highestTile}
              </div>
            </div>
            <button onClick={this.startTimeForAll} id="start-button">
              Start Race
            </button>
            <ChatHistory chatHistory={this.state.chatHistory} />
          </aside>
          <main>
            <Modal value="Cowabunga you won!" id="game-won"/>
            <Modal value="Better luck next time!" id="game-lost"/>
            <BoardContainer renderSquare={this.renderSquare}/>
            <TileContainer 
                highestTile={this.state.highestTile}
                onMount={this.onBoardMount}
                updateHighestTile={this.updateHighestTile}/>
          </main> 
          <div className="bottom">
            <button className={"reset-board"}
                  tabIndex={"0"}
                  onClick={this.resetBoard}
                  aria-label="Reset board"
                  data-balloon-pos="down">
              <FontAwesomeIcon icon={ faRedo } size="lg"/>
            </button>
          </div>
        </div>
      </div>
        
    );
  }
}

export default Board;