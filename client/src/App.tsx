import { FunctionComponent, useContext } from "react";
import { observer } from "mobx-react-lite";
import AuthPage from "./pages/authPage";
import ChatPage from './pages/chatPage';
import Main from "./components/styledComponents/Main";
import './App.css';
import { ContextAuth } from "./store/contexts";
import { Auth } from "./store/auth";

const App: FunctionComponent = () => {
    const auth = useContext(ContextAuth) as Auth;
    return (
        <Main>
            {auth.isLogin && <ChatPage/>}
            {!auth.isLogin && <AuthPage/>}
        </Main>
    )
};

export default observer(App);