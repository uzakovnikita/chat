import React from 'react';
import Chat from './Chat';
import Auth from './Auth';
import ErrorsLogs from './ErrorsLogs';


export const ContextChat = React.createContext<Chat | undefined>(undefined);
export const ContextAuth = React.createContext<Auth | undefined>(undefined);
export const ContextErrorsLogs = React.createContext<ErrorsLogs | undefined>(undefined);
