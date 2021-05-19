import styled from 'styled-components';

const Text = styled.p`
    margin-bottom: 5px;
    font-size: 14px;
    font-family: ${props => props.theme.fonts.primary};
`;

export default Text;