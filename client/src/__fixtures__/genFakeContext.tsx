import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

const genFakeContext = ({
    fakeCookie = 'fakeCookie',
    fakeId = 'fakeId',
}: {
    fakeCookie?: string;
    fakeId?: string;
}) =>
    ({
        req: {
            header: {
                cookie: fakeCookie,
            },
        },
        query: {
            id: fakeId,
        },
    } as unknown as GetServerSidePropsContext<ParsedUrlQuery>);
export default genFakeContext;
