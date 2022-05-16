let default_state = {
    userModal: false,
    userState: "signedout"
}

export default (state = default_state, action) => {
    switch(action.type) {
        case "userModal":
            return { userModal: action.payload, ...state };
        case "loginAction":
            return { userState: action.payload, ...state }
        default:
            return state;        
    }
}