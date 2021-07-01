/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    FunctionComponent,
    useState,
    useContext,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { lightFormat } from 'date-fns';

import parseDateFromId from '../../utils/parseDateFromId';

import useThrottle from '../../hooks/useThrottle';

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
import {
    DAYS,
    EVENTS_OF_FSM_IN_PRIVATE_ROOM,
    STATES_OF_FSM_IN_PRIVATE_ROOM,
} from '../../constants/enums';
import dateToText from '../../utils/dateToText';
import MessagesService from '../../serivces/MessagesService';
import detectTypeOfEvent from '../../utils/detectTypeOfEvent';
import { runInAction } from 'mobx';

type FlexContainerProps = {
    isShow: boolean;
};

const FlexContainer = styled.div<FlexContainerProps>`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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

const DateOfMessage = styled.span`
    display: inline-flex;
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
`;

const DateTooltip = styled.span<FlexContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${(props) => (props.isShow ? 1 : 0)};
    position: fixed;
    top: 171px;
    background: ${(props) => props.theme.colors['purple-grad']};
    color: ${(props) => props.theme.colors['white']};
    border-radius: ${(props) => props.theme.radiuses.medium};
    font-family: ${(props) => props.theme.fonts.primary};
    padding: 4px;
    box-sizing: border-box;
    box-shadow: 0 0 12px ${(props) => props.theme.colors['purple']};
    transition: 1s;
    min-width: 70px;
    min-height: 30px;
    text-align: center;
    z-index: 100;
    text-transform: uppercase;
`;

const NewMessagesCounterWrapper = styled.div`
    position: absolute;
    bottom: 160px;
    right: 20px;
`

const NewMessagesCounter = styled.button<FlexContainerProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 10px;
    font-size: 20px;
    outline: none;
    border: none;
    transition: 0.3s;
    cursor: ${props => props.isShow ? 'pointer': 'inherit'};
    font-family: ${props => props.theme.fonts.primary};
    opacity: ${props => props.isShow ? 1 : 0};
    background-color: ${props => props.theme.colors['purple']};
    color: ${props => props.theme.colors.white};
    border-radius: 25px;
    z-index: ${props => props.isShow ? 10 : -100};
`
const DownArrow = styled.div<FlexContainerProps>`
    position: absolute;
    top: 18px;
    z-index: -10;
    background-image: url('/images/svg/down.svg');
    background-size: cover;
    background-position: center;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    opacity: ${props => props.isShow ? 0.5 : 0};
    z-index: ${props => props.isShow ? 10 : -100};
    transition: 0.3s;
    cursor: ${props => props.isShow ? 'pointer': 'inherit'};
    &:hover {
        opacity: ${props => props.isShow ? 0.9 : 0};
    }
`

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
    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;

    const [messageText, setMessageText] = useState('');
    const [isShowContent, setIsShowContent] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(false);
    const [tooltipDay, setTooltipDay] = useState<string>(DAYS.Today);
    const [scrollTop, setScrollTop] = useState(0);
    const [counterOfNewMessages, setCountetOfNewMessages] = useState(0);
    const [isShowCounter, setIsShowCounter] = useState(false);
    const [isShowArrDown, setIsShowArrDown] = useState(false);

    const stateMachine = useRef(STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED);
    const selfGeneratingEvent = useRef<
        keyof typeof EVENTS_OF_FSM_IN_PRIVATE_ROOM | null
    >(null);
    const counterOfMessages = useRef(0);
    const prevNumberOfMessages = useRef(chat.messages.length);
    const isSmoothScroll = useRef(false);
    const elements = useRef<HTMLDivElement[]>();
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    // FSM HOOK
    useEffect(() => {
        const event =
            selfGeneratingEvent.current ||
            detectTypeOfEvent(
                chat.isFetchedMessage,
                chat.messages.length,
                prevNumberOfMessages.current,
                containerRef.current as HTMLDivElement,
            );
        selfGeneratingEvent.current = null;
        prevNumberOfMessages.current = chat.messages.length;
        switch (event) {
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT: {
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED;
                        containerRef.current!.scrollTop =
                            containerRef.current!.scrollHeight;
                        setIsShowContent(true);
                        isSmoothScroll.current = true;
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
                setCountetOfNewMessages(0);
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
                        stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM: {
                        stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM;
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
                        MessagesService.getMessagesDeprecated(
                            auth.accessToken as string,
                            chat.idCurrentPrivateRoom as string,
                            counterOfMessages.current,
                        )
                            .then(({ messages }: { messages: message[] }) => {
                                if (messages.length === 0) {
                                    stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP;
                                    return;
                                }
                                const oldHeight = containerRef.current!.scrollHeight;
                                runInAction(() => {
                                    messages.reverse().forEach((msg) => {
                                        chat.messages.unshift(msg);
                                    });
                                });
                                const newHeight = containerRef.current!.scrollHeight;
                                containerRef.current!.scrollTop = newHeight - oldHeight;
                                selfGeneratingEvent.current =
                                    EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHED;
                            })
                            
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE: {
                        stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP;
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
                        stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP: {
                        stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE;
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
                        stateMachine.current = STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        break;
                    }
                    default:
                        break;
                }

                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED: {
                isSmoothScroll.current = true;
                counterOfMessages.current+=1;
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
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from === auth.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCountetOfNewMessages(prev => prev+1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE: {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from === auth.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCountetOfNewMessages(prev => prev+1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM: {
                        setCountetOfNewMessages(0);
                        setIsShowCounter(false);
                        setIsShowArrDown(false);
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
                        selfGeneratingEvent.current = EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP: {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from === auth.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCountetOfNewMessages(prev => prev+1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM: {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from === auth.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCountetOfNewMessages(0);
                        setIsShowCounter(false);
                        setIsShowArrDown(false);
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
                        selfGeneratingEvent.current = EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM;
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE: {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from === auth.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCountetOfNewMessages(prev => prev+1);
                        setIsShowCounter(true);
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP: {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isFromSelfMsg = lastMessage.from === auth.id;
                        if (isFromSelfMsg) {
                            return;
                        }
                        setCountetOfNewMessages(prev => prev+1);
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
    }, [chat.isFetchedMessage, chat.messages.length, scrollTop]);

    useEffect(() => {
        chat.listenMessages();
    }, [chat]);

    useEffect(() => {
        if (isShowContent) {
            const allElementsWithDataAtr = Array.from(
                document.querySelectorAll('[data-date]'),
            ) as HTMLDivElement[];
            elements.current = allElementsWithDataAtr;
            if (allElementsWithDataAtr.length < 1) {
                return;
            }
            if (elements.current && containerRef.current) {
                const offset = containerRef.current.getBoundingClientRect().top;
                const currentDate = elements.current.find((el) => {
                    const boundingClientRect = el.getBoundingClientRect();
                    if (boundingClientRect.bottom - offset > 0) {
                        return true;
                    }
                    return false;
                })!.dataset.date;
                setTooltipDay(dateToText(currentDate as string));
            }
        }
    }, [isShowContent, chat.messages.length]);

    useEffect(() => {
        document.addEventListener('mousemove', throttledHandle);
        containerRef.current!.addEventListener('scroll', () => {
            throttledHandle();
        });
        if (elements.current && containerRef.current) {
            const offset = containerRef.current.getBoundingClientRect().top;
            const currentDate = elements.current.find((el) => {
                const boundingClientRect = el.getBoundingClientRect();
                if (boundingClientRect.bottom - offset > 0) {
                    return true;
                }
                return false;
            })!.dataset.date;
            setTooltipDay(dateToText(currentDate as string));
        }
        return () => {
            document.removeEventListener('mousemove', throttledHandle);
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, [elements.current]);

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

    const handleMouseMove = () => {
        setIsShowTooltip(true);
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
            setIsShowTooltip(false);
        }, 2000);
    };

    const handleClickScrollDown = () => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        setIsShowCounter(false);
    }

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        setScrollTop(e.target!.scrollTop);
        // для изменения даты в фиксированном тултипе
        if (elements.current && containerRef.current) {
            const offset = containerRef.current.getBoundingClientRect().top;
            const currentDate = elements.current.find((el) => {
                const boundingClientRect = el.getBoundingClientRect();
                if (boundingClientRect.bottom - offset > 0) {
                    return true;
                }
                return false;
            })!.dataset.date;
            setTooltipDay(dateToText(currentDate as string));
        }
    };

    const throttledHandle = useThrottle(handleMouseMove, 100);
    const throttledHandleScroll = useThrottle(handleScroll, 300);

    const memoizedMessages = useMemo(() => {
        const messagesByDate = splitMessageByDate(chat.messages);
        const dates = Object.keys(messagesByDate);
        return dates.map((date) => {
            const messagesOnCurrentDate = messagesByDate[date];
            const text = dateToText(date);
            return (
                <DateContainer key={date} data-date={date}>
                    <DateOfMessage>{text}</DateOfMessage>
                    {messagesOnCurrentDate.map((msg) => {
                        const isFromSelfMsg = msg.from === auth.id;
                        const timeInMilliseconds = parseDateFromId(msg._id);
                        const time = lightFormat(timeInMilliseconds, 'HH-MM');
                        return (
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
                        );
                    })}
                </DateContainer>
            );
        });
    }, [chat.messages.length]);

    return (
        <FlexContainer isShow={isShowContent}>
            <Title>{chat.interlocutorName}</Title>
            <MessagesContainer
                ref={containerRef}
                className={isSmoothScroll.current ? 'smooth' : ''}
                onScroll={throttledHandleScroll}
            >
                <DateTooltip isShow={isShowTooltip}>{tooltipDay}</DateTooltip>
                {memoizedMessages}
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
                <DownArrow isShow={isShowArrDown} onClick={handleClickScrollDown}/>
                <NewMessagesCounter isShow={isShowCounter} onClick={handleClickScrollDown}>{counterOfNewMessages}</NewMessagesCounter>
            </NewMessagesCounterWrapper>
        </FlexContainer>
    );
};

export default observer(PrivateRoom);
