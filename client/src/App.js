import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const socket = require('socket.io-client')();

class App extends Component {
  constructor() {
    super();
    this.state = {roomName: null};
    this.backToRoomList = this.backToRoomList.bind(this);
  }

  componentDidMount() {
    socket.on('enter room', name => {
      console.log(this);
      this.setState({roomName: name});
      console.log(name);
    });
  }

  backToRoomList() {
    socket.emit('leave room', this.state.roomName);
    this.setState({roomName: null});
  }

  render() {
    let room = '';
    let roomList = '';
    if (this.state.roomName !== null) {
      room = <Room roomName={this.state.roomName} backToRoomList={this.backToRoomList}/>;
    } else {
      roomList = <RoomList RoomNames={["hello", "room 2", "Matt's Room"]} />;
    }
    return (
      <div>
        {roomList}
        {room}
      </div>
    );
  }
}

class RoomList extends Component {
  handleClick(name) {
    return (
      function() {socket.emit('enter room', name)
    });
  }

  render() {
    const RoomNames = this.props.RoomNames;
    const ListItems = RoomNames.map((name) =>
    <li key={name} onClick={this.handleClick(name)}>{name}</li>
    );
    return (
      <ul>{ListItems}</ul>
    );
  }
}

class Room extends Component {
  constructor() {
    super();
    this.state = {chatLog: ["hello"],
                  chatInput: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({chatInput: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit('chat message', {roomName: this.props.roomName, message: this.state.chatInput});
    this.setState({chatInput: ""});
  }

  componentDidMount() {
    socket.on('chat message', message => {
      this.setState({chatLog: this.state.chatLog.concat([message])});
    });
  }

  render() {
    let messageItems = this.state.chatLog.map((message, index) => {
      return (<div key={index}>{message}</div>)
    });
    //let messageItems = this.state.chatLog.map((message) => {
    //  <div>hello</div>
    //});
    console.log(messageItems);
    return (
      <div>
        <h1>Room: {this.props.roomName}</h1>
        <button onClick={this.props.backToRoomList}>Back to Room List</button>
        <div>
          {messageItems}
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.chatInput} onChange={this.handleChange} />
          <input type="submit" value="Submit Message" />
        </form>
      </div>
    )
  }
}

export default App;
