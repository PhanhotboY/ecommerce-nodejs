export const REDIS = {
  EVENTS: {
    CONNECT: 'connect',
    READY: 'ready',
    RECONNECTING: 'reconnecting',
    ERROR: 'error',
    END: 'end',
  },
  MAX_RETRIES: 10,
  RETRY_TIMEOUT: 10000,
  RETRY_MESSAGE: {
    CODE: -99,
    VN: 'Hệ thống đang bận, vui lòng thử lại sau',
    EN: 'System is busy, please try again later',
  },
};
