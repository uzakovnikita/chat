import React from 'react';
import {Common} from './chat';
import {Chat} from './chat_';
import {Auth} from './auth';

export const ContextCommon = React.createContext<Common | undefined>(undefined);
export const ContextChat = React.createContext<Chat | undefined>(undefined);
export const ContextAuth = React.createContext<Auth | undefined>(undefined);
