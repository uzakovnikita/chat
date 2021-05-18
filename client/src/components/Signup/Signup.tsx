import React, { useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import {URLS} from '../../constants/enums';

const Signup: FunctionComponent = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name)
        const response = await fetch(URLS.Signup, {
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
        console.log(result);
    }
    return (
        <div>
            Signup
            <form onSubmit={handleSignup}>
                <input type="text" value={name} placeholder="введите логин" onChange={(e) =>setName(e.target.value)}/>
                <input type="password" value={password} placeholder="введите пароль" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Войти</button>
            </form>
        </div>  
    )
};

export default Signup;