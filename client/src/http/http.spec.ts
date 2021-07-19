import { URLS } from '../constants/enums';
import axios from 'axios';
import {api, startInterceptor} from './index';
jest.mock('axios');

describe('http configure', () => {
    it('should use credentials and base api url', () => {
        api();
        expect(axios.create.mock.calls).toEqual([[{withCredentials: true, baseURL: URLS.BaseApi}]])
    });
});