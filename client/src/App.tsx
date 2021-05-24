import React from "react";
import { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import AuthPage from "./pages/authPage";
import ChatPage from './pages/chatPage';
import Main from "./components/styledComponents/Main";
import './App.css';

const App: FunctionComponent = () => {
    
    return (
        <Main>
            {common.error && common.error}
            {auth.isLogin && <ChatPage/>}
            {!auth.isLogin && <AuthPage/>}
        </Main>
    )
};

export default observer(App);