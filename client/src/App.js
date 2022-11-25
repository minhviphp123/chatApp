import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");//connect to server

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {console.log(room)}
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <h2>Choose room</h2>
          <div className="btns">
            <button onClick={() => setRoom('Room1')} className='btn'>Room1</button>
            <button onClick={() => setRoom('Room2')} className='btn'>Room2</button>
            <button onClick={() => setRoom('Room3')} className='btn'>Room3</button>
          </div>
          <input
            type="text"
            placeholder="Room ID..."
            value={room}
            hidden
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

      <a href="http://localhost:4000" target='_blank'>New User</a>

    </div>
  );
}

export default App;
