import React, {
    FunctionComponent,
    useState,
    useContext,
    useEffect,
    useRef,
    useLayoutEffect
} from 'react';
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
    }, []);
    
    useEffect(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, []);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <>  
            <Title>{chat.interlocutorName}</Title>
            <MessagesContainer  id="messages-container">
                {chat.messages[chat.idCurrentPrivateRoom as string].map((msg: { from: string | null; messageBody: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; _id: string }) => {
                    const isFromSelfMsg = msg.from === auth.id;
                    return (<SingleMessage align={isFromSelfMsg ? 'flex-end' : 'flex-start'} key={msg._id}>
                        {msg.messageBody}
                    </SingleMessage>)
                })}
                <div ref={containerRef}></div>
            </MessagesContainer>
            <SendBox onSubmit={handleSubmit}>
                <MessageInput
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                ></MessageInput>
                <MessageInput type='submit'></MessageInput>
            </SendBox>
        </>
    );


};

export default observer(PrivateRoom);
