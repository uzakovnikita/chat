import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Title from '../../components/styledComponents/Title';
import MessagesContainer from '../styledComponents/MessagesContainer';
import MessageInput from '../../components/styledComponents/MessageInput';
import SendBox from '../../components/styledComponents/SendBox';
import SingleMessage from '../styledComponents/SingleMessage';

import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';

const PrivateRoom: FunctionComponent = () => {
    const [messageText, setMessageText] = useState('');
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        chat.send(messageText, auth.id as string);
        setMessageText('');
    };
    useEffect(() => {
        chat.listenMessages();
    }, [chat]);
    return (
        <MessagesContainer>
            <Title>
                {chat.interlocutorName}
            </Title>
            {JSON.stringify(chat.messages[chat.idCurrentPrivateRoom as string], null, 2)}
            <SendBox onSubmit={handleSubmit}>
                <MessageInput value={messageText} onChange={(e) => setMessageText(e.target.value)}></MessageInput>
                <MessageInput type="submit"></MessageInput>
            </SendBox>
        </MessagesContainer>
    );
};

export default observer(PrivateRoom);
