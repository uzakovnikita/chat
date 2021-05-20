import styled from 'styled-components';

const AuthInput = styled.input`
    width: 100%;
    height: 25px;
    font-family: ${props => props.theme.fonts.primary};
    font-size: 16px;
    background-color: ${props => props.theme.colors['primary-bg']};
    color: ${props => props.theme.colors['blue-32-a8']};
    outline: none;
    border: none;
    margin-bottom: 5px;
    padding: 5px;
    border-radius: 3px;
`;

export default AuthInput;