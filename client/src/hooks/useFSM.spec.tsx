import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import useFSM from './useFSM';

import detectTypeOfEvent from '../utils/detectTypeOfEvent';

import {
    EVENTS_OF_FSM_IN_PRIVATE_ROOM,
    STATES_OF_FSM_IN_PRIVATE_ROOM,
} from '../constants/enums';

import Auth from '../store/Auth';
import Chat from '../store/Chat';

import { FSMArgs, message } from '../constants/types';
import fakeMessages from '../../__fixtures__/fakeMessages';
import { useEffect, useRef, useState } from 'react';
import MessagesService from '../services/MessagesService';

jest.mock('../utils/detectTypeOfEvent');
jest.mock('../services/MessagesService');
MessagesService.getMessages = jest
    .fn()
    .mockReturnValue(
        new Promise((resolve) => resolve({ data: { messages: fakeMessages } })),
    );

const changeProps = () => {
    let x = 0;
    return () => {
        x += 1;
        return x;
    };
};
const getNewProps = changeProps();

const mockSetIsSmoothScroll = jest.fn();
const mockSetIsShowContent = jest.fn();
const mockSetIsShowArrDown = jest.fn();
const mockSetIsShowCounter = jest.fn();
const mockSetCounterOfNewMessages = jest.fn();
const mockScrollTo = jest.fn();

const containerTestId = 'container';
const scrollHeight = 10000000;

const authStore = new Auth();
const chatStore = new Chat();
authStore.isHydrated = true;
chatStore.isFetchedMessage = true;

const fakeId = 'fakeId';

const fakeProps = {
    authStore,
    chatStore,
    setIsSmoothScroll: mockSetIsSmoothScroll,
    setIsShowContent: mockSetIsShowContent,
    setIsShowArrDown: mockSetIsShowArrDown,
    setIsShowCounter: mockSetIsShowCounter,
    setCounterOfNewMessages: mockSetCounterOfNewMessages,
};

const FakeComponentUseFSM = ({
    authStore,
    chatStore,
    setIsSmoothScroll,
    setIsShowContent,
    setIsShowArrDown,
    setIsShowCounter,
    setCounterOfNewMessages,
}: Omit<FSMArgs, 'containerRef' | 'scrollTop'>) => {
    const containerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current = ({
                scrollTo: mockScrollTo,
            } as unknown) as null;
        }
    }, []);
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

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    return (
        <div
            ref={containerRef}
            style={{ height: '100px', width: '100px', overflow: 'scroll' }}
            data-testid={containerTestId}
            onScroll={handleScroll}
        >
            <div style={{ height: `${scrollHeight}px`, width: '100%' }}></div>
        </div>
    );
};

const mockEvent = (event: keyof typeof EVENTS_OF_FSM_IN_PRIVATE_ROOM) => {
    (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(event);
};

const mockFetchMessages = (messages: message[]) => {
    MessagesService.getMessages = jest
        .fn()
        .mockReturnValue(
            new Promise((resolve) => resolve({ data: { messages } })),
        );
};

const makeEvent = () =>
    fireEvent.scroll(screen.getByTestId(containerTestId), {
        target: {
            scrollTop: scrollHeight + getNewProps(),
        },
    });

const initAndRender = () => {
    mockEvent(EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT);
    render(<FakeComponentUseFSM {...fakeProps} />);
};

const scrollToBottom = () => {
    mockEvent(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM);
    makeEvent();
};

const scrollToIntermediate = () => {
    mockEvent(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE);
    makeEvent();
};

const scrollToTop = () => {
    mockEvent(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP);
    makeEvent();
};

const recieveNewMessage = () => {
    mockEvent(EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED);
    makeEvent();
};



describe('Tests for useFSM hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
        chatStore.messages = [];
    });
    it('Should call side-effect when component will be mounted', () => {
        initAndRender();

        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowContent).toBeCalledWith(true);
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
        expect(mockSetIsShowCounter).not.toBeCalled();
        expect(mockSetCounterOfNewMessages).not.toBeCalled();
    });
    it('Should call sife-effect when component will be scrolled to bottom', () => {
        initAndRender();
        jest.clearAllMocks();
        scrollToBottom();

        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowContent).not.toBeCalled();
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
        expect(mockSetIsShowCounter).toBeCalledWith(false);
        expect(mockSetCounterOfNewMessages).toBeCalledWith(0);
    });
    describe(`Tests calls side-effects when event is: ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP}`, () => {
        afterEach(() => {
            chatStore.messages = [];
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES}`, () => {
            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            jest.clearAllMocks();

            scrollToTop();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE}`, async () => {
            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            jest.clearAllMocks();

            scrollToTop();
            await waitFor(() =>
                expect(chatStore.messages[0]).toEqual(
                    fakeMessages[fakeMessages.length - 1],
                ),
            );

            expect(chatStore.messages.length).toBe(fakeMessages.length);
            expect(mockSetIsSmoothScroll).toBeCalledWith(false);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE}`, async () => {
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await waitFor(() => expect(chatStore.messages.length).toBe(0));
            scrollToIntermediate();
            jest.clearAllMocks();

            scrollToTop();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
    });
    describe(`Tests calls side-effects when event is ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE}`, () => {
        afterAll(() => {
            MessagesService.getMessages = jest
                .fn()
                .mockReturnValue(
                    new Promise((resolve) =>
                        resolve({ data: { messages: fakeMessages } }),
                    ),
                );
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM}`, () => {
            initAndRender();
            scrollToBottom();
            jest.clearAllMocks();

            scrollToIntermediate();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP}`, () => {
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            jest.clearAllMocks();

            scrollToIntermediate();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM}`, () => {
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            jest.clearAllMocks();

            scrollToTop();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
    });
    describe(`Test calls side-effects when event is ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHED}`, () => {
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES}`, async () => {
            mockFetchMessages(fakeMessages);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await waitFor(() =>
                expect(chatStore.messages[0]).toEqual(
                    fakeMessages[fakeMessages.length - 1],
                ),
            );
            jest.clearAllMocks();

            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight + getNewProps(),
                },
            });

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
    });
    describe(`Test calls side-effects when event is ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED}`, () => {
        const setLastMessageFromInterlocutor = () => {
            authStore.id = fakeId;
            chatStore.messages = fakeMessages;
        }
        
        const setLastMessageFromSelf = () => {
            authStore.id = fakeId;
            const lastMessage = JSON.parse(
                JSON.stringify(fakeMessages[fakeMessages.length - 1]),
            );
            lastMessage.from._id = fakeId;
            chatStore.messages = [...fakeMessages, lastMessage];
        }

        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.INITIALIZED}`, () => {
            initAndRender();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockScrollTo).toBeCalled();
            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE} with message from interlocutor`, () => {
            setLastMessageFromInterlocutor();
            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).toBeCalledWith(true);
            expect(mockSetCounterOfNewMessages).toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE} with message from self`, () => {
            setLastMessageFromSelf();
            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_BOTTOM}`, () => {
            initAndRender();
            scrollToBottom();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(false);
            expect(mockSetIsShowCounter).toBeCalledWith(false);
            expect(mockSetCounterOfNewMessages).toBeCalledWith(0);
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP} with message from interlocutor`, async () => {
            setLastMessageFromInterlocutor();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            jest.clearAllMocks();
            return new Promise((resolve) => resolve('')).then(() => {
                recieveNewMessage();

                expect(mockSetIsSmoothScroll).toBeCalledWith(true);
                expect(mockSetIsShowContent).not.toBeCalled();
                expect(mockSetIsShowArrDown).not.toBeCalled();
                expect(mockSetIsShowCounter).toBeCalledWith(true);
                expect(mockSetCounterOfNewMessages).toBeCalled();
            });
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP} with message from self`, async () => {
            setLastMessageFromSelf();
            mockFetchMessages([]);

            initAndRender();
            scrollToTop();
            jest.clearAllMocks();
            await new Promise((resolve) => resolve(''));
            recieveNewMessage();
            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM} with message from interlocutor`, async () => {
            setLastMessageFromInterlocutor();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await new Promise((resolve) => resolve(''));
            scrollToIntermediate();
            scrollToBottom();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockScrollTo).toBeCalled();
            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(false);
            expect(mockSetIsShowCounter).toBeCalledWith(false);
            expect(mockSetCounterOfNewMessages).toHaveBeenCalledWith(0);
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM} with message from self`, async () => {
            setLastMessageFromSelf();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await new Promise((resolve) => resolve(''));
            scrollToIntermediate();
            scrollToBottom();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockScrollTo).not.toBeCalled();
            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE} with message from interlocutor`, async () => {
            setLastMessageFromInterlocutor();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await new Promise((resolve) => resolve(''));
            scrollToIntermediate();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).toBeCalledWith(true);
            expect(mockSetCounterOfNewMessages).toHaveBeenCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE} with message from self`, async () => {
            setLastMessageFromSelf();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await new Promise((resolve) => resolve(''));
            scrollToIntermediate();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP} with message from interlocutor`, async () => {
            setLastMessageFromInterlocutor();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await new Promise((resolve) => resolve(''));
            scrollToIntermediate();
            scrollToTop();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).toBeCalledWith(true);
            expect(mockSetCounterOfNewMessages).toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETHCING_HISTORY_SCROLLED_TO_TOP} with message from self`, async () => {
            setLastMessageFromSelf();
            mockFetchMessages([]);

            initAndRender();
            scrollToBottom();
            scrollToIntermediate();
            scrollToTop();
            await new Promise((resolve) => resolve(''));
            scrollToIntermediate();
            scrollToTop();
            jest.clearAllMocks();

            recieveNewMessage();

            expect(mockSetIsSmoothScroll).toBeCalledWith(true);
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).not.toBeCalled();
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
    });
});
