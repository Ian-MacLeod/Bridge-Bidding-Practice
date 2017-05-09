import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const socket = require('socket.io-client')();

// commit the crazy branch we made before reverting and doing productive things

/*
Note: we just finished creating custom rooms and updating the list for 1 user

1.) When a new room created, update list for all users
2.) Create login page
3.) Create user tables
4.) Make rooms only have 2 person capacity
5.) Make rooms automatically disappear when no one is in them
6.) Figure out passwords
7.) Figure out a better way to do the 10 milisec delay on roomList update
8.) Figure out why the get room list emit is failing sometimes

1.) Create card objects
2.) Deal out a hand
3.) Enable bidding
4.) Stand up/sit down at table
5.) Chat box shows who typing da thing
6.) Button for new hand
7.) Handle when two people pass
*/

class App extends Component {
  constructor() {
    super();
    this.state = {roomName: null,
                  roomList: [],
                  userName: null};
    this.backToRoomList = this.backToRoomList.bind(this);
  }

  componentDidMount() {
    socket.on('enter room', name => {
      this.setState({roomName: name});
    });
    socket.on('room list', roomList => {
      this.setState({roomList: roomList});
      console.log(roomList);
    });
    socket.emit('get room list');
    socket.emit('get room list');/*
    setTimeout(function(){
      socket.emit('get room list')
    }, 100);*/

  }

  backToRoomList() {
    socket.emit('leave room', this.state.roomName);
    this.setState({roomName: null});
  }

  render() {
    let room = '';
    let roomList = '';
    let login = '';
    if (this.state.userName === null) {
      login = <LoginPage />;
    } else if (this.state.roomName !== null) {
      room = <Room roomName={this.state.roomName} backToRoomList={this.backToRoomList}/>;
    } else {
      roomList = <RoomList RoomNames={this.state.roomList} />;
    }
    return (
      <div>
        {login}
        {roomList}
        {room}
      </div>
    );
  }
}

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {usernameInput: "", passwordInput: ""};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit('test', {username: this.state.usernameInput, password: this.state.passwordInput});
    this.setState({usernameInput: ""});
    this.setState({passwordInput: ""});
  }

  handleUsernameChange(event) {
    this.setState({usernameInput: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({passwordInput: event.target.value});
  }
//onSubmit={this.handleSubmit}>
  render() {
    return (
      <div>
        <form action="/login" method="post">
          <div>
            <label>Username:</label>
            <input name="username" type="text" value={this.state.usernameInput} onChange={this.handleUsernameChange}/>
          </div>
          <div>
            <label>Password:</label>
          </div>
          <input name="password" type="password" value={this.state.passwordInput} onChange={this.handlePasswordChange}/>
          <div>
            <input type="submit" value="Log In"/>
          </div>
        </form>
      </div>
    );
  }
}

class RoomList extends Component {
  constructor() {
    super();
    this.state = {roomNameInput: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleClick(name) {
    return (
      function() {socket.emit('enter room', name)
    });
  }

  handleChange(event) {
    this.setState({roomNameInput: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit('create room', this.state.roomNameInput);
    this.setState({roomNameInput: ""});
  }

  render() {
    const RoomNames = this.props.RoomNames;
    const ListItems = RoomNames.map((name) =>
    <li key={name} onClick={this.handleClick(name)}>{name}</li>
    );
    return (
      <div>
        <ul>{ListItems}</ul>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.roomNameInput} onChange={this.handleChange} />
          <input type="submit" value="Create New Room" />
        </form>
      </div>
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
