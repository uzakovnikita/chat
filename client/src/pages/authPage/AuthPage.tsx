import React, { FunctionComponent, useState } from 'react';

import styled from 'styled-components';

import Login from '../../components/Login';
import Signup from '../../components/Signup';

import {COLORS} from '../../constants/enums';

const Button = styled.button`
    width: 50px;
    height: 30px;
    background-color: ${COLORS.Blue42}
    border: none,
`

const AuthPage: FunctionComponent = () => {
    const [view, setView] = useState(false);
    return (
        <main>
            <Button type="submit" onClick={() => setView(prevState => !prevState)}></Button>
            {view&& <Login/>}
            {!view&& <Signup/>}
        </main>
    )
};

export default AuthPage;