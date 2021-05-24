import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { observer } from "mobx-react"

import styled from 'styled-components';

import AuthForm from '../../components/styledComponents/AuthForm';
import Button from '../../components/styledComponents/Button';
import AuthInput from '../../components/styledComponents/AuthInput';
import Text from '../../components/styledComponents/Text';
import { ContextAuth, ContextChat, ContextCommon } from '../../store/contexts';
import { Auth } from '../../store/auth';
import { Common } from '../../store/sockets';
import { Chat } from '../../store/chat';


const SignupContainer = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

`

const Login: FunctionComponent = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const auth = useContext(ContextAuth) as Auth;
    const common = useContext(ContextCommon) as Common;
    const chat = useContext(ContextChat) as Chat;
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await auth.login(name, password);
            common.connect(auth.id);
            await chat.getRooms(auth.id as string);
        } catch (err) {
            alert(`login failed with error, try refresh this page`)
            console.log(err);
        }
    }
    return (
        <SignupContainer>
            <Text>Login</Text>
            <AuthForm onSubmit={handleLogin}>
                <AuthInput type="text" value={name} placeholder="введите логин" onChange={(e) =>setName(e.target.value)}/>
                <AuthInput type="password" value={password} placeholder="введите пароль" onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit">Войти</Button>
            </AuthForm>
        </SignupContainer>  
    )
};

export default observer(Login);