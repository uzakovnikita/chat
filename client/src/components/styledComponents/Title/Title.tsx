import styled from 'styled-components';

const Title = styled.h2`
    color: ${props => props.theme.colors['white']};
    font-family: ${props => props.theme.fonts.primary};
    background: ${props=>props.theme.colors['purple-grad']};
    background-repeat: no-repeat;
    height: 90px;
    display: inline;
    width: 100%;
    padding: 20px;
    margin: 0;
    border-radius: ${props => props.theme.radiuses.big};
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