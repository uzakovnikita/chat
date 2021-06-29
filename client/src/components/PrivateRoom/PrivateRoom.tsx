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
    const [messageText, setMessageText] = useState('');
    const [isScrolledToBottom, setScrolledToBottom] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(false);
    const [tooltipDay, setTooltipDay] = useState<string>(DAYS.Today);
    const [scrollTop, setScrollTop] = useState(0);

    const stateMachine = useRef(STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED);
    const selfGeneratingEvent = useRef<keyof typeof EVENTS_OF_FSM_IN_PRIVATE_ROOM | null>(null);
    const endMessages = useRef(false);
    const counterOfMessages = useRef(0);
    const prevNumberOfMessages = useRef(0);
    

    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;

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
    }, []);

    useEffect(() => {
        const event = selfGeneratingEvent.current || detectTypeOfEvent(
            chat.isFetchedMessage,
            chat.messages.length,
            prevNumberOfMessages.current,
            containerRef.current as HTMLDivElement,
        );
        prevNumberOfMessages.current = chat.messages.length;
        switch (event) {
            
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT: {
                selfGeneratingEvent.current = null;

                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED: {
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED;
                        setIsShowContent(true);
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM: {
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
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP: {
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        counterOfMessages.current += 10;
                        MessagesService.getMessagesDeprecated(
                            auth.accessToken as string,
                            chat.idCurrentPrivateRoom as string,
                            counterOfMessages.current,
                        ).then(({ messages }: { messages: message[] }) => {
                            messages.forEach((msg) => {
                                chat.messages.unshift(msg);
                            });
                            selfGeneratingEvent.current = EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHING;
                        });
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        counterOfMessages.current += 10;
                        MessagesService.getMessagesDeprecated(
                            auth.accessToken as string,
                            chat.idCurrentPrivateRoom as string,
                            counterOfMessages.current,
                        ).then(({ messages }: { messages: message[] }) => {
                            messages.forEach((msg) => {
                                chat.messages.unshift(msg);
                            });
                        });
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE: {
                        stateMachine.current =
                            STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE;
                        counterOfMessages.current += 20;
                        MessagesService.getMessagesDeprecated(
                            auth.accessToken as string,
                            chat.idCurrentPrivateRoom as string,
                            counterOfMessages.current,
                        ).then(({ messages }: { messages: message[] }) => {
                            messages.reverse().forEach((msg) => {
                                chat.messages.unshift(msg);
                            });
                        });
                        break;
                    }
                    default:
                        break;
                }

                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE: {
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
                }

                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHING: {
                switch (stateMachine.current) {
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_TOP: {
                        selfGeneratingEvent.current = null;
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
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE: {
                        break;
                    }
                    case STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM: {
                        containerRef.current!.scrollTo(
                            0,
                            containerRef.current!.scrollHeight,
                        );
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

    const elements = useRef<HTMLDivElement[]>();

    useEffect(() => {
        if (isScrolledToBottom) {
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
    }, [isScrolledToBottom]);

    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

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

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        setScrollTop(e.target!.scrollTop);
        // для изменения тултипа даты
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

    const throttledHandle = useThrottle(handleMouseMove, 100) || (() => {});
    const throttledHandleScroll = useThrottle(handleScroll, 300) || (() => {});

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
                className={isShowContent ? 'smooth' : ''}
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
        </FlexContainer>
    );
};

export default observer(PrivateRoom);
