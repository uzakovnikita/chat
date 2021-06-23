import styled from 'styled-components';

const SendBox = styled.form`
    display: flex;
    position: relative;
    width: 100%;
    height: 10%;
    margin-top: 10px;
    border: 2px solid ${props => props.theme.colors['blue-highlights']};
    border-radius: 3px;
    background-color: ${props => props.theme.colors['white']};
    border-radius: 5px;
    padding: 5px;
    box-sizing: border-box;
    align-items: center;
`;

export default SendBox;