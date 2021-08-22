export const sleep = (milliseconds: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    })
};

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const YEAR = 365 * DAY;
