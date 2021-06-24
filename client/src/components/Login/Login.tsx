import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { observer } from "mobx-react"

import { useRouter } from 'next/router';
import styled from 'styled-components';

import AuthForm from '../../components/styledComponents/AuthForm';
import Button from '../../components/styledComponents/Button';
import AuthInput from '../../components/styledComponents/AuthInput';
import Text from '../../components/styledComponents/Text';
import { ContextAuth } from '../../store/contexts';
import { Auth } from '../../store/auth';

const SignupContainer = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

`

const Login: FunctionComponent = () => {
    const [email, setName] = useState('');
    const [password, setPassword] = useState('');
    const auth = useContext(ContextAuth) as Auth;
    const router = useRouter();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await auth.login(email, password);
            router.push('/rooms', undefined, {
                shallow: true
            });
        } catch (err) {
            alert(`login failed with error, try refresh this page`)
            console.log(err);
        }
    }
    return (
        <SignupContainer>
            <Text>Login</Text>
            <AuthForm onSubmit={handleLogin}>
                <AuthInput type="email" value={email} placeholder="Enter login" onChange={(e) =>setName(e.target.value)}/>
                <AuthInput type="password" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit">Login</Button>
            </AuthForm>
        </SignupContainer>  
    )
};

export default observer(Login);