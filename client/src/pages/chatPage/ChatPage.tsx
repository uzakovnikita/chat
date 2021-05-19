import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import {observer} from 'mobx-react-lite';
import styled from 'styled-components';
import auth from '../../store/auth';
import common from '../../store/common';
import chat from '../../store/chat';

import Users from '../../components/Users';
import PrivateRoom from '../../components/PrivateRoom';


const ChatPage: FunctionComponent = () => {
    useEffect(() => {
        try {
            console.log(auth.id);
            common.connect(auth.id);
            common.getUsers();
        } catch (err) {
            common.registrError(String(err));
        }
    }, []);

    return (
        <>
            {chat.isPrivateRoom && <PrivateRoom/>}
            {!chat.isPrivateRoom && <Users/>}
        </>
    );
};

export default observer(ChatPage);
