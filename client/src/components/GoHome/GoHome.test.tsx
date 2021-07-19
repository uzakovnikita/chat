import { shallow } from 'enzyme';
import GoHome from '.';
import { findByTestAttr } from '../../utils/findByTestAtrr';

describe('with enzyme', () => {
    it('Should render GoHome component', () => {
        const component = shallow(<GoHome />);
        const wrapper = findByTestAttr(component, 'GoHome');
        expect(wrapper.length).toBe(1);
    });
});
