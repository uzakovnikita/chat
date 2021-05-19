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
        <SignupContainer>
            <Text>Signup</Text>
            <AuthForm onSubmit={handleSignup}>
                <AuthInput type="text" value={name} placeholder="введите логин" onChange={(e) =>setName(e.target.value)}/>
                <AuthInput type="password" value={password} placeholder="введите пароль" onChange={(e) => setPassword(e.target.value)}/>
                <Button type="submit">Зарегистрироваться</Button>
            </AuthForm>
        </SignupContainer>  
    )
};

export default Signup;