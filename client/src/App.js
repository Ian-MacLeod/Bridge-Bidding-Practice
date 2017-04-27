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
    socket.on('join room', function(name){
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
    if (this.state.roomName !== null) {
      room = <Room RoomName={this.state.roomName} backToRoomList={this.backToRoomList}/>;
    }
    return (
      <div>
        <RoomList RoomNames={["hello", "room 2", "Matt's Room"]} />
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
  render() {
    return (
      <button onClick={this.props.backToRoomList}>Back to Room List</button>
    )
  }
}

export default App;
