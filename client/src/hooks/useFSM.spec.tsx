import { render, screen } from '@testing-library/react';

import useFSM from './useFSM';

import detectTypeOfEvent from '../utils/detectTypeOfEvent';

import { EVENTS_OF_FSM_IN_PRIVATE_ROOM } from '../constants/enums';

import Auth from '../store/Auth';
import Chat from '../store/Chat';

import { FSMArgs } from '../constants/types';


jest.mock('../utils/detectTypeOfEvent');
const mockSetIsSmoothScroll = jest.fn();
const mockSetIsShowContent = jest.fn();
const mockSetIsShowArrDown = jest.fn();
const mockSetIsShowCounter = jest.fn();
const mockSetCounterOfNewMessages = jest.fn();

const authStore = new Auth();
const chatStore = new Chat();
const containerRef = {
    current: {
        scrollTop: 0,
        scrollHeight: 0,
    },
};

const memoFakeProps = ({
    authStore,
    chatStore,
    scrollTop,
    containerRef,
    setIsSmoothScroll,
    setIsShowContent,
    setIsShowArrDown,
    setIsShowCounter,
    setCounterOfNewMessages,
}: FSMArgs) => {
    const memo = {
        authStore,
        chatStore,
        scrollTop,
        containerRef,
        setIsSmoothScroll,
        setIsShowContent,
        setIsShowArrDown,
        setIsShowCounter,
        setCounterOfNewMessages,
    };
    return (
        newScrollTop?: number,
        newContainerRef?: React.RefObject<HTMLDivElement>,
    ) => {
        return {
            ...memo,
            scrollTop: newScrollTop ?? scrollTop,
            containerRef: newContainerRef ?? containerRef,
        };
    };
};

const makeFakeProps = memoFakeProps({
    authStore,
    chatStore,
    scrollTop: 0,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    setIsSmoothScroll: mockSetIsSmoothScroll,
    setIsShowContent: mockSetIsShowContent,
    setIsShowArrDown: mockSetIsShowArrDown,
    setIsShowCounter: mockSetIsShowCounter,
    setCounterOfNewMessages: mockSetCounterOfNewMessages,
});

const FakeComponentUseFSM = ({
    authStore,
    chatStore,
    scrollTop,
    containerRef,
    setIsSmoothScroll,
    setIsShowContent,
    setIsShowArrDown,
    setIsShowCounter,
    setCounterOfNewMessages,
}: FSMArgs) => {
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
    return <div></div>;
};

const props = makeFakeProps();
const {rerender} = render(<FakeComponentUseFSM {...props}/>)
describe('Tests for useFSM hook', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('Should cause side effects like when the component is mounted', () => {
        (detectTypeOfEvent as jest.Mock).mockReturnValue(EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT);
        authStore.isHydrated = true;
        chatStore.isFetchedMessage = true;
        const props = makeFakeProps();
        rerender(<FakeComponentUseFSM {...props}/>);
        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowContent).toBeCalledWith(true);
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
    });
    it('Should cause side effect like when the component has been scrolled down, from INITIALIZED state', () => {
        (detectTypeOfEvent as jest.Mock).mockReturnValue(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM);
        const props = makeFakeProps();
        rerender(<FakeComponentUseFSM {...props}/>);
        expect(mockSetIsSmoothScroll).toBeCalledWith(true);
        expect(mockSetIsShowCounter).toBeCalledWith(false);
        expect(mockSetIsShowArrDown).toBeCalledWith(false);
        expect(mockSetCounterOfNewMessages).toBeCalledWith(0);

    });
});
