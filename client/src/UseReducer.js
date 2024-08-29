export const initialState = {
    type: null,
    payload: {loggedIn: false, loggedUser: null},
};

export const reducer = (state , action) => {
    if(action.type === "USER")
        return {
            ...state,
            loggedIn: action.payload.loggedIn,
            loggedUser: action.payload.loggedUser
        };
    
    return state;
}