import styled from 'styled-components';

const Title = styled.h2`
    color: ${props => props.theme.colors['white']};
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props=>props.theme.colors['blue-highlights']};
    height: 90px;
    display: inline;
    width: auto;
    padding: 20px;
    margin: 0;
    border-radius: 20px;
    line-height: 50px;
    box-sizing: border-box;
    margin-bottom: 20px;

    @media screen and (max-width: 468px) {
        font-size: 16px;
        height: 50px;
        padding: 8px;
        line-height: 34px;
    }
`;
export default Title;