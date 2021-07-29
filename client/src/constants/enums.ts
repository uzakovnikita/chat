export enum URLS {
    Base = 'http://localhost:1000',
    BaseApi = 'http://localhost:1000/api',
    Login = 'auth/login',
    Signup = 'auth/register',
    Refresh = 'auth/refresh',
    IsLogin = '/auth/islogin',
    Logout = '/auth/logout',
    Rooms = '/rooms',
    SocketServer = 'http://localhost:1000',
    Messages = '/messages/',
    LastMessagesInRooms = '/lastmessagesinrooms',
};

export enum DAYS {
    Today = 'Today',
    Yesterday = 'Yesterday'
};

export enum MONTHS {
    JANUARY,
    FEBRUARY,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULE,
    AUGUST,
    SEPTEMBER,
    OCTOBER,
    NOVEMBER,
    DECEMBER
};

export enum EVENTS_OF_FSM_IN_PRIVATE_ROOM {
    INIT = 'INIT',
    NEW_MESSAGE_RECIEVED = 'NEW_MESSAGE_RECIEVED',
    SCROLLING_TO_TOP = 'SCROLLING_TO_TOP',
    SCROLLING_TO_BOTTOM = 'SCROLLING_TO_BOTTOM',
    SCROLLING_INTERMEDIATE = 'SCROLLING_INTERMEDIATE',
    NEW_MESSAGES_FETCHED = 'NEW_MESSAGES_FETCHED',
    NEW_MESSAGES_FETCHED_EMPTY = 'NEW_MESSAGES_FETCHED_EMPTY',
};

export enum STATES_OF_FSM_IN_PRIVATE_ROOM {
    SCROLLED_TO_BOTTOM = 'SCROLLED_TO_BOTTOM',
    SCROLLED_INTERMEDIATE = 'SCROLLED_INTERMEDIATE',
    SCROLLED_TO_THE_MAX_TOP = 'SCROLLED_TO_THE_MAX_TOP',
    NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM = 'NOT_FETCHING_HISTORY_SCROLLED_TO_BOTTOM',
    NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE = 'NOT_FETHCING_HISTORY_SCROLLED_INRERMEDIATE',
    NOT_FETHCING_HISTORY_SCROLLED_TO_TOP = 'NOT_FETHCING_HISTORY_SCROLLED_TO_TOP',
    FETCHING_MESSAGES = 'FETCHING_MESSAGES',
    INITIALIZED = 'INITIALIZED',
    UNINITIALIZED = 'UNINITIALIZED',
};

export enum ARIA_NAMES {
    MESSAGE_FORM = 'MESSAGE_FORM'
};
