import { message } from "../src/constants/types";

const fakeMessages: message[] = [
    {
        from: {
            email: 'email',
            _id: 'id1'
        },
        to: {
            email: 'email',
            _id: 'id2'
        },
        roomId: 'roomId1',
        messageBody: 'messageBody1',
        _id: 'message1'
    },
    {
        from: {
            email: 'email2',
            _id: 'id2'
        },
        to: {
            email: 'email3',
            _id: 'id3'
        },
        roomId: 'roomId2',
        messageBody: 'messageBody2',
        _id: 'message2'
    },
    {
        from: {
            email: 'email4',
            _id: 'id4'
        },
        to: {
            email: 'email5',
            _id: 'id5'
        },
        roomId: 'roomId3',
        messageBody: 'messageBody3',
        _id: 'message3'
    },
    {
        from: {
            email: 'email6',
            _id: 'id6'
        },
        to: {
            email: 'email7',
            _id: 'id7'
        },
        roomId: 'roomId4',
        messageBody: 'messageBody4',
        _id: 'message4'
    },
    {
        from: {
            email: 'email8',
            _id: 'id8'
        },
        to: {
            email: 'email9',
            _id: 'id9'
        },
        roomId: 'roomId5',
        messageBody: 'messageBody5',
        _id: 'message5'
    },

];

export default fakeMessages;