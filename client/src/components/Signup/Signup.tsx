import React, { useState, FunctionComponent } from 'react';
import styled from 'styled-components';

import {URLS} from '../../constants/enums';

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

const Signup: FunctionComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(URLS.Signup, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.trim(),
                password: password.trim()
            })
        });
        const result = await response.json();
    }
    return (
        <SignupContainer>
            <Text>Signup</Text>
            <AuthForm onSubmit={handleSignup}>
                <AuthInput type="text" value={email} placeholder="Enter login" onChange={(e) =>setEmail(e.target.value)}/>
                <AuthInput type="password" value={password} placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit">Signup</Button>
            </AuthForm>
        </SignupContainer>  
    )
};

export default Signup;