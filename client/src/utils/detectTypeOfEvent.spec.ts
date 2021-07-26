import detectTypeOfEvent from './detectTypeOfEvent';

import { EVENTS_OF_FSM_IN_PRIVATE_ROOM } from '../constants/enums';
import { detectTypeOfEventArgs } from '../constants/types';


const config = {
    isHydratedOld: false,
    isHydratedNew: true,
    isFetchedMessages: false,
    lengthListOfMessages: 0,
    oldLengthListOfMessages: 0,
    container: {
        clientHeight: 100,
        scrollTop: 100,
        scrollHeight: 1100,
    } as HTMLDivElement,
};

const makeArgs = (conf: typeof config) => {
    const result: detectTypeOfEventArgs = [
        conf.isHydratedOld,
        conf.isHydratedNew,
        conf.isFetchedMessages,
        conf.lengthListOfMessages,
        conf.oldLengthListOfMessages,
        conf.container,
    ];
    return result;
};

describe('Tests for detect type of event', () => {    
    it('Should return INIT', () => {
        config.isFetchedMessages = true;
        const args = makeArgs(config) as detectTypeOfEventArgs;
        expect(detectTypeOfEvent(...args)).toBe(EVENTS_OF_FSM_IN_PRIVATE_ROOM.INIT);
        config.isHydratedOld = true;
    });
    it('Should return NEW_MESSAGE_RECIEVED', () => {
        config.lengthListOfMessages = 100;
        config.oldLengthListOfMessages = 0;
        const args = makeArgs(config) as detectTypeOfEventArgs;
        expect(detectTypeOfEvent(...args)).toBe(EVENTS_OF_FSM_IN_PRIVATE_ROOM.NEW_MESSAGE_RECIEVED);
        config.oldLengthListOfMessages = 100;
    });
    it('Should return SCROLLING_TO_TOP', () => {
        config.container.scrollTop = 0;
        const args = makeArgs(config) as detectTypeOfEventArgs;
        expect(detectTypeOfEvent(...args)).toBe(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_TOP);
    });
    it('Should return SCROLLING_TO_BUTTON', () => {
        config.container.scrollTop = 1000;
        const args = makeArgs(config) as detectTypeOfEventArgs;
        expect(detectTypeOfEvent(...args)).toBe(EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_TO_BOTTOM);
    });
    it('Should return SCROLLING_TO_INTERMEDIATE', () => {
        config.container.scrollTop = 500;
        const args = makeArgs(config) as detectTypeOfEventArgs;
        expect(detectTypeOfEvent(...args)).toBe(
            EVENTS_OF_FSM_IN_PRIVATE_ROOM.SCROLLING_INTERMEDIATE,
        );
    });
});
