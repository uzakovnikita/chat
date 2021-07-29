import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import useFSM from './useFSM';

import detectTypeOfEvent from '../utils/detectTypeOfEvent';

import {
    EVENTS_OF_FSM_IN_PRIVATE_ROOM,
    STATES_OF_FSM_IN_PRIVATE_ROOM,
} from '../constants/enums';

import Auth from '../store/Auth';
import Chat from '../store/Chat';

import { FSMArgs } from '../constants/types';
import fakeMessages from '../../__fixtures__/fakeMessages';
import { useRef, useState } from 'react';
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

const containerTestId = 'container';
const scrollHeight = 10000000;

const authStore = new Auth();
const chatStore = new Chat();
authStore.isHydrated = true;
chatStore.isFetchedMessage = true;

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

const init = () => {
    // state will be initialized
    (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(
        EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT,
    );
    render(<FakeComponentUseFSM {...fakeProps} />);
};

const toBottom = () => {
    (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(
        EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM,
    );
    fireEvent.scroll(screen.getByTestId(containerTestId), {
        target: {
            scrollTop: scrollHeight + getNewProps(),
        },
    });
};

const toIntermediate = () => {
    (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(
        EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE,
    );
    fireEvent.scroll(screen.getByTestId(containerTestId), {
        target: {
            scrollTop: scrollHeight + getNewProps(),
        },
    });
};

const toTop = () => {
    (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(
        EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP,
    );
    fireEvent.scroll(screen.getByTestId(containerTestId), {
        target: {
            scrollTop: scrollHeight + getNewProps(),
        },
    });
};

describe('Tests for useFSM hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Should call side-effect when component will be mounted', () => {
        init();

        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowContent).toBeCalledWith(true);
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
        expect(mockSetIsShowCounter).not.toBeCalled();
        expect(mockSetCounterOfNewMessages).not.toBeCalled();
    });
    it('Should call sife-effect when component will be scrolled to bottom', () => {
        init();
        jest.clearAllMocks();
        toBottom();

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
            init();
            toBottom();
            toIntermediate();
            toTop();
            jest.clearAllMocks();

            toTop();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE}`, async () => {
            init();
            toBottom();
            toIntermediate();
            jest.clearAllMocks();

            toTop();
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
            MessagesService.getMessages = jest
                .fn()
                .mockReturnValue(
                    new Promise((resolve) =>
                        resolve({ data: { messages: [] } }),
                    ),
                );

            init();
            toBottom();
            toIntermediate();
            toTop();
            await waitFor(() => expect(chatStore.messages.length).toBe(0));
            toIntermediate();
            jest.clearAllMocks();

            toTop();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
    });
    describe(`Tests calls side-effects when event is ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE}`, () => {
        afterEach(() => {
            chatStore.messages = [];
        });
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
            init();
            toBottom();
            jest.clearAllMocks();

            toIntermediate();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_TO_THE_MAX_TOP}`, () => {
            MessagesService.getMessages = jest
                .fn()
                .mockReturnValue(
                    new Promise((resolve) =>
                        resolve({ data: { messages: [] } }),
                    ),
                );

            init();
            toBottom();
            toIntermediate();
            toTop();
            jest.clearAllMocks();

            toIntermediate();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM}`, () => {
            MessagesService.getMessages = jest
                .fn()
                .mockReturnValue(
                    new Promise((resolve) =>
                        resolve({ data: { messages: [] } }),
                    ),
                );

            init();
            toBottom();
            toIntermediate();
            toTop();
            jest.clearAllMocks();

            toTop();

            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
    });
    describe(`Test calls side-effect when event is ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGES_FETCHED}`, () => {
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES}`, async () => {
            MessagesService.getMessages = jest
                .fn()
                .mockReturnValue(
                    new Promise((resolve) =>
                        resolve({ data: { messages: fakeMessages } }),
                    ),
                );
            init();
            toBottom();
            toIntermediate();
            toTop();
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
});
