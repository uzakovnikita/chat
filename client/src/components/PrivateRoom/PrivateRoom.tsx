import React, {
    FunctionComponent,
    useState,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { observer } from 'mobx-react-lite';

import Title from '../../components/styledComponents/Title';
import MessagesContainer from '../styledComponents/MessagesContainer';
import MessageInput from '../../components/styledComponents/MessageInput';
import SendBox from '../../components/styledComponents/SendBox';
import SingleMessage from '../styledComponents/SingleMessage';
import Preloader from '../Preloader';
import SendButton from '../styledComponents/SendButton';

import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';
import { message } from '../../constants/types';

const PrivateRoom: FunctionComponent<{messages:message[]}> = ({messages}) => {

    const [messageText, setMessageText] = useState('');
    const [isScrolledToBottom, setScrolledToBottom] = useState(false);

    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.length < 1) {
            return;
        }
        chat.send(messageText, auth.id as string);
        setMessageText('');
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (messageText.trim().length < 1) {
                return;
            }
            chat.send(messageText, auth.id as string);
            setMessageText('');
        }
    }

    useEffect(() => {
        chat.listenMessages();
    }, [chat]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && chat.messages.length > 0) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
            if (!isScrolledToBottom) setScrolledToBottom(true);
        }
    }, [chat.messages.length]);



    return (
        <>
            {!isScrolledToBottom && <Preloader />}
            {
                <>
                    <Title>{chat.interlocutorName}</Title>
                    <MessagesContainer ref={containerRef} className={isScrolledToBottom ? 'smooth' : ''}>
                        {messages.map((msg: { from: string; messageBody: string; _id: string }) => {
                            const isFromSelfMsg = msg.from === auth.id;
                            return (<SingleMessage align={isFromSelfMsg ? 'flex-end' : 'flex-start'} key={msg._id}>
                                {msg.messageBody}
                            </SingleMessage>)
                        })}
                    </MessagesContainer>
                    <SendBox onSubmit={handleSubmit}>
                        <MessageInput
                            padding={'20px'}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyUp={handleKeyUp}
                        ></MessageInput>
                        <SendButton value='' type='submit' img={'/images/svg/send.svg'} img-hover={'/images/svg/send-hover.svg'}/>
                    </SendBox>
                </>
            }

        </>
    );
};

export default observer(PrivateRoom);
