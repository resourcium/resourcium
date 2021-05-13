import { createStore } from 'redux';

function reducer(state = {}, action) {
    const newState = { ...state };
    switch (action.type) {
    case 'LOGIN':
        newState.user = action.user;
        newState.token = action.token;
        return newState;
    case 'LOGOUT':
        return {};
    case 'SETTINGS_UPDATE':
        newState.settings = action.newSettings;
        return newState;
    default:
        return state;
    }
}

export default createStore(
    reducer,
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? // Enable redux dev tools in development mode
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__()
        : undefined
);
