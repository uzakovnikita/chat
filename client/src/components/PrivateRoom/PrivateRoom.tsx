import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import chat from '../../store/chat';
import common from '../../store/common';

import Title from '../../components/styledComponents/Title';
import MessagesContainer from '../styledComponents/MessagesContainer';
import MessageInput from '../../components/styledComponents/MessageInput';
import SendBox from '../../components/styledComponents/SendBox';


const PrivateRoom: FunctionComponent = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [messageText, setMessageText] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        common.send(chat.privateRoomWith.userID, messageText);
        setMessageText('');
    }
    useEffect(() => {
        common.newMessage()
    }, [])
    return (
        <>
            <Title>
                Собеседник: {chat.privateRoomWith.name}
            </Title>
            <ul>
            {JSON.stringify(common.messages['60a4d22cef956221d85e50ef'])}
            </ul>

            <MessagesContainer className="messages-container">
                
            </MessagesContainer>
            <SendBox onSubmit={handleSubmit} ref={formRef}>
                <MessageInput onChange={(e) => setMessageText(e.target.value)} value={messageText}></MessageInput>
            </SendBox>
        </>
    );
};

export default observer(PrivateRoom);
