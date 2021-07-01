import styled from 'styled-components';



const Card = styled.div`
    width: 100%;
    height: 80px;
    position: relative;
    background: ${props => props.theme.colors['blue-grad']};
    border-radius: ${props => props.theme.radiuses.medium};
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 16px;
    font-family: ${props => props.theme.fonts.primary};
    font-weight: 600;
    color: ${props =>props.theme.colors['white']};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    box-sizing: border-box;

    &:hover {
        &:after {
            opacity: 1;
        }
        
    }

    &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${props => props.theme.colors['light-blue-grad']};
        border-radius: ${props => props.theme.radiuses.medium};
        box-sizing: border-box;
        opacity: 0;
        transition: 1s;
    }
`;

export default Card;
