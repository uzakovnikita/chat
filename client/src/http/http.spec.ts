import { URLS } from '../constants/enums';
import axios from 'axios';
import { api, startInterceptor } from './index';

jest.mock('axios');

describe('http configure', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    it('should use credentials and base api url', () => {
        api();
        expect((axios.create as jest.Mock).mock.calls).toEqual([
            [{ withCredentials: true, baseURL: URLS.BaseApi }],
        ]);
    });
    it('should use interceptors for setting bearer token', () => {
        const use = jest.fn();
        (axios.create as jest.Mock).mockImplementation(() => {
            return {
                create: jest.fn(),
                interceptors: {
                    request: { use, eject: jest.fn() },
                },
            };
        });
        startInterceptor('fakeToken', api());
        const middlewareCb = use.mock.calls[0][0];
        const config = {
            headers: {
                Authorization: '',
            },
        };
        middlewareCb(config);
        expect(config).toEqual({
            headers: { Authorization: 'Bearer fakeToken' },
        });
    });
});
