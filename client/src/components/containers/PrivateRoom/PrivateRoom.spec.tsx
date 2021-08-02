import { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import PrivateRoom from '.';

import prepareWrappForPage from '../../../utils/prepareWrappForPage';

import useFSM from '../../../hooks/useFSM';

import Auth from '../../../store/Auth';
import Chat from '../../../store/Chat';
import ErrorsLogs from '../../../store/ErrorsLogs';

import fakeMessages from '../../../../__fixtures__/fakeMessages';
import { ARIA_LABELS, ROLES } from '../../../constants/enums';
import { act } from 'react-dom/test-utils';

jest.mock('../../../hooks/useFSM');

const fakeName = 'fakeName';
const fakeEmail = 'fakeEmail';
const fakeId = 'fakeId';

describe('PrivateRoom test with RTL', () => {
    const chatStore = new Chat();
    const authStore = new Auth();
    const errorsLogsStore = new ErrorsLogs();

    jest.spyOn(chatStore, 'send');

    beforeAll(() => {
        chatStore.interlocutorName = fakeName;
        authStore.email = fakeEmail;
        authStore.id = fakeId;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should render PrivateRoom', async () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        const privateRoomComponent = screen.getByRole('form');
        expect(privateRoomComponent).toBeInTheDocument();
        const nameOfRoom = screen.getByRole('heading');
        expect(nameOfRoom).toHaveTextContent(fakeName);
    });
    it('Should render messages', () => {
        chatStore.messages = fakeMessages;
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        for (const message of fakeMessages) {
            const messageInDocument = screen.getByText(message.messageBody);
            expect(messageInDocument).toBeInTheDocument();
        }
    });
    it('Should type text in message input', () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        const input = screen.getByRole('textbox');
        userEvent.click(input);
        userEvent.type(input, fakeName);
        expect(input.textContent).toBe(fakeName);
    });
    it('Should send message', () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', {
            name: ARIA_LABELS.SEND_MESSAGE,
        });

        userEvent.type(input, fakeName);
        fireEvent.click(button);
        expect(input.textContent).toBe('');
        expect(chatStore.send).toBeCalledWith(fakeName, {
            email: fakeEmail,
            _id: fakeId,
        });
        jest.clearAllMocks();

        userEvent.type(input, fakeName);
        fireEvent.submit(input);
        expect(input.textContent).toBe('');
        expect(chatStore.send).toBeCalledWith(fakeName, {
            email: fakeEmail,
            _id: fakeId,
        });
        jest.clearAllMocks();

        userEvent.type(input, fakeName);
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(input.textContent).toBe('');
        expect(chatStore.send).toBeCalledWith(fakeName, {
            email: fakeEmail,
            _id: fakeId,
        });
        jest.clearAllMocks();

        fireEvent.keyDown(input, { key: 'Enter' });
        expect(input.textContent).toBe('');
        expect(chatStore.send).not.toBeCalled();
        jest.clearAllMocks();

        userEvent.click(button);
        expect(input.textContent).toBe('');
        expect(chatStore.send).not.toBeCalled();
        jest.clearAllMocks();
    });
    it('Should show and then auto hide tooltip', async () => {
        (useFSM as jest.Mock).mockImplementation(({ setIsShowContent }) =>
            useEffect(() => {
                setIsShowContent(true);
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []),
        );

        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        const { baseElement } = render(page);
        const messagesContainer = screen.getByRole(ROLES.MESSAGES_CONTAINER);
        const listOfDataTooltips = await screen.findAllByRole(
            ROLES.DATE_TOOLTIP,
        );
        const tooltip = listOfDataTooltips[0];
        act(() => {
            fireEvent.mouseMove(baseElement);
        });
        expect(tooltip).toBeVisible();

        await act(async () => {
            await new Promise((resolve) => setTimeout(() => resolve(''), 2100));
        });
        expect(tooltip).not.toBeVisible();

        act(() => {
            fireEvent.scroll(messagesContainer);
        });
        expect(tooltip).toBeVisible();
    });
    it('Should scroll down on click', () => {
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);

        const messagesContainer = screen.getByRole(ROLES.MESSAGES_CONTAINER);
        const btn = screen.getByRole(ROLES.DOWN_ARROW);

        act(() => {
            fireEvent.scroll(messagesContainer, {
                targer: {
                    scrollTop: 1600,
                },
            });
            userEvent.click(btn);
        });

        expect(messagesContainer.scrollTop).toBe(
            messagesContainer.scrollHeight - messagesContainer.clientHeight,
        );
    });
    it('Should set smooth scroll', () => {
        (useFSM as jest.Mock).mockImplementation(({ setIsSmoothScroll }) =>
            useEffect(() => {
                setIsSmoothScroll(true);
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []),
        );

        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);
        const messagesContainer = screen.getByRole(ROLES.MESSAGES_CONTAINER);
        expect(messagesContainer).toHaveClass('smooth');
    });
    it('Should set that recievied message from self', () => {
        const lastMessage = chatStore.messages[chatStore.messages.length - 1];
        lastMessage.from = { _id: fakeId, email: fakeEmail };
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);

        const renderedLastMessage = screen.getByText(
            fakeMessages[fakeMessages.length - 1].messageBody,
        );

        expect(renderedLastMessage).toHaveStyle('align-self: flex-end');
    });
    it('Should show messages counter', () => {
        (useFSM as jest.Mock).mockImplementation(({ setIsShowCounter, setCounterOfNewMessages, setIsShowContent }) =>
            useEffect(() => {
                setIsShowCounter(true);
                setCounterOfNewMessages(1);
                setIsShowContent(true);
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []),
        );
        
        const page = prepareWrappForPage(PrivateRoom, {
            chatStore,
            authStore,
            errorsLogsStore,
        });
        render(page);

        const counter = screen.getByRole('button', { name: '1' });
        expect(counter).toBeInTheDocument();
        expect(counter).toBeVisible();
    });
});
