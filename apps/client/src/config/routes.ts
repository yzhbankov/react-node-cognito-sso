export const routes = {
    auth: {
        login: '/login',
    },
    home: '/',
    error: {
        notAuthorized: '/not-authorized',
    },
};

export enum USER_ROLES {
    ADMIN = 'admin',
    USER = 'user',
}
