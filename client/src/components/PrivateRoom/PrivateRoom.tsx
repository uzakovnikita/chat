/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    FunctionComponent,
    useState,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { lightFormat } from 'date-fns';

import parseDateFromId from '../../utils/parseDateFromId';

import Title from '../../components/styledComponents/Title';
import MessagesContainer from '../styledComponents/MessagesContainer';
import MessageInput from '../../components/styledComponents/MessageInput';
import SendBox from '../../components/styledComponents/SendBox';
import SingleMessage from '../styledComponents/SingleMessage';
import SendButton from '../styledComponents/SendButton';

import { ContextChat, ContextAuth } from '../../store/contexts';
import { Chat } from '../../store/chat';
import { Auth } from '../../store/auth';
import { message } from '../../constants/types';

type FlexContainerProps = {
    isShow: boolean;
};

const FlexContainer = styled.div<FlexContainerProps>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
    opacity: ${(props) => (props.isShow ? 1 : 0)};
    transition: 0.3s;
`;

const TimeOnMessage = styled.span`
    font-size: 10px;
    opacity: 0.5;
    font-family: ${(props) => props.theme.fonts.primary};
    position: absolute;
    right: 4px;
    bottom: 4px;
`;

const DateOfMessage = styled.span`
    background-color: ${(props) => props.theme.colors['secondary-bg']};
    color: ${(props) => props.theme.colors['light-gray']};
    position: sticky;
`;

const PrivateRoom: FunctionComponent<{ messages: message[] }> = ({
    messages,
}) => {
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageText.trim().length < 1) {
                return;
            }
            chat.send(messageText, auth.id as string);
            setMessageText('');
        }
    };

    useEffect(() => {
        chat.listenMessages();
    }, [chat]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && chat.isFetchedMessage) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
            if (!isScrolledToBottom) setScrolledToBottom(true);
        }
    }, [chat.isFetchedMessage, chat.messages.length]);

    return (
        <FlexContainer isShow={isScrolledToBottom}>
            <Title>{chat.interlocutorName}</Title>
            <MessagesContainer
                ref={containerRef}
                className={isScrolledToBottom ? 'smooth' : ''}
            >
                {messages.reduce((acc: any[], msg: message, index, array) => {
                    const isFromSelfMsg = msg.from === auth.id;
                    const timeInMilliseconds = parseDateFromId(msg._id);
                    const time = lightFormat(timeInMilliseconds, 'HH-MM');
                    const currentDate = lightFormat(
                        timeInMilliseconds,
                        'dd-MM',
                    );
                    const previuosMessage = index > 0 ? array[index - 1] : null;
                    const previuosTimeInMilliseconds = previuosMessage
                        ? parseDateFromId(previuosMessage._id)
                        : null;
                    const previuosDate = previuosTimeInMilliseconds
                        ? lightFormat(previuosTimeInMilliseconds, 'dd-MM')
                        : null;
                    if (previuosDate !== currentDate) {
                        acc.push([
                            <div key={msg._id}>
                                <DateOfMessage>{currentDate}</DateOfMessage>
                                <SingleMessage
                                    align={
                                        isFromSelfMsg
                                            ? 'flex-end'
                                            : 'flex-start'
                                    }
                                    key={msg._id}
                                >
                                    {msg.messageBody}
                                    <TimeOnMessage>
                                        {time.split('-').join(':')}
                                    </TimeOnMessage>
                                </SingleMessage>
                            </div>,
                        ]);
                        return acc;
                    }
                    const lastElInAcc = acc[acc.length - 1];
                    lastElInAcc.push(
                        <SingleMessage
                            align={isFromSelfMsg ? 'flex-end' : 'flex-start'}
                            key={msg._id}
                        >
                            {msg.messageBody}
                            <TimeOnMessage>
                                {time.split('-').join(':')}
                            </TimeOnMessage>
                        </SingleMessage>,
                    );
                    return acc;
                }, [])}
                {/* {messages.map((msg: message, index, arr) => {
                    const isFromSelfMsg = msg.from === auth.id;
                    const timeInMilliseconds = parseDateFromId(msg._id);
                    const time = lightFormat(timeInMilliseconds, 'HH-MM');
                    const currentDate = lightFormat(
                        timeInMilliseconds,
                        'dd-MM',
                    );
                    const previuosMessage = index > 0 ? arr[index - 1] : null;
                    const previuosTimeInMilliseconds = previuosMessage
                        ? parseDateFromId(previuosMessage._id)
                        : null;
                    const previuosDate = previuosTimeInMilliseconds
                        ? lightFormat(previuosTimeInMilliseconds, 'dd-MM')
                        : null;
                    return (
                        <React.Fragment key={msg._id}>
                            {previuosDate !== currentDate ? (
                                <DateOfMessage>{currentDate}</DateOfMessage>
                            ) : null}
                            <SingleMessage
                                align={
                                    isFromSelfMsg ? 'flex-end' : 'flex-start'
                                }
                                key={msg._id}
                            >
                                {msg.messageBody}
                                <TimeOnMessage>
                                    {time.split('-').join(':')}
                                </TimeOnMessage>
                            </SingleMessage>
                        </React.Fragment>
                    );
                })} */}
            </MessagesContainer>
            <SendBox onSubmit={handleSubmit}>
                <MessageInput
                    padding={'20px'}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                ></MessageInput>
                <SendButton
                    value=''
                    type='submit'
                    img={'/images/svg/send.svg'}
                    img-hover={'/images/svg/send-hover.svg'}
                />
            </SendBox>
        </FlexContainer>
    );
};

export default observer(PrivateRoom);
