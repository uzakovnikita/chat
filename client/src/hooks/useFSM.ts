/* eslint-disable react-hooks/exhaustive-deps */
import { runInAction } from 'mobx';
import { useEffect, useRef } from 'react';
import {
    EVENTS_OF_FSM_IN_PRIVATE_ROOM,
    STATES_OF_FSM_IN_PRIVATE_ROOM,
} from '../constants/enums';
import { FSMArgs } from '../constants/types';
import { api, startInterceptor } from '../http';
import MessagesService from '../services/MessagesService';

import detectTypeOfEvent from '../utils/detectTypeOfEvent';

// FSM HOOK - используется для упрощения работы с различными положениями скролла
// в зависимости от комбинации типа события и состояние(stateMachine) мы получаем необходимые побочные эффекты и новое состояние stateMachine
// тип события определяется с помощью функции detectTypeOfEvent
// иногда тип события не может быть определен через параметры функции detectTypeOfEvent,
// тогда новый тип события генерируется прямо в хуке и записывается в переменную selfGeneratingEvent

const useFSM: (args: FSMArgs) => void = ({
    authStore,
    chatStore,
    scrollTop,
    containerRef,
    setIsSmoothScroll,
    setIsShowContent,
    setIsShowArrDown,
    setIsShowCounter,
    setCounterOfNewMessages,
}) => {
    const stateMachine = useRef(STATES_OF_FSM_IN_PRIVATE_ROOM.UNINITIALIZED);
    const selfGeneratingEvent = useRef<
        keyof typeof EVENTS_OF_FSM_IN_PRIVATE_ROOM | null
    >(null);
    const prevNumberOfMessages = useRef(chatStore.messages.length);
    const isHydrated = useRef(false);
    const counterOfMessages = useRef(0);

    return useEffect(() => {
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
                        setIsSmoothScroll(true);
                        isHydrated.current = true;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM: {
                setIsSmoothScroll(true);
                setIsShowCounter(false);
                setIsShowArrDown(false);
                setCounterOfNewMessages(0);
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
                        setIsSmoothScroll(false);
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
                setIsSmoothScroll(true);
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
                setIsSmoothScroll(true);
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
                        const isFromSelfMsg =
                            lastMessage.from._id === authStore.id;
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
                        const isFromSelfMsg =
                            lastMessage.from._id === authStore.id;
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
                        const isFromSelfMsg =
                            lastMessage.from._id === authStore.id;
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
                        const isFromSelfMsg =
                            lastMessage.from._id === authStore.id;
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
                        const isFromSelfMsg =
                            lastMessage.from._id === authStore.id;
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
                        const isFromSelfMsg =
                            lastMessage.from._id === authStore.id;
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
        authStore.isHydrated,
        chatStore.isFetchedMessage,
        chatStore.messages.length,
        scrollTop,
        chatStore.idCurrentPrivateRoom,
    ]);
};

export default useFSM;
