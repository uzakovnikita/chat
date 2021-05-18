import React, { useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import {URLS} from '../../constants/enums';

const Login: FunctionComponent = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name)
        const response = await fetch(URLS.Login, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.trim(),
                password: password.trim()
            })
        });
        const result = await response.json();
        
    }
    return (
        <div>
            login
            <form onSubmit={handleLogin}>
                <input type="text" value={name} placeholder="введите логин" onChange={(e) =>setName(e.target.value)}/>
                <input type="password" value={password} placeholder="введите пароль" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Войти</button>
            </form>
        </div>
    )
};

export default Login;