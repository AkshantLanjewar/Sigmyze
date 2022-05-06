let default_state = {
    userModal: false
}

export default (state = default_state, action) => {
    switch(action.type) {
        case "userModal":
            return { userModal: action.payload };
        default:
            return state;        
    }
}