import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [noti, setNoti] = useState();
  const [roomName, setRoomName] = useState();
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);//dispatch = emit
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const quit = async () => {
    if (currentMessage === '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("quitRoom", messageData);
      // setMessageList((list) => [...list, messageData]);
      // console.log(1);
      setTimeout(() => {
        window.close()
      }, 350);
    }
  }

  useEffect(() => { //receive mess
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    socket.on("rec_noti", (noti, room) => {
      setNoti(noti, setRoomName(room));
    });

  }, [socket]);

  return (
    <div className="chat-window">
      {console.log(messageList)}
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            if (messageContent.time === undefined) {
              return (
                <div style={{
                  textAlign: "center"
                }}>{messageContent}</div>
              );
            } else {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              )
            }
          })}

          <div className="span" >{ }</div  >
          <button onClick={quit}>quit</button>
          {noti && roomName === room && <span>{noti + ' at ' + roomName}</span>}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div >
  );
}

export default Chat;
