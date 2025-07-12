const getTimeStamp = () => new Date().toISOString();

export const logger = {
    info: (msg, ...args) => {
        console.log(`[${getTimeStamp()}] INFO: ${msg}`, ...args);
    },
    error: (msg, ...args) => {
        console.error(`[${getTimeStamp()}] ERROR: ${msg}`, ...args);
    },
    warn: (msg, ...args) => {
        console.warn(`[${getTimeStamp()}] WARN: ${msg}`, ...args);
    },
    debug: (msg, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[${getTimeStamp()}] DEBUG: ${msg}`, ...args);
        }
    }
};