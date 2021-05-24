import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';

import Title from '../../components/styledComponents/Title';
import MessagesContainer from '../styledComponents/MessagesContainer';
import MessageInput from '../../components/styledComponents/MessageInput';
import SendBox from '../../components/styledComponents/SendBox';
import SingleMessage from '../styledComponents/SingleMessage';

import {ContextCommon, ContextChat, ContextAuth} from '../../store/contexts';
import {Common} from '../../store/sockets';
import {Chat} from '../../store/chat';

const PrivateRoom: FunctionComponent = () => {
    const [messageText, setMessageText] = useState('');
    const common = useContext(ContextCommon) as Common;
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        common.send(chat.privateRoomWith.userID, messageText);
        setMessageText('');
    };
    useEffect(() => {
        common.listenMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const interlocutorId = chat.privateRoomWith.userID;
    
    // todo selfId
    const selfId = (auth as {id: string}).id;

    const interlocutorName = chat.privateRoomWith.name;
    
    const {messages} = common;
    
    const interlocutorMessage = messages[interlocutorId];
    const selfMessage = messages[selfId];

    const lastIndexOfMessage = Math.max(messages[interlocutorId]?.length ?? 0, messages[selfId]?.length ?? 0);

    const historyOfMessages = [];
    
    return (
        <>
            <Title>
                Собеседник: {interlocutorName}
            </Title>

            <MessagesContainer className="messages-container">
                
                {common.messages[chat.privateRoomWith.userID] ? common.messages[chat.privateRoomWith.userID].map(message => <SingleMessage align={'flex-start'}>{message}</SingleMessage>) : null}    
            </MessagesContainer>

            <SendBox onSubmit={handleSubmit}>
                <MessageInput onChange={(e) => setMessageText(e.target.value)} value={messageText}></MessageInput>
            </SendBox>
        </>
    );
};

export default observer(PrivateRoom);
