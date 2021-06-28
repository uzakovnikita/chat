import { parseISO, differenceInCalendarDays, getMonth  } from 'date-fns';

import {MONTHS} from '../constants/enums';

const dateToText = (date: string): string => {
    const parsedDate = parseISO(date);
    const today = Date.now();
    const result = differenceInCalendarDays(today, parsedDate);
    if (result > 2) {
        const month = MONTHS[getMonth(parsedDate)];
        const day = date.split('-')[2];
        return `${day} ${month}`;
    }
    if (result === 2) {
        return 'DAY BEFORE YESTERDAY';
    }
    if (result === 1) {
        return 'YESTERDAY';
    }

    return 'TODAY';


};

export default dateToText;