import React from 'react';
import {Common} from './sockets';
import {Chat} from './chat';
import {Auth} from './auth';

export const ContextCommon = React.createContext<Common | undefined>(undefined);
export const ContextChat = React.createContext<Chat | undefined>(undefined);
export const ContextAuth = React.createContext<Auth | undefined>(undefined);
