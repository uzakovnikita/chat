import { EVENTS_OF_FSM_IN_PRIVATE_ROOM } from '../constants/enums';
import { detectTypeOfEventArgs } from '../constants/types';

const detectTypeOfEvent: (...args: detectTypeOfEventArgs) => string = (
    isHydratedOld,
    isHydratedNew,
    isFetchedMessages,
    lengthListOfMessages,
    oldLengthListOfMessages,
    container,
) => {
    console.log(container.scrollTop, 'scrollTop');
    console.log(container.clientHeight, 'clientHeight');;
    console.log(container.scrollHeight, 'scrollHeight');
    if (!isHydratedOld && isHydratedNew && isFetchedMessages) {
        
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT;
    }
    if (isFetchedMessages && lengthListOfMessages !== oldLengthListOfMessages) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED;
    }
    if (container.scrollTop === 0) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP;
    }
    if (
        container.scrollTop + container.clientHeight ===
        container.scrollHeight
    ) {
        return EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM;
    }
    return EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE;
};

export default detectTypeOfEvent;
