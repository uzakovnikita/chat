import styled from 'styled-components';

const SendBox = styled.form`
    display: flex;
    position: relative;
    width: 100%;
    height: 10%;
    margin-top: 10px;
    border: 3px solid ${props => props.theme.colors['secondary-bg']};
    border-radius: 5px;
    padding: 5px;
    box-sizing: border-box;
`;

export default SendBox;