import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { URLS } from '../constants/enums';
import {message, room} from '../constants/types';

export const isLogin = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>,
): Promise<{ status: boolean; user: { [key: string]: any } }> => {
    const cookies = '' + context.req.headers.cookie;
    const myHeaders = new Headers();
    const refreshToken = cookies
        .split('; ')
        .reduce((acc: string, el: string) => {
            const reg = /refreshToken=/;
            if (reg.test(el)) {
                return (acc = el.replace(/refreshToken=/, ''));
            }
            return acc;
        }, '');
    myHeaders.append('Authorization', `Refresh ${refreshToken}`);
    try {
        const response = await fetch(URLS.IsLogin, {
            headers: myHeaders,
        });
        if (response.ok) {
            const user = await response.json();
            return {
                status: true,
                user,
            };
        }
    } catch (err) {
        return {
            status: false,
            user: {
                data: null,
            },
        };
    }

    return {
        status: false,
        user: {
            data: null,
        },
    };
};

export const fetchDialogs = async (
    accessToken: string,
): Promise<{message: string, dialogs: room[]}> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const dialogs = await fetch(URLS.Rooms, {
        method: 'GET',
        headers: myHeaders,
    }).then((result) => result.json());
    return dialogs;
};

export const fetchMessages = async (accessToken: string, id: string): Promise<message[]> => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken}`);
    const messages = await fetch(`${URLS.Messages}?roomId=${id}&count=10`, {
        method: 'GET',
        headers: myHeaders
    }).then((result) => result.json());
    return messages;
}