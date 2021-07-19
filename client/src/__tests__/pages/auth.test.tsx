import {shallow} from 'enzyme';

import AuthPage from '../../pages/auth';

describe('with enzyme', () => {
    describe('AuthPage', () => {
        it('Should render AuthPage', () => {
            const page = shallow(<AuthPage/>);
            const wrapper = page.find('.auth');
            expect(wrapper.length).toBe(1);
        });
    });
});