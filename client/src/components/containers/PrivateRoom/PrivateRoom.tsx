/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { lightFormat } from 'date-fns';

import dateToText from '../../../utils/dateToText';
import parseDateFromId from '../../../utils/parseDateFromId';

import useThrottle from '../../../hooks/useThrottle';
import useAuthContext from '../../../hooks/useAuthContext';
import useChatContext from '../../../hooks/useChatContext';
import useFSM from '../../../hooks/useFSM';

import Title from '../../styledComponents/Title';
import MessagesContainer from '../../styledComponents/MessagesContainer';
import MessageInput from '../../styledComponents/MessageInput';
import SendBox from '../../styledComponents/SendBox';
import SingleMessage from '../../styledComponents/SingleMessage';
import SendButton from '../../styledComponents/SendButton';
import HeaderContainer from '../../styledComponents/HeaderContainer';
import Logout from '../../Logout';
import GoHome from '../../GoHome';

import Chat from '../../../store/Chat';
import Auth from '../../../store/Auth';
import { message } from '../../../constants/types';
import { ARIA_NAMES } from '../../../constants/enums';

type isShowProps = {
    isShow: boolean;
};

const FlexContainer = styled.div<isShowProps>`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 110px);
    box-sizing: border-box;
    opacity: ${(props) => (props.isShow ? 1 : 0)};
    transition: 0.3s;
`;

const DateContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    box-sizing: border-box;
    padding-top: 8px;
`;

const TimeOnMessage = styled.span`
    font-size: 10px;
    opacity: 0.5;
    font-family: ${(props) => props.theme.fonts.primary};
    position: absolute;
    right: 4px;
    bottom: 4px;
`;

const DateOfMessage = styled.span<isShowProps>`
    display: inline-flex;
    position: sticky;
    z-index: 1000;
    top: 10px;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.theme.colors['purple-grad']};
    color: ${(props) => props.theme.colors['white']};
    border-radius: ${(props) => props.theme.radiuses.medium};
    font-family: ${(props) => props.theme.fonts.primary};
    padding: 4px;
    box-sizing: border-box;
    opacity: 0.9;
    box-shadow: 0 0 12px ${(props) => props.theme.colors['purple']};
    align-self: center;
    min-height: 30px;
    opacity: ${(props) => (props.isShow ? 1 : 0)};
    transition: 0.3s;
`;

const NewMessagesCounterWrapper = styled.div`
    position: absolute;
    bottom: 160px;
    right: 20px;
`;

const NewMessagesCounter = styled.button<isShowProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 10px;
    font-size: 20px;
    outline: none;
    border: none;
    transition: 0.3s;
    cursor: ${(props) => (props.isShow ? 'pointer' : 'inherit')};
    font-family: ${(props) => props.theme.fonts.primary};
    opacity: ${(props) => (props.isShow ? 1 : 0)};
    background-color: ${(props) => props.theme.colors['purple']};
    color: ${(props) => props.theme.colors.white};
    border-radius: 25px;
    z-index: ${(props) => (props.isShow ? 10 : -100)};
`;
const DownArrow = styled.div<isShowProps>`
    position: absolute;
    top: 18px;
    // z-index: -10;
    background-image: url('/images/svg/down.svg');
    background-size: cover;
    background-position: center;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    opacity: ${(props) => (props.isShow ? 0.5 : 0)};
    z-index: ${(props) => (props.isShow ? 10 : -100)};
    transition: 0.3s;
    cursor: ${(props) => (props.isShow ? 'pointer' : 'inherit')};
    &:hover {
        opacity: ${(props) => (props.isShow ? 0.9 : 0)};
    }
`;

const splitMessageByDate = (
    messages: message[],
): { [key: string]: message[] } => {
    return messages.reduce((acc: { [key: string]: message[] }, msg) => {
        const timeInMilliseconds = parseDateFromId(msg._id);
        const currentDate: string = lightFormat(
            timeInMilliseconds,
            'yyyy-MM-dd',
        );
        const prevValue = acc[currentDate] ? acc[currentDate] : [];
        const newAcc = { ...acc, [currentDate]: [...prevValue, msg] };
        return newAcc;
    }, {});
};

const PrivateRoom: FunctionComponent = () => {
    const chatStore = useChatContext() as Chat;
    const authStore = useAuthContext() as Auth;

    const [messageText, setMessageText] = useState('');
    const [isShowContent, setIsShowContent] = useState(false);
    const [isShowTooltipOfDate, setIsShowTooltipOfDate] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [counterOfNewMessages, setCounterOfNewMessages] = useState(0);
    const [isShowCounter, setIsShowCounter] = useState(false);
    const [isShowArrDown, setIsShowArrDown] = useState(false);
    const [isSmoothScroll, setIsSmoothScroll] = useState(false);

    // FSM STATE AND EVENT

    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    useFSM({
        authStore,
        chatStore,
        scrollTop,
        containerRef,
        setIsSmoothScroll,
        setIsShowContent,
        setIsShowArrDown,
        setIsShowCounter,
        setCounterOfNewMessages,
    });

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        containerRef.current!.addEventListener('scroll', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            containerRef.current?.removeEventListener(
                'scroll',
                handleMouseMove,
            );
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [chatStore.idCurrentPrivateRoom]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.length < 1) {
            return;
        }
        chatStore.send(messageText, {
            email: authStore.email as string,
            _id: authStore.id as string,
        });
        setMessageText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageText.trim().length < 1) {
                return;
            }
            chatStore.send(messageText, {
                email: authStore.email as string,
                _id: authStore.id as string,
            });
            setMessageText('');
        }
    };

    const handleMouseMove = () => {
        setIsShowTooltipOfDate(true);
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
            setIsShowTooltipOfDate(false);
        }, 2000);
    };

    const handleClickScrollDown = () => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        setIsShowCounter(false);
    };

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    const throttledHandleScroll = useThrottle(handleScroll, 300);
    const messagesByDate = splitMessageByDate(chatStore.messages);
    const dates = Object.keys(messagesByDate);
    const CLASS_SMOOTH = 'smooth';

    return (
        <>
            <HeaderContainer>
                <Title>{chatStore.interlocutorName}</Title>
                <GoHome></GoHome>
                <Logout />
            </HeaderContainer>
            <FlexContainer isShow={isShowContent}>
                <MessagesContainer
                    ref={containerRef}
                    className={isSmoothScroll ? CLASS_SMOOTH : ''}
                    onScroll={throttledHandleScroll}
                >
                    {dates.map((date) => {
                        const messagesOnCurrentDate = messagesByDate[date];
                        const text = dateToText(date);
                        return (
                            <DateContainer key={date} data-date={date}>
                                <DateOfMessage isShow={isShowTooltipOfDate}>
                                    {text}
                                </DateOfMessage>
                                {messagesOnCurrentDate.map((msg) => {
                                    const isFromSelfMsg =
                                        msg.from._id === authStore.id;
                                    const timeInMilliseconds = parseDateFromId(
                                        msg._id,
                                    );
                                    const time = lightFormat(
                                        timeInMilliseconds,
                                        'HH-MM',
                                    );
                                    return (
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
                                    );
                                })}
                            </DateContainer>
                        );
                    })}
                </MessagesContainer>
                <SendBox
                    onSubmit={handleSubmit}
                    aria-label={ARIA_NAMES.MESSAGE_FORM}
                >
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
                <NewMessagesCounterWrapper>
                    <DownArrow
                        isShow={isShowArrDown}
                        onClick={handleClickScrollDown}
                    />
                    <NewMessagesCounter
                        isShow={isShowCounter}
                        onClick={handleClickScrollDown}
                    >
                        {counterOfNewMessages}
                    </NewMessagesCounter>
                </NewMessagesCounterWrapper>
            </FlexContainer>
        </>
    );
};

export default observer(PrivateRoom);
