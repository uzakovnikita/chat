import styled from "styled-components";
import AuthService from "../../serivces/AuthService";
import { useRouter } from "next/router";

const LogoutButton = styled.button`
    width: 150px;
    height: 100%;
    border-radius: ${props => props.theme.radiuses.big};
    background-image: ${props => props.theme.colors['purple-grad']};
    margin-left: 10px;
    cursor: pointer;
    border: none;
    outline: none;
    position: relative;
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
        background-image: ${props=>props.theme.colors['blue-grad']};
        border-radius: ${props => props.theme.radiuses.big};
    }
    &:hover {
        &:after {
            opacity: 1;
        }
    }
`;

const LogoutText = styled.span`
    color: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.fonts.primary};
    font-size: 16px;
    z-index: 20;
    position: relative;
`;


const Logout = () => {
    const router = useRouter();
    const handleLogout = async () => {
        await AuthService.logout();
        router.push('/auth');
    };
    return (
        <LogoutButton onClick={handleLogout}>
            <LogoutText>Logout</LogoutText>
        </LogoutButton>
    )
};

export default Logout;