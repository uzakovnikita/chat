import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {io, Socket} from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import './App.css';

const URL = 'http://localhost:1000';

const App: FunctionComponent = () => {
    const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        socket.current = io(URL, {autoConnect: false})
        socket.current.on('connect', () => {
            socket.current?.send('hello')
        })
        socket.current.onAny((event, ...args) => {
            console.log(event, args);
        })
        socket.current?.on('message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });
    }, []);



    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }
    
    const handleSubmitMessage = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault();
        socket.current?.send(message);
        setMessage('');
    }

    const handleAuth = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (socket.current) {
            socket.current.auth = {username: e.target.value}
        };
        socket.current?.connect();
    }

    const inputUserName = useRef(null);

    return (
        <div className="app">
            <form onSubmit={handleSubmitMessage} style={{display: 'flex', flexDirection: 'column', maxWidth: '300px'}}>
                <input type="text" onChange={handleTyping} value={message}/>
                <button type="submit" style={{width: '70px', height: '20px', display: 'flex', justifyContent: 'center'}}>отправить</button>
            </form>
            <br />
            <form className="user" style={{display: 'flex', flexDirection: 'column', maxWidth: '300px'}} onSubmit={handleAuth}>
                <label htmlFor="username">Имя пользователя</label>
                <input id="username" type="text" ref={inputUserName}/>
            </form>
            <ul className="messages">
                {messages.map((message => <li className="messages__message">{message}</li>))}
            </ul>
        </div>
    )
};

export default App;