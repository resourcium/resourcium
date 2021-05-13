export function login(user, token) {
    return { type: 'LOGIN', token, user };
}

export function logout() {
    return { type: 'LOGOUT' };
}

export function updateSettings(newSettings) {
    return { type: 'SETTINGS_UPDATE', newSettings };
}
