/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    FunctionComponent,
    useState,
    useEffect,
    useRef,
} from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import styled from 'styled-components';
import { lightFormat } from 'date-fns';

import { api, startInterceptor } from '../../../http';

import MessagesService from '../../../serivces/MessagesService';

import dateToText from '../../../utils/dateToText';
import detectTypeOfEvent from '../../../utils/detectTypeOfEvent';
import parseDateFromId from '../../../utils/parseDateFromId';

import useThrottle from '../../../hooks/useThrottle';
import useAuthContext from '../../../hooks/useAuthContext';
import useChatContext from '../../../hooks/useChatContext';

import Title from '../../styledComponents/Title';
import MessagesContainer from '../../styledComponents/MessagesContainer';
import MessageInput from '../../styledComponents/MessageInput';
import SendBox from '../../styledComponents/SendBox';
import SingleMessage from '../../styledComponents/SingleMessage';
import SendButton from '../../styledComponents/SendButton';
import HeaderContainer from '../../styledComponents/HeaderContainer';
import Logout from '../../Logout';
import GoHome from '../../GoHome';

import { Chat } from '../../../store/chat';
import { Auth } from '../../../store/auth';
import { message } from '../../../constants/types';
import {
    EVENTS_OF_FSM_IN_PRIVATE_ROOM,
    STATES_OF_FSM_IN_PRIVATE_ROOM,
} from '../../../constants/enums';

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
    z-index: -10;
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

    // FSM STATE AND EVENT
    const stateMachine = useRef(STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED);
    const selfGeneratingEvent = useRef<
        keyof typeof EVENTS_OF_FSM_IN_PRIVATE_ROOM | null
    >(null);

    const counterOfMessages = useRef(0);
    const prevNumberOfMessages = useRef(chatStore.messages.length);
    const isSmoothScroll = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const timerIdForThrottleRef = useRef<NodeJS.Timeout | null>(null);
    const isHydrated = useRef(false);

    // FSM HOOK
    // в зависимости от связки событие+состояние(stateMachine) мы получаем необходимые побочные эффекты и новое состояние stateMachine
    // иногда событие не может быть определено через параметры функции detectTypeOfEvent, 
    // тогда событие генерируется прямо в хуке и записывается в переменную selfGeneratingEvent
    // используется для упрощения работы с различными положениями скролла
    useEffect(() => {
        const axiosInstance = api();
        startInterceptor(authStore.accessToken as string, axiosInstance);
        const event =
            selfGeneratingEvent.current ||
            detectTypeOfEvent(
                isHydrated.current,
                authStore.isHydrated,
                chatStore.isFetchedMessage,
                chatStore.messages.length,
                prevNumberOfMessages.current,
                containerRef.current as HTMLDivElement,
            );
        selfGeneratingEvent.current = null;
        prevNumberOfMessages.current = chatStore.messages.length;

        switch (event) {
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT: {
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED;
                        containerRef.current!.scrollTop =
                            containerRef.current!.scrollHeight;
                        setIsShowContent(true);
                        setIsShowArrDown(false);
                        isSmoothScroll.current = true;
                        isHydrated.current = true;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM: {
                setIsShowArrDown(false);
                setIsShowCounter(false);
                setCounterOfNewMessages(0);
                isSmoothScroll.current = true;
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_TOP: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP: {
                setIsShowArrDown(true);
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES: {
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES;
                        isSmoothScroll.current = false;
                        counterOfMessages.current += 20;
                        MessagesService.getMessages(
                            axiosInstance,
                            chatStore.idCurrentPrivateRoom as string,
                            counterOfMessages.current,
                        ).then(({ data: { messages } }) => {
                            if (messages.length === 0) {
                                stateMachine.current =
                                    STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP;
                                return;
                            }
                            const oldHeight =
                                containerRef.current!.scrollHeight;
                            runInAction(() => {
                                messages.reverse().forEach((msg) => {
                                    chatStore.messages.unshift(msg);
                                });
                            });
                            const newHeight =
                                containerRef.current!.scrollHeight;
                            containerRef.current!.scrollTop =
                                newHeight - oldHeight;
                            selfGeneratingEvent.current =
                                EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHED;
                        });

                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE: {
                setIsShowArrDown(true);
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_TOP: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHED: {
                isSmoothScroll.current = true;
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_TOP: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        break;
                    }
                    default:
                        break;
                }

                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED: {
                isSmoothScroll.current = true;
                counterOfMessages.current += 1;
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM;
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_TOP: {
                        const lastMessage =
                            chatStore.messages[chatStore.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from._id === authStore.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCounterOfNewMessages((prev) => prev + 1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE: {
                        const lastMessage =
                            chatStore.messages[chatStore.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from._id === authStore.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCounterOfNewMessages((prev) => prev + 1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM: {
                        setCounterOfNewMessages(0);
                        setIsShowCounter(false);
                        setIsShowArrDown(false);
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
                        selfGeneratingEvent.current =
                            EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP: {
                        const lastMessage =
                            chatStore.messages[chatStore.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from._id === authStore.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCounterOfNewMessages((prev) => prev + 1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM: {
                        const lastMessage =
                            chatStore.messages[chatStore.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from._id === authStore.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCounterOfNewMessages(0);
                        setIsShowCounter(false);
                        setIsShowArrDown(false);
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
                        selfGeneratingEvent.current =
                            EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE: {
                        const lastMessage =
                            chatStore.messages[chatStore.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from._id === authStore.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCounterOfNewMessages((prev) => prev + 1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP: {
                        const lastMessage =
                            chatStore.messages[chatStore.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from._id === authStore.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCounterOfNewMessages((prev) => prev + 1);
                        setIsShowCounter(true);
                        break;
                    }
                    default:
                        break;
                }

                break;
            }
            default:
                break;
        }
    }, [
        chatStore.isFetchedMessage,
        chatStore.messages.length,
        scrollTop,
        chatStore.idCurrentPrivateRoom,
    ]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        containerRef.current!.addEventListener('scroll', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            containerRef.current?.removeEventListener('scroll', handleMouseMove);
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            if (timerIdForThrottleRef.current) {
                clearTimeout(timerIdForThrottleRef.current)
            }
        };
    }, [chatStore.idCurrentPrivateRoom]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageText.length < 1) {
            return;
        }
        chatStore.send(messageText, {email: authStore.email as string, _id: authStore.id as string});
        setMessageText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageText.trim().length < 1) {
                return;
            }
            chatStore.send(messageText, {email: authStore.email as string, _id: authStore.id as string});
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

    const throttledHandleScroll = useThrottle(handleScroll, 300, timerIdForThrottleRef);
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
                    className={isSmoothScroll.current ? CLASS_SMOOTH : ''}
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
                                    const isFromSelfMsg = msg.from._id === authStore.id;
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
