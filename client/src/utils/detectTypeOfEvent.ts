import { EVENTS_OF_FSM_IN_PRIVATE_ROOM } from '../constants/enums';

const detectTypeOfEvent = (isFetchedMessages: boolean, lengthListOfMessages: number, oldLengthListOfMessages: number, container: HTMLDivElement): string => {
    if (isFetchedMessages && oldLengthListOfMessages === 0) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT;
    }
    if (isFetchedMessages && lengthListOfMessages !== oldLengthListOfMessages) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED;
    }
    if (container.scrollTop === 0) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP;
    } else if (container.scrollTop + container.clientHeight === container.scrollHeight) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM;
    } else {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE;
    }
};

export default detectTypeOfEvent;