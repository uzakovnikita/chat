import React from 'react';
import { FunctionComponent } from 'react';


const Auth: FunctionComponent = () => {
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('login');
    }
    return (
        <div>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="введите логин" />
                <button type="submit">Войти</button>
            </form>
        </div>
    )
};

export default Auth;