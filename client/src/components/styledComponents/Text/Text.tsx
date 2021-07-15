import styled from 'styled-components';

const Text = styled.p`
    margin-bottom: 5px;
    font-size: 18px;
    font-family: ${props => props.theme.fonts.primary};
    color: ${props => props.theme.colors['blue-32-a8']};
`;

export default Text;