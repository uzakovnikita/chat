import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import { observer } from "mobx-react"
import auth from '../../store/auth';
import styled from 'styled-components';

import AuthForm from '../../components/styledComponents/AuthForm';
import Button from '../../components/styledComponents/Button';
import AuthInput from '../../components/styledComponents/AuthInput';
import Text from '../../components/styledComponents/Text';

const SignupContainer = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

`

const Login: FunctionComponent = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name)
        await auth.login(name, password);
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