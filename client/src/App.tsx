import React from "react";
import { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import auth from './store/auth';
import common from './store/common';
import AuthPage from "./pages/authPage";
import ChatPage from './pages/chatPage';

const App: FunctionComponent = () => {
    
    return (
        <div>
            {common.error && common.error}
            {auth.isLogin && <ChatPage/>}
            {!auth.isLogin && <AuthPage/>}
        </div>
    )
};

export default observer(App);