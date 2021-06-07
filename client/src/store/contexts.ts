import React from 'react';
import {Chat} from './chat';
import {Auth} from './auth';

export const ContextChat = React.createContext<Chat | undefined>(undefined);
export const ContextAuth = React.createContext<Auth | undefined>(undefined);
