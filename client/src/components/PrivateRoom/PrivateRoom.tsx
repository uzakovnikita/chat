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
import { DAYS, MONTHS } from '../../constants/enums';

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
`

const TimeOnMessage = styled.span`
    font-size: 10px;
    opacity: 0.5;
    font-family: ${(props) => props.theme.fonts.primary};
    position: absolute;
    right: 4px;
    bottom: 4px;
`;

const DateOfMessage = styled.span`
    display: inline;
    background: ${(props) => props.theme.colors['purple-grad']};
    color: ${(props) => props.theme.colors['white']};
    border-radius: ${(props) => props.theme.radiuses.medium};
    font-family: ${(props) => props.theme.fonts.primary};
    padding: 4px;
    box-sizing: border-box;
    opacity: 0.9;
    box-shadow: 0 0 12px ${(props) => props.theme.colors['purple']};
    align-self: center;
`;

const DateTooltip = styled.span<FlexContainerProps>`
    opacity: ${props => props.isShow ? 1 : 0};
    position: fixed;
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
`;

const SplitMessageByDate = (
    messages: message[],
): { [key: string]: message[] } => {
    return messages.reduce((acc: { [key: string]: message[] }, msg) => {
        const timeInMilliseconds = parseDateFromId(msg._id);
        const currentDate: string = lightFormat(timeInMilliseconds, 'dd-MM');
        const prevValue = acc[currentDate] ? acc[currentDate] : [];
        const newAcc = {...acc, [currentDate]: [...prevValue, msg]};
        return newAcc;
    }, {});
};

const PrivateRoom: FunctionComponent = () => {
    const [messageText, setMessageText] = useState('');
    const [isScrolledToBottom, setScrolledToBottom] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(false);
    const [tooltipDay, setTooltipDay] = useState<string>(DAYS.Today);

    const chat = useContext(ContextChat) as Chat;
    const auth = useContext(ContextAuth) as Auth;

    useEffect(() => {
        if (containerRef.current && chat.isFetchedMessage) {
            containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
            if (!isScrolledToBottom) setScrolledToBottom(true);
        }
    }, [chat.isFetchedMessage, chat.messages.length]);

    useEffect(() => {
        chat.listenMessages();
    }, [chat]);

    const elements = useRef<HTMLDivElement[]>();

    useEffect(() => {
        if (isScrolledToBottom) {
            const allElementsWithDataAtr = Array.from(document.querySelectorAll('[data-date]')) as HTMLDivElement[];
            elements.current = allElementsWithDataAtr;
        }
    }, [isScrolledToBottom]);

    
    useEffect(() => {
        document.addEventListener('mousemove', throttledHandle);
        containerRef.current!.addEventListener('scroll', () => {
            throttledHandle();
        });
        return () => {
            document.removeEventListener('mousemove', throttledHandle);
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        }
    }, []);

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
        if (elements.current && containerRef.current) {
            const offset = containerRef.current.getBoundingClientRect().top;
            const currentDate = elements.current.find((el) => {
                const boundingClientRect = el.getBoundingClientRect();
                const selfOfssetTop = Math.abs(boundingClientRect.top);
                if (selfOfssetTop + offset < boundingClientRect.height) {
                    return true;
                } 
            })!.dataset.date;
            setTooltipDay(currentDate as string);
        }
    }

    const throttledHandle = useThrottle(handleMouseMove, 100);

    const throttledHandleScroll = useThrottle(handleScroll, 300);

    const memoizedMessages = useMemo(() => {
        const messagesByDate = SplitMessageByDate(chat.messages);
        const dates = Object.keys(messagesByDate);
        return dates.map((date) => {
            const messagesOnCurrentDate = messagesByDate[date];
            const [day, month] = date.split('-');
            const namedMonth = MONTHS[+month - 1];
            return (
                <DateContainer key={date} data-date={date}>
                    <DateOfMessage>{day}{' '}{namedMonth}</DateOfMessage>
                    {messagesOnCurrentDate.map(msg => {
                        const isFromSelfMsg = msg.from === auth.id;
                        const timeInMilliseconds = parseDateFromId(msg._id);
                        const time = lightFormat(timeInMilliseconds, 'HH-MM');
                        return <SingleMessage
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
                    })}
                </DateContainer>
            )
        });
    }, [chat.messages.length]);

    return (
        <FlexContainer isShow={isScrolledToBottom}>
            <Title>{chat.interlocutorName}</Title>
            <MessagesContainer
                ref={containerRef}
                className={isScrolledToBottom ? 'smooth' : ''}
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
