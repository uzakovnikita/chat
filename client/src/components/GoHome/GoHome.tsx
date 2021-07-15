import Link from 'next/dist/client/link';
import styled from 'styled-components';

const LinkContainer = styled.a`
    width: 150px;
    height: 100%;
    border-radius: ${(props) => props.theme.radiuses.big};
    background-image: ${(props) => props.theme.colors['purple-grad']};
    margin-left: 10px;
    cursor: pointer;
    border: none;
    outline: none;
    position: relative;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    &:after {
        transition: 1s;
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 0;
        background-image: ${(props) => props.theme.colors['blue-grad']};
        border-radius: ${(props) => props.theme.radiuses.big};
    }
    &:hover {
        &:after {
            opacity: 1;
        }
    }
`;

const Text = styled.span`
    color: ${(props) => props.theme.colors.white};
    font-family: ${(props) => props.theme.fonts.primary};
    font-size: 16px;
    z-index: 20;
    position: relative;
    text-align: center;
`;

const GoHome = () => {
    return (
        <Link href='/rooms' passHref>
            <LinkContainer href='/rooms'>
                <Text>Home</Text>
            </LinkContainer>
        </Link>
    );
};

export default GoHome;
