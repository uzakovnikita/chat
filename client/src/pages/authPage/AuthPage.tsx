import React, { FunctionComponent, useState } from 'react';

import styled from 'styled-components';

import Login from '../../components/Login';
import Signup from '../../components/Signup';

import {COLORS} from '../../constants/enums';

const Button = styled.button`
    width: 50px;
    height: 30px;
    background-color: ${COLORS.Blue42};
    border: none;
    cursor: pointer;
`;
const Main = styled.main`
    width: 100%;
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px;
`

const AuthPage: FunctionComponent = () => {
    const [view, setView] = useState(false);
    return (
        <Main>
            <Button onClick={() => setView(prevState => !prevState)}>Toggle button</Button>
            {view && <Login/>}
            {!view && <Signup/>}
        </Main>
    )
};

export default AuthPage;