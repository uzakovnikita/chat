import React, { useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import { observer } from "mobx-react"
import auth from '../../store/auth';
import {URLS} from '../../constants/enums';

const Login: FunctionComponent = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name)
        await auth.login(name, password);
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

export default observer(Login);