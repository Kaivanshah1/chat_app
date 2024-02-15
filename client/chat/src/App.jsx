import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function App() {
  const [username, setUsername] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('received-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    console.log(messages)
  }, [socket, messages]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: newMessage,
      user: username,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(), // Replace semicolon with a comma
    };

    if(!newMessage == ''){
      socket.emit('send-message', messageData);
    }
    else{
      alert('Please enter a message')
    }
  };

  return (
    <div className='w-screen h-screen bg-gray-100'>
      {chatActive ? (
        <div>
          <h1>Squad chat</h1>
          <div>
            <div className='overflow-scroll h-[80vh] lg:w-[60vh]'>
              {
                messages.map((message, index) => (
                  <div key={index} className='flex rounded-md shadow-md my-5 w-fit'>
                    <div className='bg-green-400'>
                      <h3 className='font-bold text-lg px-2'>{message.user.charAt(0).toUpperCase()}</h3>
                    </div>
                    <div className='px-2 bg-white rounded-md'>
                      <span>{message.user}</span>
                      <h3>{message.message}</h3>
                      <h3>{message.time}</h3>
                    </div>
                  </div>
                ))
              }
            </div>
            <form className='flex gap-2 md:gap-3' onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Type your message'
                className='rounded-md border-2 outline-none px-3'
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type='submit' className='bg-green-500 text-white rounded-md p-3 font-bold'>
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className='flex flex-row h-screen w-screen items-center justify-center'>
          <form className='flex gap-2'>
            <input
              type='text'
              name=''
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id=''
              className='text-center p-3 border-2 rounded-md outline-none'
            />
            <button
              type='button'
              className='bg-green-500 p-3 text-white rounded-md font-bold'
              onClick={(e) => username !== '' && setChatActive(true)}
            >
              Start Chat
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
