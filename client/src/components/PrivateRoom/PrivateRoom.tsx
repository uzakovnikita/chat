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
import IconSend from '../styledComponents/Icons/IconSend';

import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';

const PrivateRoom: FunctionComponent = () => {

    const [messageText, setMessageText] = useState('');
    const [isShowContent, setIsShowContent] = useState(false);
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

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && chat.countMessage > 0) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
            setIsShowContent(true);
        }
    }, [chat.countMessage]);
    return (
        <>
            {(chat.isShowPreloader) && <Preloader />}
            {
                <>
                    <Title>{chat.interlocutorName}</Title>
                    <MessagesContainer ref={containerRef}>
                        {chat.messages[chat.idCurrentPrivateRoom as string].map((msg: { from: string; messageBody: string; _id: string }) => {
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
                        ></MessageInput>
                        <MessageInput type='submit' padding={'20px'} img={'./images/svg/icon-send.svg'} value="">
                        </MessageInput>
                    </SendBox>
                </>
            }

        </>
    );
};

export default observer(PrivateRoom);
