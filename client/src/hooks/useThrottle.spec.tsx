import { mount, ReactWrapper } from 'enzyme';
import { Component } from 'react';
import FakeComponent from '../__fixtures__/FakeComponent';

const mockCallBack = jest.fn();

jest.useFakeTimers();
describe('useThrottle test', () => {
    let page: undefined | ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>>;
    
    beforeAll(() => {
        page = mount(<FakeComponent cb={mockCallBack}/>);
    });

    afterAll(() => {
        jest.resetAllMocks();
    })

    it('Should call function-callback', () => {
        jest.advanceTimersByTime(10);
        expect(mockCallBack).toHaveBeenCalled();
    });
    it('Should skip function calls until two seconds pass', () => {
        jest.advanceTimersByTime(500);
        expect(mockCallBack.mock.calls.length).toBe(1);
        jest.advanceTimersByTime(1000);
        expect(mockCallBack.mock.calls.length).toBe(1);
        jest.advanceTimersByTime(400);
        expect(mockCallBack.mock.calls.length).toBe(1);
    });
    it('Should call function-callback after two second again', () => {
        jest.advanceTimersByTime(100);
        expect(mockCallBack.mock.calls.length).toBe(2);
    });
    it('Should skip every functions calls when page has been unmount', () => {
        page?.unmount();
        jest.advanceTimersByTime(4000);
        expect(mockCallBack.mock.calls.length).toBe(2);
    });
})