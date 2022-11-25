import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { ImUpload } from 'react-icons/im';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [noti, setNoti] = useState();
  const [roomName, setRoomName] = useState();
  const [previewImg, setPreviewImg] = useState();
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

      await socket.emit("send_message", messageData, room);//dispatch = emit
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
      setTimeout(() => {
        window.close()
      }, 350);
    }
  }

  async function changeFile(e) {
    let file = (e.target.files[0]);
    let objectURL = URL.createObjectURL(file)
    setPreviewImg(objectURL ? objectURL : '');
    const messageData = {
      room: room,
      author: username,
      message: objectURL,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit("send_message", messageData, messageData.room);//dispatch = emit
    setMessageList((list) => [...list, messageData]);
    setPreviewImg();
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
      {console.log(messageList, room)}
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            if (typeof messageContent.message === 'string' && messageContent.message.includes('blob')) {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  {/* <img src={messageContent.message} alt="img" className="messImg" /> */}

                  <div className="imgMesss">
                    <img src={messageContent.message} alt="img" className={username === messageContent.author ? "leftMessImg" : "rightMessImg"} />
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              )
            }
            else if (typeof messageContent === 'string') {
              return (<div style={{ textAlign: "center" }}>
                <span>{messageContent}</span>
              </div>)
            }
            else {
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


            // return (
            //   <div
            //     className="message"
            //     id={username === messageContent.author ? "you" : "other"}
            //   >
            //     <div>
            //       <div className="message-content">
            //         <p>{messageContent.message}</p>
            //       </div>
            //       <div className="message-meta">
            //         <p id="time">{messageContent.time}</p>
            //         <p id="author">{messageContent.author}</p>
            //       </div>
            //     </div>
            //   </div>
            // )

          })}

          <div className="span" >{ }</div  >
          <button onClick={quit}>quit</button>
          {noti && roomName === room && <span>{noti + ' at ' + roomName}</span>}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          className="ip"
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

        <div className="previewImg" style={{ backgroundImage: `url(${previewImg})` }}></div>

        <input type="file" id="preview" hidden onChange={changeFile} />

        <label htmlFor="preview"><ImUpload className="uploadIcon" /></label>

        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div >
  );
}

export default Chat;
