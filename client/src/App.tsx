import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {io, Socket} from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import './App.css';

const URL = 'http://localhost:1000';

const App: FunctionComponent = () => {
    const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | {[key: string]: any}>();
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        socket.current = io(URL, {autoConnect: false})
        socket.current?.on('session', ({sessionID, userID}:{sessionID: string, userID: string}) => {
            if (socket.current) {
                socket.current.auth = {sessionID};
                socket.current.userID = userID;
            }
            localStorage.setItem('sessionID', sessionID);
        })
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
            socket.current.auth = {username: inputUserName.current?.value}
        };
        socket.current?.connect();
    }

    const inputUserName = useRef<HTMLInputElement>(null);

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
                <button type="submit">Авторизоваться</button>
            </form>
            <ul className="messages">
                {messages.map((message => <li className="messages__message">{message}</li>))}
            </ul>
        </div>
    )
};

export default App;