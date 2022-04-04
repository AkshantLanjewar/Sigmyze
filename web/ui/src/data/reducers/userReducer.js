export default (state, action) => {
    switch(action.type) {
        case "userModal":
            return { userModal: action.payload };
        default:
            return state;        
    }
}