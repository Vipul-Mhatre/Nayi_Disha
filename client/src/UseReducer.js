export const reducer = (state, action) => {
    switch (action.type) {
      case "charity":
      case "organization":
        return {
          ...state,
          loggedIn: action.payload.loggedIn,
          loggedUser: action.payload.loggedUser,
        };
      default:
        return state;
    }
  };
  
  export const initialState = {
    type: null,
    loggedIn: false,
    loggedUser: null,
  };