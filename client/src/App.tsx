
import React, { useEffect } from 'react';
import {io} from 'socket.io-client';
import './App.css';

const App = () => {
    useEffect(() => {
        const socket = io('http://localhost:1000');
        socket.on('connect', () => {
            socket.send('hello')
        })
    }, [])
    return (
        <div className="app">
        </div>
    )
};

export default App;