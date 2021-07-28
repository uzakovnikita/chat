import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import useFSM from './useFSM';

import detectTypeOfEvent from '../utils/detectTypeOfEvent';

import { EVENTS_OF_FSM_IN_PRIVATE_ROOM, STATES_OF_FSM_IN_PRIVATE_ROOM } from '../constants/enums';

import Auth from '../store/Auth';
import Chat from '../store/Chat';

import { FSMArgs } from '../constants/types';
import fakeMessages from '../../__fixtures__/fakeMessages';
import { JSXElementConstructor, ReactElement, useRef, useState } from 'react';


jest.mock('../utils/detectTypeOfEvent');
jest.mock('../services/MessagesService', () => {
    const fakeMessages = require('../../__fixtures__/fakeMessages').default;
    return {
        __esModule: true,
        default: class {
            static getMessages() {
                return new Promise((resolve, reject) => resolve({ data: { messages: fakeMessages } }))
            }
        }
    }
});

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
}: Omit<FSMArgs, "containerRef" | "scrollTop">) => {

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
    }

    return <div ref={containerRef} style={{ height: '100px', width: '100px', overflow: 'scroll' }} data-testid={containerTestId} onScroll={handleScroll}>
        <div style={{ height: `${scrollHeight}px`, width: '100%' }}></div>
    </div>;
};



describe('Tests for useFSM hook', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('Should call side-effect when component will be mounted', () => {
        render(<FakeComponentUseFSM {...fakeProps} />);
        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowContent).toBeCalledWith(true);
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
        expect(mockSetIsShowCounter).not.toBeCalled();
        expect(mockSetCounterOfNewMessages).not.toBeCalled();
    })
    it('Should call sife-effect when component will be scrolled to bottom', () => {
        (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT)
        render(<FakeComponentUseFSM {...fakeProps} />);
        jest.resetAllMocks();
        (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM)
        fireEvent.scroll(screen.getByTestId(containerTestId), {
            target: {
                scrollTop: scrollHeight
            }
        });
        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowContent).not.toBeCalled();
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
        expect(mockSetIsShowCounter).toBeCalledWith(false);
        expect(mockSetCounterOfNewMessages).toBeCalledWith(0);
    });
    describe('Tests calls side-effects when component scrolled to top from different states', () => {
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.FETCHING_MESSAGES}, event: ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP}`, () => {
            // state will be initialized
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT)
            render(<FakeComponentUseFSM {...fakeProps} />);
            jest.resetAllMocks();
            // state will be intermediate
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE);
            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight
                }
            });
            jest.resetAllMocks();
            // state will be fetching messages
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP);
            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight + 1
                }
            });
            jest.resetAllMocks();

            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP);
            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight + 2
                }
            });
            expect(mockSetIsSmoothScroll).not.toBeCalled();
            expect(mockSetIsShowContent).not.toBeCalled();
            expect(mockSetIsShowArrDown).toBeCalledWith(true);
            expect(mockSetIsShowCounter).not.toBeCalled();
            expect(mockSetCounterOfNewMessages).not.toBeCalled();
        });
        it(`state is ${STATES_OF_FSM_IN_PRIVATE_ROOM.SCROLLED_INTERMEDIATE}, event: ${EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP}`, async () => {
            // state will be initialized
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT)
            render(<FakeComponentUseFSM {...fakeProps} />);
            jest.resetAllMocks();
            // state will be scrolled to bottom
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM);
            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight
                }
            });
            jest.resetAllMocks();
            // state will be intermediated
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE);
            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight + 1
                }
            });
            jest.resetAllMocks();
            // state will be fetching messages
            (detectTypeOfEvent as jest.Mock).mockReturnValueOnce(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP);
            fireEvent.scroll(screen.getByTestId(containerTestId), {
                target: {
                    scrollTop: scrollHeight + 2
                }
            });
            await waitFor(() => expect(chatStore.messages).toEqual(fakeMessages.reverse()));
        });
    });
});
